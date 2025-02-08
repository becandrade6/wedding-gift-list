import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

interface RSVP {
  id: string;
  name: string;
  will_attend: boolean;
  email: string;
  phone: string;
  num_adults: number;
  num_children: number;
  additional_adults: string[];
  children_names: string[];
  observations: string;
  created_at: string;
}

interface RSVPFormProps {
  rsvp: RSVP | undefined;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RSVP>) => Promise<void>;
}

export default function RSVPForm({ rsvp, open, onClose, onSubmit }: RSVPFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [willAttend, setWillAttend] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [additionalAdults, setAdditionalAdults] = useState<string[]>([]);
  const [childrenNames, setChildrenNames] = useState<string[]>([]);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    if (rsvp) {
      setName(rsvp.name);
      setWillAttend(rsvp.will_attend);
      setEmail(rsvp.email);
      setPhone(rsvp.phone);
      setNumAdults(rsvp.num_adults);
      setNumChildren(rsvp.num_children);
      setAdditionalAdults(rsvp.additional_adults);
      setChildrenNames(rsvp.children_names);
      setObservations(rsvp.observations);
    }
  }, [rsvp]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        name,
        will_attend: willAttend,
        email,
        phone,
        num_adults: numAdults,
        num_children: numChildren,
        additional_adults: additionalAdults,
        children_names: childrenNames,
        observations,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Confirmação</DialogTitle>
          <DialogDescription>
            Edite os dados da confirmação de presença.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Confirmação</Label>
            <RadioGroup
              value={willAttend ? "yes" : "no"}
              onValueChange={(value) => setWillAttend(value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Confirmado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">Não Comparecerá</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                const truncatedValue = numericValue.slice(0, 11);

                let formattedValue = '';
                if (truncatedValue.length > 0) {
                  formattedValue = '(' + truncatedValue.slice(0, 2);
                  if (truncatedValue.length > 2) {
                    formattedValue += ') ' + truncatedValue.slice(2, 7);
                    if (truncatedValue.length > 7) {
                      formattedValue += '-' + truncatedValue.slice(7, 11);
                    }
                  }
                }

                setPhone(formattedValue);
              }}
              inputMode="numeric"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="numAdults">Número de Adultos</Label>
            <Input
              id="numAdults"
              type="number"
              min="1"
              value={numAdults}
              onChange={(e) => setNumAdults(parseInt(e.target.value))}
              required
            />
          </div>

          {Array.from({ length: numAdults - 1 }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={`adult-${index}`}>
                Nome do {index + 2}º Adulto
              </Label>
              <Input
                id={`adult-${index}`}
                value={additionalAdults[index] || ''}
                onChange={(e) => {
                  const newAdults = [...additionalAdults];
                  newAdults[index] = e.target.value;
                  setAdditionalAdults(newAdults);
                }}
                required
              />
            </div>
          ))}

          <div className="grid gap-2">
            <Label htmlFor="numChildren">Número de Crianças</Label>
            <Input
              id="numChildren"
              type="number"
              min="0"
              value={numChildren}
              onChange={(e) => setNumChildren(parseInt(e.target.value))}
              required
            />
          </div>

          {Array.from({ length: numChildren }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={`child-${index}`}>
                Nome da {index + 1}ª Criança
              </Label>
              <Input
                id={`child-${index}`}
                value={childrenNames[index] || ''}
                onChange={(e) => {
                  const newChildren = [...childrenNames];
                  newChildren[index] = e.target.value;
                  setChildrenNames(newChildren);
                }}
                required
              />
            </div>
          ))}

          <div className="grid gap-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}