'use client';

import React from 'react';
import AdminNav from '@/components/admin-nav';
import GiftForm from '@/components/gift-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import type { Gift } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Edit2, Trash2, Plus } from 'lucide-react';
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
import AdminFilters from '@/components/admin-filters';

export default function AdminPage() {
  const [gifts, setGifts] = React.useState<Gift[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedGift, setSelectedGift] = React.useState<Gift | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [giftToDelete, setGiftToDelete] = React.useState<Gift | null>(null);

  const supabase = createClient();

  const [nameFilter, setNameFilter] = React.useState('');
  const [priceRange, setPriceRange] = React.useState('all');
  const [storeFilter, setStoreFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const fetchGifts = React.useCallback(async () => {
    const { data } = await supabase
      .from('gifts')
      .select('*')
      .order('purchased', { ascending: true })
      .order('created_at', { ascending: true });

    setGifts(data || []);
  }, [supabase]);

  React.useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  // Get unique stores for filter dropdown
  const stores = React.useMemo(() => {
    const uniqueStores = new Set(gifts.map(gift => gift.store));
    return Array.from(uniqueStores).sort();
  }, [gifts]);

  // Filter and sort gifts
  const filteredGifts = React.useMemo(() => {
    return gifts.filter(gift => {
      // Name filter
      const nameMatch = gift.name.toLowerCase().includes(nameFilter.toLowerCase());

      // Store filter
      const storeMatch = storeFilter === 'all' || gift.store === storeFilter;

      // Price range filter
      let priceMatch = true;
      if (priceRange !== 'all') {
        if (priceRange === '500-plus') {
          priceMatch = gift.price >= 500;
        } else {
          const [min, max] = priceRange.split('-').map(Number);
          priceMatch = gift.price >= min && gift.price <= max;
        }
      }

      // Status filter
      let statusMatch = true;
      if (statusFilter !== 'all') {
        statusMatch = statusFilter === 'available' ? !gift.purchased : gift.purchased;
      }

      return nameMatch && storeMatch && priceMatch && statusMatch;
    });
  }, [gifts, nameFilter, priceRange, storeFilter, statusFilter]);

  const handleAddEdit = async (data: Omit<Gift, 'id' | 'purchased'>) => {
    if (selectedGift) {
      // Edit
      const { error } = await supabase
        .from('gifts')
        .update(data)
        .eq('id', selectedGift.id);

      if (error) throw error;
    } else {
      // Add
      const { error } = await supabase
        .from('gifts')
        .insert([{ ...data, purchased: false }]);

      if (error) throw error;
    }

    fetchGifts();
    setSelectedGift(undefined);
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    if (!giftToDelete) return;

    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('id', giftToDelete.id);

    if (error) {
      console.error('Error deleting gift:', error);
      return;
    }

    fetchGifts();
    setGiftToDelete(null);
    setIsDeleteDialogOpen(false);
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
            <h1 className="text-2xl font-bold">Gerenciar Presentes</h1>
            <Button onClick={() => {
              setSelectedGift(undefined);
              setIsFormOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Presente
            </Button>
          </div>

          <AdminFilters
            nameFilter={nameFilter}
            onNameFilterChange={setNameFilter}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            storeFilter={storeFilter}
            onStoreFilterChange={setStoreFilter}
            stores={stores}
            showStatusFilter={true}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGifts.map((gift) => (
                  <TableRow key={gift.id}>
                    <TableCell className="font-medium">{gift.name}</TableCell>
                    <TableCell>{gift.store}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(gift.price)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        gift.purchased
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {gift.purchased ? 'Comprado' : 'Disponível'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedGift(gift);
                          setIsFormOpen(true);
                        }}
                        disabled={gift.purchased}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setGiftToDelete(gift);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={gift.purchased}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredGifts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum presente cadastrado ainda com esses filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <GiftForm
        gift={selectedGift}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedGift(undefined);
        }}
        onSubmit={handleAddEdit}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O presente será removido permanentemente da lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}