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
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 sm:h-20 items-center">
            <div className="w-full flex justify-between items-center">
              {/* Hide spacer on mobile */}
              <div className="hidden sm:block w-[100px]" />
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h1 className="font-dancing-script text-3xl sm:text-4xl md:text-5xl whitespace-nowrap">
                  Henrique & Paloma
                </h1>
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              {/* Hide button container on mobile */}
              <div className="hidden sm:flex w-[100px] justify-end">
                <Button
                  size="sm"
                  className="text-sm px-4"
                  onClick={() => setLoginOpen(true)}
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