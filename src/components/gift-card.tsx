import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Gift, ExternalLink, ShoppingCart } from 'lucide-react';
import type { Gift as GiftType } from '@/types';

interface GiftCardProps {
  gift: GiftType;
  onPurchase: (gift: GiftType) => void;
}

export function GiftCard({ gift, onPurchase }: GiftCardProps) {
  return (
    <Card className="flex flex-col min-h-[230px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          {gift.name}
        </CardTitle>
        <CardDescription>{gift.store}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(gift.price)}
        </p>
      </CardContent>
      <CardFooter className="mt-auto grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => window.open(gift.link, '_blank')}
          className="w-full"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver na loja
        </Button>
        <Button
          className="w-full"
          onClick={() => onPurchase(gift)}
          disabled={gift.purchased}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {gift.purchased ? 'Comprado' : 'Comprei'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GiftCard;