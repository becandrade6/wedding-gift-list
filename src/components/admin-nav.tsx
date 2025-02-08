import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Gift, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    router.push('/');
  };

  return (
    <div className="flex w-full justify-between items-center">
      <nav className="flex items-center space-x-4">
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
        <Link
          href="/admin/rsvp"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/admin/rsvp" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Confirmações de Presença
          </Button>
        </Link>
      </nav>
      <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}