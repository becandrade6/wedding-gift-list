'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import LoginForm from './login-form';
import { createClient } from '@/utils/supabase/client';

export function SiteHeader() {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAdminClick = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
      // User is already logged in, redirect to admin
      router.push('/admin');
    } else {
      // User needs to log in, show dialog
      setLoginOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex h-20 items-center">
            <div className="w-full flex justify-between items-center">
              <div className="w-[100px]" /> {/* Spacer for left side */}
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="font-dancing-script text-4xl">
                  Henrique & Paloma
                </h1>
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div className="w-[100px] flex justify-end"> {/* Container for button */}
                <Button
                  size="sm"
                  onClick={handleAdminClick}
                >
                  Área do Casal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoginForm
        isDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
      />
    </>
  );
}

export default SiteHeader;