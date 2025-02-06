/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const gifts = [
  {
    name: "Jogo de Panelas Tramontina Antiaderente 10 peças",
    link: "https://www.magazineluiza.com.br/jogo-de-panelas-tramontina-antiaderente-10-pecas/p/144175900/ud/jopa/",
    price: 449.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Mixer Philips Walita 400W",
    link: "https://www.amazon.com.br/mixer-philips-walita/",
    price: 169.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Jogo de Toalhas 5 peças",
    link: "https://www.riachuelo.com.br/jogo-de-toalhas",
    price: 129.90,
    store: "Riachuelo",
    purchased: false
  },
  {
    name: "Kit 6 Taças para Vinho",
    link: "https://www.americanas.com.br/tacas-vinho",
    price: 89.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Cafeteira Elétrica Philco",
    link: "https://www.casasbahia.com.br/cafeteira-philco",
    price: 199.90,
    store: "Casas Bahia",
    purchased: false
  },
  {
    name: "Jogo de Lençol Queen Size 400 fios",
    link: "https://www.mmartan.com.br/jogo-lencol",
    price: 399.90,
    store: "MMartan",
    purchased: false
  },
  {
    name: "Aspirador de Pó Vertical Electrolux",
    link: "https://www.magazineluiza.com.br/aspirador-electrolux",
    price: 599.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Kit Potes Herméticos 10 peças",
    link: "https://www.amazon.com.br/kit-potes",
    price: 149.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Jogo de Facas Tramontina 6 peças",
    link: "https://www.extra.com.br/jogo-facas",
    price: 279.90,
    store: "Extra",
    purchased: false
  },
  {
    name: "Air Fryer Mondial 4L",
    link: "https://www.pontofrio.com.br/air-fryer",
    price: 449.90,
    store: "Ponto Frio",
    purchased: false
  },
  {
    name: "Faqueiro Tramontina 42 peças",
    link: "https://www.magazineluiza.com.br/faqueiro",
    price: 299.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Jogo de Pratos 12 peças Porcelana",
    link: "https://www.americanas.com.br/jogo-pratos",
    price: 259.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Máquina de Lavar Brastemp 12kg",
    link: "https://www.casasbahia.com.br/maquina-lavar",
    price: 2499.90,
    store: "Casas Bahia",
    purchased: false
  },
  {
    name: "Microondas LG 30L",
    link: "https://www.magazineluiza.com.br/microondas",
    price: 799.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Liquidificador Philips Walita 1000W",
    link: "https://www.amazon.com.br/liquidificador",
    price: 299.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Conjunto de Taças 24 peças",
    link: "https://www.riachuelo.com.br/tacas",
    price: 199.90,
    store: "Riachuelo",
    purchased: false
  },
  {
    name: "Ferro de Passar Philips",
    link: "https://www.americanas.com.br/ferro",
    price: 149.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Kit Espátulas Silicone 5 peças",
    link: "https://www.amazon.com.br/espatulas",
    price: 79.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Jogo Americano 8 peças",
    link: "https://www.mmartan.com.br/jogo-americano",
    price: 129.90,
    store: "MMartan",
    purchased: false
  },
  {
    name: "Escorredor de Louça Inox",
    link: "https://www.magazineluiza.com.br/escorredor",
    price: 159.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Pote de Vidro Hermético 5L",
    link: "https://www.amazon.com.br/pote-vidro",
    price: 89.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Kit Organizador de Gavetas 6 peças",
    link: "https://www.americanas.com.br/organizador",
    price: 69.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Travesseiro Nasa Memory Foam",
    link: "https://www.casasbahia.com.br/travesseiro",
    price: 199.90,
    store: "Casas Bahia",
    purchased: false
  },
  {
    name: "Cesto de Roupa Suja com Tampa",
    link: "https://www.magazineluiza.com.br/cesto",
    price: 129.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Sanduicheira Grill Mondial",
    link: "https://www.amazon.com.br/sanduicheira",
    price: 149.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Chaleira Elétrica Inox",
    link: "https://www.americanas.com.br/chaleira",
    price: 119.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Conjunto de Panelas Cerâmica 5 peças",
    link: "https://www.magazineluiza.com.br/panelas-ceramica",
    price: 599.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Tapete para Sala 2x2.5m",
    link: "https://www.mmartan.com.br/tapete",
    price: 499.90,
    store: "MMartan",
    purchased: false
  },
  {
    name: "Kit Porta Mantimentos 4 peças",
    link: "https://www.amazon.com.br/porta-mantimentos",
    price: 159.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Edredom Queen Size",
    link: "https://www.riachuelo.com.br/edredom",
    price: 299.90,
    store: "Riachuelo",
    purchased: false
  },
  {
    name: "Conjunto de Xícaras 12 peças",
    link: "https://www.americanas.com.br/xicaras",
    price: 189.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Ventilador de Teto",
    link: "https://www.casasbahia.com.br/ventilador",
    price: 399.90,
    store: "Casas Bahia",
    purchased: false
  },
  {
    name: "Kit Colchas 3 peças",
    link: "https://www.mmartan.com.br/colchas",
    price: 459.90,
    store: "MMartan",
    purchased: false
  },
  {
    name: "Panos de Prato 12 unidades",
    link: "https://www.americanas.com.br/panos-prato",
    price: 89.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Garrafa Térmica 1.8L",
    link: "https://www.amazon.com.br/garrafa-termica",
    price: 139.90,
    store: "Amazon",
    purchased: false
  },
  {
    name: "Jogo de Talheres para Sobremesa",
    link: "https://www.magazineluiza.com.br/talheres-sobremesa",
    price: 129.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Kit Toalhas de Banho 4 peças",
    link: "https://www.riachuelo.com.br/toalhas-banho",
    price: 199.90,
    store: "Riachuelo",
    purchased: false
  },
  {
    name: "Forma de Bolo 3 peças",
    link: "https://www.americanas.com.br/formas-bolo",
    price: 99.90,
    store: "Americanas",
    purchased: false
  },
  {
    name: "Kit Lixeiras Seletivas 4 peças",
    link: "https://www.casasbahia.com.br/lixeiras",
    price: 249.90,
    store: "Casas Bahia",
    purchased: false
  },
  {
    name: "Puff Baú",
    link: "https://www.magazineluiza.com.br/puff",
    price: 179.90,
    store: "Magazine Luiza",
    purchased: false
  },
  {
    name: "Conjunto de Bowls 6 peças",
    link: "https://www.amazon.com.br/bowls",
    price: 119.90,
    store: "Amazon",
    purchased: false
  }
];

async function populateGifts() {
  // Delete existing gifts first (optional)
  const { error: deleteError } = await supabase
    .from('gifts')
    .delete()
    .not('id', 'is', null);

  if (deleteError) {
    console.error('Error deleting existing gifts:', deleteError);
    return;
  }

  // Insert new gifts
  const { data, error } = await supabase
    .from('gifts')
    .insert(gifts);

  if (error) {
    console.error('Error inserting gifts:', error);
    return;
  }

  console.log('Successfully populated database with gifts!');
}

populateGifts().catch(console.error);