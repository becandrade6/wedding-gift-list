import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Gift, ShoppingBag, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Button variant="ghost" className="w-full justify-start">
          <Gift className="mr-2 h-4 w-4" />
          Gerenciar Presentes
        </Button>
      </Link>
      <Link
        href="/admin/purchases"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/purchases" ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Button variant="ghost" className="w-full justify-start">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Presentes Comprados
        </Button>
      </Link>
      <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </nav>
  );
}

export default AdminNav;