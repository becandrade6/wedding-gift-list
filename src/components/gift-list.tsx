'use client';

import React, { useState, useMemo } from 'react';
import { Gift } from '@/types';
import GiftCard from './gift-card';
import GiftFilters from './gift-filters';
import PurchaseDialog from './purchase-dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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
      // 1. Update the gift as purchased
      const { error: giftError } = await supabase
        .from('gifts')
        .update({ purchased: true })
        .eq('id', data.gift_id);

      if (giftError) throw giftError;

      // 2. Create the purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert([data]);

      if (purchaseError) throw purchaseError;

      // 3. Send confirmation email
      const gift = gifts.find(g => g.id === data.gift_id);
      if (!gift) throw new Error('Gift not found');

      const emailResponse = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftName: gift.name,
          buyerName: data.buyer_name,
          buyerSurname: data.buyer_surname,
          homeDelivery: data.home_delivery,
          estimatedDeliveryDate: data.estimated_delivery_date,
          price: gift.price
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email notification');
        // Note: We don't throw here because the purchase was successful
        // The email failure shouldn't affect the user experience
      }

      // Update local state
      setGifts(gifts.map(g =>
        g.id === data.gift_id ? { ...g, purchased: true } : g
      ));

      // Close the dialog
      setDialogOpen(false);
      setSelectedGift(null);

    } catch (error) {
      console.error('Error recording purchase:', error);
      // Here you might want to show an error message to the user
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