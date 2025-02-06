import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader } from 'lucide-react';
import type { Gift } from '@/types';

interface PurchaseDialogProps {
  gift: Gift | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    gift_id: string;
    buyer_name: string;
    buyer_surname: string;
    home_delivery: boolean;
    estimated_delivery_date?: Date;
  }) => Promise<void>;
}

export function PurchaseDialog({ gift, open, onClose, onConfirm }: PurchaseDialogProps) {
  const [buyerName, setBuyerName] = React.useState('');
  const [buyerSurname, setBuyerSurname] = React.useState('');
  const [homeDelivery, setHomeDelivery] = React.useState(false);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = React.useState<Date>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setBuyerName('');
      setBuyerSurname('');
      setHomeDelivery(false);
      setEstimatedDeliveryDate(undefined);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gift) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        gift_id: gift.id,
        buyer_name: buyerName,
        buyer_surname: buyerSurname,
        home_delivery: homeDelivery,
        estimated_delivery_date: homeDelivery ? estimatedDeliveryDate : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!gift) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Compra</DialogTitle>
          <DialogDescription>
            Por favor, preencha seus dados para que possamos registrar sua compra do presente:
            <span className="block font-medium text-foreground mt-1">{gift.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="buyer_name">Nome</Label>
            <Input
              id="buyer_name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buyer_surname">Sobrenome</Label>
            <Input
              id="buyer_surname"
              value={buyerSurname}
              onChange={(e) => setBuyerSurname(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="home_delivery"
              checked={homeDelivery}
              onCheckedChange={(checked) => setHomeDelivery(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="home_delivery" className="text-sm font-normal">
              Será entregue na casa dos noivos
            </Label>
          </div>

          {homeDelivery && (
            <div className="grid gap-2">
              <Label>Data estimada de entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !estimatedDeliveryDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {estimatedDeliveryDate ? (
                      format(estimatedDeliveryDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={estimatedDeliveryDate}
                    onSelect={setEstimatedDeliveryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                'Confirmar Compra'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseDialog;