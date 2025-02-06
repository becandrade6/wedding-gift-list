"use client";

import { useActionState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { login, LoginState } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, MessageCircle } from "lucide-react";

export default function LoginForm() {

  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {
      success: null,
      message: ""
    }
  );

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription className="text-md">
          Bem vindos pombinhos...
        </CardDescription>
        <CardDescription>
          Digite o email e senha para fazer login como administradores!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="kike&logma@mail.com" required></Input>
            <Input id="password" type="password" name="password" placeholder="senha" required></Input>
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
          <Button type="submit" className="w-full">
            {pending && <Loader className="animate-spin" />}
            Login
            </Button>
        </div>
        </form>
      </CardContent>
    </Card>
  )
}