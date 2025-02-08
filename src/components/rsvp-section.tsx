"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HeartCrack, Loader2, PartyPopper } from "lucide-react";

interface AdditionalGuest {
  id: string;
  name: string;
}

export default function RSVPSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<{
    willAttend: boolean;
    name: string;
  } | null>(null);
  const [phone, setPhone] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [additionalAdults, setAdditionalAdults] = useState<AdditionalGuest[]>([]);
  const [children, setChildren] = useState<AdditionalGuest[]>([]);
  const { toast } = useToast();

  const resetForm = () => {
    setNumAdults(1);
    setNumChildren(0);
    setAdditionalAdults([]);
    setChildren([]);
    setPhone('');
    setShowConfirmation(false);
    setConfirmationMessage(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Only reset if we're actually closing the dialog
      resetForm();
    }
    setIsOpen(open);
  };

  // Update additional adults array when numAdults changes
  React.useEffect(() => {
    if (numAdults > 1) {
      const currentLength = additionalAdults.length;
      const newLength = numAdults - 1; // Subtract 1 because the main guest is not included

      if (newLength > currentLength) {
        // Add new empty slots
        const newAdults = [...Array(newLength - currentLength)].map(() => ({
          id: Math.random().toString(36).substring(7),
          name: ''
        }));
        setAdditionalAdults([...additionalAdults, ...newAdults]);
      } else if (newLength < currentLength) {
        // Remove excess slots
        setAdditionalAdults(additionalAdults.slice(0, newLength));
      }
    } else {
      setAdditionalAdults([]);
    }
  }, [numAdults]);

  // Update children array when numChildren changes
  React.useEffect(() => {
    const currentLength = children.length;
    if (numChildren > currentLength) {
      // Add new empty slots
      const newChildren = [...Array(numChildren - currentLength)].map(() => ({
        id: Math.random().toString(36).substring(7),
        name: ''
      }));
      setChildren([...children, ...newChildren]);
    } else if (numChildren < currentLength) {
      // Remove excess slots
      setChildren(children.slice(0, numChildren));
    }
  }, [numChildren]);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const willAttend = formData.get('attendance') === 'yes';

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um telefone no formato (xx) xxxxx-xxxx",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      name,
      will_attend: willAttend,
      email: email,
      phone: phone,
      num_adults: numAdults,
      num_children: numChildren,
      additional_adults: additionalAdults.map(adult => adult.name),
      children_names: children.map(child => child.name),
      observations: formData.get('observations') as string,
      created_at: new Date().toISOString()
    };

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([data]);

      if (error) throw error;

      setConfirmationMessage({
        willAttend,
        name
      });
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Erro ao confirmar presença",
        description: "Ocorreu um erro ao processar sua confirmação. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ConfirmationScreen = () => {
    if (!confirmationMessage) return null;

    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
        {confirmationMessage.willAttend ? (
          <>
            <PartyPopper className="h-16 w-16 text-primary animate-bounce" />
            <h3 className="text-2xl font-semibold">
              Que alegria, {confirmationMessage.name}!
            </h3>
            <p className="text-muted-foreground">
              Mal podemos esperar para celebrar com você este momento tão especial.
              Nos vemos em breve!
            </p>
          </>
        ) : (
          <>
            <HeartCrack className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-2xl font-semibold">
              Sentiremos sua falta, {confirmationMessage.name}
            </h3>
            <p className="text-muted-foreground">
              Agradecemos por nos comunicar. Você estará em nossos corações neste dia especial.
            </p>
          </>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          Clique fora desta janela para fechar
        </p>
      </div>
    );
  };

  return (
    <div className="bg-primary/5 rounded-lg py-12 px-4 mb-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="font-dancing-script text-3xl sm:text-4xl">
          Você nos dará a honra de sua presença?
        </h2>
        <p className="text-muted-foreground">
          Sua presença é o presente mais especial que podemos receber.
          Por favor, confirme sua participação para nos ajudar com os preparativos.
        </p>

        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button size="lg" className="mt-4">
              Confirmar Presença
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            {showConfirmation ? (
              <ConfirmationScreen />
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Confirmação de Presença</DialogTitle>
                  <DialogDescription>
                    Por favor, preencha seus dados para confirmar sua presença em nossa celebração.
                  </DialogDescription>
                </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Seu Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Você poderá comparecer?</Label>
                  <RadioGroup name="attendance" required defaultValue="yes">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Sim, irei comparecer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">Infelizmente não poderei ir</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Seu E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone para Contato</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="(32) 99999-9999"
                    required
                    value={phone}
                    onChange={(e) => {
                      // Remove all non-numeric characters
                      const numericValue = e.target.value.replace(/\D/g, '');

                      // Limit to max 11 digits
                      const truncatedValue = numericValue.slice(0, 11);

                      // Format the number
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
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="numAdults">Número de Adultos (incluindo você)</Label>
                  <Input
                    id="numAdults"
                    type="number"
                    min="1"
                    value={numAdults}
                    onChange={(e) => setNumAdults(parseInt(e.target.value))}
                    required
                  />
                </div>

                {additionalAdults.map((adult, index) => (
                  <div key={adult.id} className="grid gap-2">
                    <Label htmlFor={`adult-${adult.id}`}>
                      Nome do {index + 2}º Adulto
                    </Label>
                    <Input
                      id={`adult-${adult.id}`}
                      value={adult.name}
                      onChange={(e) => {
                        const newAdults = [...additionalAdults];
                        newAdults[index].name = e.target.value;
                        setAdditionalAdults(newAdults);
                      }}
                      placeholder="Nome completo do acompanhante"
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

                {children.map((child, index) => (
                  <div key={child.id} className="grid gap-2">
                    <Label htmlFor={`child-${child.id}`}>
                      Nome da {index + 1}ª Criança
                    </Label>
                    <Input
                      id={`child-${child.id}`}
                      value={child.name}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].name = e.target.value;
                        setChildren(newChildren);
                      }}
                      placeholder="Nome completo da criança"
                      required
                    />
                  </div>
                ))}

                <div className="grid gap-2">
                  <Label htmlFor="observations">Observações (opcional)</Label>
                  <Textarea
                    id="observations"
                    name="observations"
                    placeholder="Se desejar, deixe alguma observação"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    "Confirmar Presença"
                  )}
                </Button>
              </form>
            </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}