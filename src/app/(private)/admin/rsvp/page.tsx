'use client';
import React, { useState } from 'react';
import AdminNav from '@/components/admin-nav';
import { createClient } from '@/utils/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Users } from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
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
import RSVPForm from '@/components/rsvp-form';

import { RSVP } from '@/types';
import { useToast } from '@/hooks/use-toast';


export default function RSVPAdminPage() {
  const [rsvps, setRsvps] = React.useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [nameFilter, setNameFilter] = React.useState('');
  const [phoneFilter, setPhoneFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const [selectedRSVP, setSelectedRSVP] = useState<RSVP | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rsvpToDelete, setRsvpToDelete] = useState<RSVP | null>(null);
  const { toast } = useToast();

  const supabase = createClient();

  const fetchRSVPs = React.useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    setRsvps(data || []);
    setIsLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    fetchRSVPs();
  }, [fetchRSVPs]);


  const filteredRSVPs = React.useMemo(() => {
    return rsvps.filter(rsvp => {
      // Name filter (includes main guest and additional adults)
      const nameMatch =
        rsvp.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        rsvp.additional_adults.some(name =>
          name.toLowerCase().includes(nameFilter.toLowerCase())
        );

      // Phone filter - remove formatting from both the filter and the stored phone
      const cleanPhoneFilter = phoneFilter.replace(/\D/g, '');
      const cleanStoredPhone = rsvp.phone.replace(/\D/g, '');
      const phoneMatch = cleanStoredPhone.includes(cleanPhoneFilter);

      // Status filter
      let statusMatch = true;
      if (statusFilter !== 'all') {
        statusMatch = statusFilter === 'confirmed' ? rsvp.will_attend : !rsvp.will_attend;
      }

      return nameMatch && phoneMatch && statusMatch;
    });
  }, [rsvps, nameFilter, phoneFilter, statusFilter]);

  // Calculate totals
  const totals = React.useMemo(() => {
    const confirmed = rsvps.filter(rsvp => rsvp.will_attend);
    return {
      totalConfirmed: confirmed.length,
      totalDeclined: rsvps.length - confirmed.length,
      totalAdults: confirmed.reduce((sum, rsvp) => sum + rsvp.num_adults, 0),
      totalChildren: confirmed.reduce((sum, rsvp) => sum + rsvp.num_children, 0),
    };
  }, [rsvps]);

  const handleEdit = async (data: Partial<RSVP>) => {
    if (!selectedRSVP) return;

    try {
      const { error } = await supabase
        .from('rsvps')
        .update(data)
        .eq('id', selectedRSVP.id);

      if (error) throw error;

      toast({
        title: "Confirmação atualizada",
        description: "As alterações foram salvas com sucesso.",
      });

      fetchRSVPs();
      setSelectedRSVP(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!rsvpToDelete) return;

    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', rsvpToDelete.id);

      if (error) throw error;

      toast({
        title: "Confirmação removida",
        description: "A confirmação foi removida com sucesso.",
      });

      fetchRSVPs();
      setRsvpToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover a confirmação. Tente novamente.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-2xl font-bold">Confirmações de Presença</h1>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {totals.totalAdults + totals.totalChildren} convidados confirmados
                  ({totals.totalAdults} adultos, {totals.totalChildren} crianças)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 text-center">
                <div className="text-2xl font-bold text-primary">
                  {totals.totalConfirmed + totals.totalDeclined}
                </div>
                <div className="text-sm text-muted-foreground">Total de Respostas</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totals.totalConfirmed}
                </div>
                <div className="text-sm text-muted-foreground">Confirmados</div>
              </div>
              <div className="p-4 rounded-lg bg-red-500/5 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {totals.totalDeclined}
                </div>
                <div className="text-sm text-muted-foreground">Não Poderão Comparecer</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Buscar por nome</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome do convidado..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Buscar por telefone</Label>
                <Input
                  id="phone"
                  placeholder="(32) 99999-9999"
                  value={phoneFilter}
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

                    setPhoneFilter(formattedValue);
                  }}
                  inputMode="numeric"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="declined">Não Confirmados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>


          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Acompanhantes</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRSVPs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhuma confirmação encontrada com esses filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRSVPs.map((rsvp) => (
                    <TableRow key={rsvp.id}>
                      <TableCell className="font-medium">
                        {rsvp.name}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          rsvp.will_attend
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {rsvp.will_attend ? 'Confirmado' : 'Não Comparecerá'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{rsvp.email}</div>
                          <div className="text-muted-foreground">{rsvp.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rsvp.will_attend && (
                            <>
                              <div>
                                {rsvp.num_adults} {rsvp.num_adults === 1 ? 'adulto' : 'adultos'}
                              </div>
                              {rsvp.additional_adults.length > 0 && (
                                <div className="text-muted-foreground text-xs mt-1">
                                  {rsvp.additional_adults.join(', ')}
                                </div>
                              )}
                              {rsvp.num_children > 0 && (
                                <>
                                  <div className="mt-1">
                                    {rsvp.num_children} {rsvp.num_children === 1 ? 'criança' : 'crianças'}
                                  </div>
                                  <div className="text-muted-foreground text-xs mt-1">
                                    {rsvp.children_names.join(', ')}
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {rsvp.observations || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRSVP(rsvp);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRsvpToDelete(rsvp);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <RSVPForm
        rsvp={selectedRSVP}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedRSVP(undefined);
        }}
        onSubmit={handleEdit}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A confirmação será removida permanentemente.
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