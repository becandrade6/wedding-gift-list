import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from "@/components/ui/card";
import SiteHeader from '@/components/site-header';
import GiftList from '@/components/gift-list';
import type { Gift } from '@/types';
import { ChevronDown, MapPin } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import RSVPSection from '@/components/rsvp-section';

async function getGifts() {
  const supabase = await createClient();
  const { data: gifts, error } = await supabase
    .from('gifts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching gifts:', error);
    return [];
  }

  return gifts as Gift[];
}

export default async function Home() {
  const gifts = await getGifts();

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container max-w-7xl mx-auto py-10">
          <div className="text-center space-y-6 mb-12 px-4 sm:px-6">
            <h1 className="font-dancing-script text-4xl sm:text-5xl md:text-6xl leading-tight">
              Nossa Lista de Presentes
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha um presente para nos ajudar a construir nosso novo lar.
              Sua presença e carinho são os maiores presentes que poderíamos receber.
            </p>

            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="bg-primary/5 border-none">
                <CardContent className="pt-6">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    <span className="font-medium">⚠️ Observação:</span> Caso seja da preferência, os presentes podem ser entregues no endereço:
                  </p>

                  <Collapsible className="w-full">
                    <CollapsibleTrigger className="flex items-center justify-center w-full group">
                      <div className="flex items-center space-x-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">Ver endereço para entrega</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4">
                      <div className="text-center space-y-2 py-4 border-t border-primary/10">
                        <p className="text-base font-medium">
                          Rua João Surerus, 101
                        </p>
                        <p className="text-base font-medium">
                          Nova Gramado Village, Grama
                        </p>
                        <p className="text-base font-medium">
                          Juiz de Fora - MG
                        </p>
                        <p className="text-sm text-muted-foreground">
                          CEP: 36047-610
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <GiftList gifts={gifts} />
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container max-w-7xl mx-auto py-6">
          <p className="text-center text-sm text-muted-foreground">
            Feito com ❤️ para o casamento de{" "}
            <span className="font-dancing-script text-base">Henrique e Paloma</span>
          </p>
        </div>
      </footer>
    </div>
  );
}