'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, initiateEmailSignIn, useUser } from '@/firebase';
import { type User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

const formSchema = z.object({
  email: z.string().email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    if (!isUserLoading && user) {
        const redirectUrl = searchParams.get('redirect') || '/profile';
        router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, searchParams]);

  const handleSuccess = useCallback((user: User) => {
    toast({
      title: t('loginSuccess'),
      description: t('redirecting'),
    });
    const redirectUrl = searchParams.get('redirect') || '/profile';
    router.push(redirectUrl);
  }, [router, searchParams, toast, t]);

  const handleError = useCallback((error: any) => {
    setIsSubmitting(false);
    let description = t('genericLoginError');
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      description = t('invalidCredentials');
    }
    toast({
      variant: 'destructive',
      title: t('loginError'),
      description,
    });
  }, [toast, t]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    setIsSubmitting(true);
    initiateEmailSignIn(auth, data.email, data.password, handleSuccess, handleError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('yourEmail')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('yourPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('loginButton')}
              </Button>
            </CardContent>
          </form>
        </Form>
        <CardContent className="text-center text-sm">
          <p>
            {t('noAccount')}{' '}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              {t('signUpHere')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
