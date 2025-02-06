import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import type { Gift } from '@/types';

export interface GiftFormProps {
  gift?: Gift;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Gift, 'id' | 'purchased'>) => Promise<void>;
}

export default function GiftForm({ gift, open, onClose, onSubmit }: GiftFormProps) {
  const [name, setName] = React.useState(gift?.name || '');
  const [link, setLink] = React.useState(gift?.link || '');
  const [price, setPrice] = React.useState(gift?.price.toString() || '');
  const [store, setStore] = React.useState(gift?.store || '');

  React.useEffect(() => {
    if (open) {
      setName(gift?.name || '');
      setLink(gift?.link || '');
      setPrice(gift?.price.toString() || '');
      setStore(gift?.store || '');
    }
  }, [open, gift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        name,
        link,
        price: parseFloat(price),
        store,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting gift:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{gift ? 'Editar Presente' : 'Adicionar Presente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Presente</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jogo de Panelas"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="store">Loja</Label>
            <Input
              id="store"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="Ex: Magalu"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Link do Produto</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {gift ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Removed the extra export since we're exporting directly in the function definition