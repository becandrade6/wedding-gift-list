'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Gift } from '@/types';
import GiftCard from './gift-card';
import GiftFilters from './gift-filters';
import PurchaseDialog from './purchase-dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GiftListProps {
  gifts: Gift[];
}

const ITEMS_PER_PAGE = 12;

export function GiftList({ gifts: initialGifts }: GiftListProps) {
  const [gifts, setGifts] = useState(initialGifts);
  const [nameFilter, setNameFilter] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  // Polling para atualizar a lista de presentes
  useEffect(() => {
    const fetchGifts = async () => {
      const supabase = createClient();
      const { data: updatedGifts, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && updatedGifts) {
        setGifts(updatedGifts);
      }
    };

    // Atualiza imediatamente ao montar
    fetchGifts();

    // Configura o intervalo de polling (5 segundos)
    const interval = setInterval(fetchGifts, 2500);

    // Limpa o intervalo ao desmontar
    return () => clearInterval(interval);
  }, []);

  // Get unique stores for filter dropdown
  const stores = useMemo(() => {
    const uniqueStores = new Set(gifts.map(gift => gift.store));
    return Array.from(uniqueStores).sort();
  }, [gifts]);

  // Filter gifts based on selected filters and availability
  const filteredGifts = useMemo(() => {
    return gifts.filter(gift => {
      // Filter out purchased gifts
      if (gift.purchased) return false;

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

      return nameMatch && storeMatch && priceMatch;
    });
  }, [gifts, nameFilter, priceRange, storeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredGifts.length / ITEMS_PER_PAGE);
  const paginatedGifts = filteredGifts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, priceRange, storeFilter]);

  const handlePurchase = (gift: Gift) => {
    setSelectedGift(gift);
    setDialogOpen(true);
  };

  const handlePurchaseConfirm = async (data: {
    gift_id: string;
    buyer_name: string;
    buyer_surname: string;
    home_delivery: boolean;
    estimated_delivery_date?: Date;
  }) => {
    const supabase = createClient();

    try {
      // Verifica se o presente ainda está disponível
      const { data: currentGift, error: checkError } = await supabase
        .from('gifts')
        .select('purchased')
        .eq('id', data.gift_id)
        .single();

      if (checkError || !currentGift) {
        throw new Error('Erro ao verificar disponibilidade do presente');
      }

      if (currentGift.purchased) {
        toast({
          title: "Presente indisponível",
          description: "Desculpe, este presente já foi escolhido por outra pessoa.",
          variant: "destructive",
        });
        setDialogOpen(false);
        return;
      }

      // Atualiza o presente como comprado
      const { error: updateError } = await supabase
        .from('gifts')
        .update({ purchased: true })
        .eq('id', data.gift_id);

      if (updateError) throw updateError;

      // Registra a compra
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert([{
          ...data,
          created_at: new Date().toISOString()
        }]);

      if (purchaseError) throw purchaseError;

      // Envia o email de confirmação
      const gift = gifts.find(g => g.id === data.gift_id);
      if (!gift) throw new Error('Presente não encontrado');

      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftName: gift.name,
          buyerName: data.buyer_name,
          buyerSurname: data.buyer_surname,
          homeDelivery: data.home_delivery,
          estimatedDeliveryDate: data.estimated_delivery_date,
          price: gift.price
        }),
      });

      toast({
        title: "Presente reservado com sucesso!",
        description: "Obrigado por sua contribuição para nosso novo lar.",
      });

      setDialogOpen(false);
      setSelectedGift(null);

    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast({
        title: "Erro ao reservar presente",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <GiftFilters
          nameFilter={nameFilter}
          onNameFilterChange={setNameFilter}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          storeFilter={storeFilter}
          onStoreFilterChange={setStoreFilter}
          stores={stores}
        />
      </div>

      {filteredGifts.length === 0 ? (
        <div className="text-center py-12">
          {gifts.every(gift => gift.purchased) ? (
            <div className="space-y-2">
              <p className="text-2xl font-dancing-script text-primary">
                Todos os presentes já foram comprados!
              </p>
              <p className="text-xl">
                Nossa casa estará maravilhosa para te receber em breve 😊
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Nenhum presente encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedGifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onPurchase={handlePurchase}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Mostrando {paginatedGifts.length} de {filteredGifts.length} presentes
          </div>
        </>
      )}

      <PurchaseDialog
        gift={selectedGift}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedGift(null);
        }}
        onConfirm={handlePurchaseConfirm}
      />
    </div>
  );
}

export default GiftList;