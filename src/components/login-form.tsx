'use client';

import { useActionState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { login, LoginState } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, MessageCircle } from "lucide-react";

interface LoginFormProps {
  isDialog?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function LoginForm({ isDialog, open, onOpenChange }: LoginFormProps) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {
      success: null,
      message: ""
    }
  );

  const formContent = (
    <form action={formAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="kike&logma@mail.com"
            required
            disabled={pending}
          />
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="senha"
            required
            disabled={pending}
          />
        </div>
        {state.success === false && (
          <Alert className="text-muted-foreground">
            <MessageCircle className="h-4 w-4 !text-red-600" />
            <AlertTitle className="text-gray-50">Erro!</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao efetuar login, contacte o suporte (Bernardo)
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Login</DialogTitle>
            <DialogDescription>
              Bem vindos pombinhos...
            </DialogDescription>
            <DialogDescription>
              Digite o email e senha para fazer login como administradores!
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>
        <p className="text-muted-foreground">
          Bem vindos pombinhos...
        </p>
        <p className="text-muted-foreground">
          Digite o email e senha para fazer login como administradores!
        </p>
      </div>
      {formContent}
    </div>
  );
}