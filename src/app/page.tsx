import { createClient } from '@/utils/supabase/server';
import SiteHeader from '@/components/site-header';
import GiftList from '@/components/gift-list';
import type { Gift } from '@/types';

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
            <div className="mt-6 p-4 sm:p-6 bg-primary/5 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-muted-foreground">
                <span className="font-medium">⚠️ Observação:</span> Caso seja da preferência, os presentes podem ser entregues no endereço:
              </p>
              <p className="text-base sm:text-lg font-medium mt-2">
                Rua João Surerus, 101, Grama, Juiz de Fora
              </p>
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