'use client';

import React from 'react';
import AdminNav from '@/components/admin-nav';
import { createClient } from '@/utils/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminFilters from '@/components/admin-filters';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PurchaseWithGift {
  id: string;
  gift_id: string;
  buyer_name: string;
  buyer_surname: string;
  home_delivery: boolean;
  estimated_delivery_date: string | null;
  created_at: string;
  gifts: {
    name: string;
    price: number;
    store: string;
  };
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<PurchaseWithGift[]>([]);
  const [nameFilter, setNameFilter] = React.useState('');
  const [priceRange, setPriceRange] = React.useState('all');
  const [storeFilter, setStoreFilter] = React.useState('all');
  const [buyerFilter, setBuyerFilter] = React.useState('');
  const [giftToDelete, setGiftToDelete] = React.useState<PurchaseWithGift | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const supabase = createClient();

  const fetchPurchases = React.useCallback(async () => {
    const { data } = await supabase
      .from('purchases')
      .select(`
        *,
        gifts (
          name,
          price,
          store
        )
      `)
      .order('created_at', { ascending: false });

    setPurchases(data || []);
  }, [supabase]);

  React.useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // Get unique stores for filter dropdown
  const stores = React.useMemo(() => {
    const uniqueStores = new Set(purchases.map(purchase => purchase.gifts.store));
    return Array.from(uniqueStores).sort();
  }, [purchases]);

  // Filter purchases
  const filteredPurchases = React.useMemo(() => {
    return purchases.filter(purchase => {
      // Name filter
      const nameMatch = purchase.gifts.name.toLowerCase().includes(nameFilter.toLowerCase());

      // Store filter
      const storeMatch = storeFilter === 'all' || purchase.gifts.store === storeFilter;

      // Price range filter
      let priceMatch = true;
      if (priceRange !== 'all') {
        if (priceRange === '500-plus') {
          priceMatch = purchase.gifts.price >= 500;
        } else {
          const [min, max] = priceRange.split('-').map(Number);
          priceMatch = purchase.gifts.price >= min && purchase.gifts.price <= max;
        }
      }

      // Buyer filter
      const buyerMatch = !buyerFilter ||
        `${purchase.buyer_name} ${purchase.buyer_surname}`
          .toLowerCase()
          .includes(buyerFilter.toLowerCase());

      return nameMatch && storeMatch && priceMatch && buyerMatch;
    });
  }, [purchases, nameFilter, priceRange, storeFilter, buyerFilter]);

  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!giftToDelete) return;

    setIsDeleting(true);

    try {
      // First, update the gift to be available again
      const { error: giftError } = await supabase
        .from('gifts')
        .update({ purchased: false })
        .eq('id', giftToDelete.gift_id);

      if (giftError) throw giftError;

      // Then delete the purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .delete()
        .eq('id', giftToDelete.id);

      if (purchaseError) throw purchaseError;

      // Update local state
      setPurchases(purchases.filter(p => p.id !== giftToDelete.id));
      setGiftToDelete(null);
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex h-14 items-center">
            <AdminNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-7xl mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Presentes Comprados</h1>
          </div>

          <AdminFilters
            nameFilter={nameFilter}
            onNameFilterChange={setNameFilter}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            storeFilter={storeFilter}
            onStoreFilterChange={setStoreFilter}
            stores={stores}
            showBuyerFilter={true}
            buyerFilter={buyerFilter}
            onBuyerFilterChange={setBuyerFilter}
          />

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Compra</TableHead>
                  <TableHead>Presente</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Data Estimada</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      {format(new Date(purchase.created_at), "dd 'de' MMMM', às ' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{purchase.gifts.name}</div>
                        <div className="text-sm text-muted-foreground">{purchase.gifts.store}</div>
                      </div>
                    </TableCell>
                    <TableCell>{`${purchase.buyer_name} ${purchase.buyer_surname}`}</TableCell>
                    <TableCell>
                      {purchase.home_delivery ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Entrega em Casa
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                          Entrega pelo Convidado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {purchase.estimated_delivery_date ? (
                        format(new Date(purchase.estimated_delivery_date), "dd 'de' MMMM", {
                          locale: ptBR,
                        })
                      ) : (
                        "Não informada"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(purchase.gifts.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setGiftToDelete(purchase);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPurchases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum presente foi comprado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              Esta ação não pode ser desfeita. O presente será removido da lista de comprados
              e voltará a estar disponível para compra.
            </AlertDialogDescription>
            {giftToDelete && (
              <div className="mt-4 space-y-2 rounded-lg border p-4 text-sm">
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="font-medium">Presente:</span>
                  <span>{giftToDelete.gifts.name}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="font-medium">Comprador:</span>
                  <span>{giftToDelete.buyer_name} {giftToDelete.buyer_surname}</span>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                'Deletar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}