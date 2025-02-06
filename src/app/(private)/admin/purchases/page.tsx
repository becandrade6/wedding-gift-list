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
  const supabase = createClient();

  const fetchPurchases = async () => {
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
  };

  React.useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <AdminNav />
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Presentes Comprados</h1>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Compra</TableHead>
                  <TableHead>Presente</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Data Estimada</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
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
                  </TableRow>
                ))}

                {purchases.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum presente foi comprado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}