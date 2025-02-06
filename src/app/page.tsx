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
          <div className="text-center space-y-4 mb-12">
            <h1 className="font-dancing-script text-5xl md:text-6xl">
              Nossa Lista de Presentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha um presente para nos ajudar a construir nosso novo lar.
              Sua presença e carinho são os maiores presentes que poderíamos receber.
            </p>
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