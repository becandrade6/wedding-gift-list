import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from './ui/dialog';
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
      <DialogContent className="w-[95vw] max-w-[425px] sm:w-full p-4 sm:p-6 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg sm:text-xl">Confirmar Compra</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Por favor, preencha seus dados para registrar sua compra:
            <span className="block font-medium text-foreground mt-1 text-sm">{gift.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="buyer_name" className="text-sm">Nome</Label>
            <Input
              id="buyer_name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buyer_surname" className="text-sm">Sobrenome</Label>
            <Input
              id="buyer_surname"
              value={buyerSurname}
              onChange={(e) => setBuyerSurname(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="home_delivery"
              checked={homeDelivery}
              onCheckedChange={(checked) => setHomeDelivery(checked as boolean)}
              disabled={isSubmitting}
              className="h-4 w-4"
            />
            <Label htmlFor="home_delivery" className="text-sm font-normal">
              Será entregue na casa dos noivos
            </Label>
          </div>

          {homeDelivery && (
            <div className="grid gap-2">
              <Label className="text-sm">Data estimada de entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal h-9 sm:h-10 text-sm",
                      !estimatedDeliveryDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {estimatedDeliveryDate ? (
                      format(estimatedDeliveryDate, "dd 'de' MMMM", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-9 sm:h-10 text-sm"
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseDialog;