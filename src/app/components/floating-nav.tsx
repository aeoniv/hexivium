'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield, Home, BookOpen } from 'lucide-react';
import DragonflyMantisIcon from './icons/dragonfly-mantis-icon';
import { useTranslation } from '@/context/language-context';
import LanguageSelector from '@/components/language-selector';

const ADMIN_EMAIL = 'shi.heng.yong.yi@gmail.com';

export default function FloatingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/courses', label: t('courses'), icon: BookOpen },
    { href: '/admin', label: t('admin'), icon: Shield, adminOnly: true },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="fixed top-4 right-4 z-50 h-16 w-16 rounded-full shadow-lg">
            <Menu className="h-8 w-8" />
            <span className="sr-only">{t('openMenu')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
          <SheetHeader className="mb-8 text-left">
            <SheetTitle>
              <Link href="/" className="flex items-center gap-2 font-bold" onClick={closeMenu}>
                <DragonflyMantisIcon className="h-10 w-10 text-primary" />
                <span className="font-headline text-xl">Dragonfly Mantis</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <nav className="flex flex-col gap-4 text-lg font-medium">
              {navLinks.map(link => {
                if (link.adminOnly && !isAdmin) return null;
                const Icon = link.icon;
                return (
                    <Link key={link.href} href={link.href} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors" onClick={closeMenu}>
                      <Icon className="h-6 w-6 text-primary" />
                      <span>{link.label}</span>
                    </Link>
                )
              })}
            </nav>

            <div className="mt-6 pt-6 border-t">
                 <h3 className="px-2 pb-4 text-lg font-medium text-foreground">{t('language')}</h3>
                 <div className="px-2">
                    <LanguageSelector />
                 </div>
            </div>

            <div className="mt-auto pt-6 border-t">
              {!isUserLoading && user ? (
                <div className="flex flex-col gap-4">
                  <Link href="/profile" passHref>
                    <Button variant="outline" className="w-full justify-start" onClick={closeMenu}>
                        {t('myProfile')}
                    </Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); closeMenu(); }} className="w-full justify-start">
                    {t('logout')}
                  </Button>
                </div>
              ) : !isUserLoading && !user && (
                <div className="flex flex-col gap-4">
                  <Link href="/login" passHref>
                    <Button variant="outline" className='w-full justify-start' onClick={closeMenu}>{t('login')}</Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button className='w-full justify-start' onClick={closeMenu}>{t('signup')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
