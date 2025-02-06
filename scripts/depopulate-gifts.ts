import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function depopulateGifts() {
  // Delete all gifts
  const { error: giftsError } = await supabase
    .from('gifts')
    .delete()
    .not('id', 'is', null);

  if (giftsError) {
    console.error('Error deleting gifts:', giftsError);
    return;
  }

  // Delete all purchases
  const { error: purchasesError } = await supabase
    .from('purchases')
    .delete()
    .not('id', 'is', null);

  if (purchasesError) {
    console.error('Error deleting purchases:', purchasesError);
    return;
  }

  console.log('Successfully cleared all gifts and purchases from the database!');
}

depopulateGifts();