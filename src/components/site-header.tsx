'use client';

import React from 'react';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import LoginForm from './login-form';

export function SiteHeader() {
  const [loginOpen, setLoginOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center justify-center flex-1">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="font-dancing-script text-4xl">
                  Henrique & Paloma
                </h1>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
                Área do Casal
              </Button>
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