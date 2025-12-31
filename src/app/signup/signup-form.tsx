
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, initiateEmailSignUp, createUserDocument, useUser } from '@/firebase';
import { type User, updateProfile } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { useFirestore } from '@/firebase/client-provider';

export default function SignupForm() {
  const { t } = useTranslation();

  const formSchema = z
  .object({
    displayName: z.string().min(3, t('nameMinLength')),
    email: z.string().email(t('invalidEmail')),
    phone: z.string().optional(),
    password: z.string().min(6, t('passwordMinLength')),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: t('passwordMismatch'),
    path: ['confirmPassword'],
  });

  type FormValues = z.infer<typeof formSchema>;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
        const redirectUrl = searchParams.get('redirect') || '/profile';
        router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSuccess = useCallback(async (user: User, data: FormValues) => {
    if (!firestore) {
        console.error("Firestore not available.");
        setIsSubmitting(false);
        return;
    };
    
    try {
      await updateProfile(user, { displayName: data.displayName });
      
      await createUserDocument(firestore, user);

      toast({
        title: t('accountCreated'),
        description: t('freeCredits'),
      });
      const redirectUrl = searchParams.get('redirect') || '/profile';
      router.push(redirectUrl);

    } catch (error) {
       console.error("Error creating user document or updating profile:", error);
       toast({
          variant: 'destructive',
          title: t('saveProfileError'),
          description: t('saveProfileErrorDesc'),
       });
    } finally {
      setIsSubmitting(false);
    }
      
  }, [firestore, toast, searchParams, router, t]);

  const handleError = useCallback((error: any) => {
    setIsSubmitting(false);
    let description = t('genericCreateAccountError');
    if (error.code === 'auth/email-already-in-use') {
      description = t('emailInUse');
    }
    toast({
      variant: 'destructive',
      title: t('createAccountError'),
      description: description,
    });
  }, [toast, t]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (!auth) return;
    setIsSubmitting(true);
    initiateEmailSignUp(auth, data.email, data.password, (user) => handleSuccess(user, data), handleError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{t('createAccount')}</CardTitle>
          <CardDescription>{t('createAccountDescription')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
               <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('fullName')}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder={t('yourName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phoneOptional')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('yourPhoneNumber')} {...field} />
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
                      <Input type="password" placeholder={t('createStrongPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={t('confirmYourPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
              <Button type="submit" disabled={isSubmitting || !auth} className="w-full">
                {(isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('createMyAccount')}
              </Button>
            </CardContent>
          </form>
        </Form>
        <CardContent className="text-center text-sm">
          <p>
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              {t('loginHere')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
