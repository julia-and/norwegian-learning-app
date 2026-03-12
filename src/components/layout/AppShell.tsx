'use client';

import { ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ThemeProvider } from './ThemeProvider';
import { seedDefaults } from '@/lib/db';
import { useStats } from '@/lib/hooks/use-stats';
import styles from './app-shell.module.css';

function AppShellInner({ children }: { children: ReactNode }) {
  const { currentStreak } = useStats();

  useEffect(() => {
    seedDefaults();
  }, []);

  return (
    <div className={styles.shell}>
      <Sidebar streak={currentStreak} />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppShellInner>{children}</AppShellInner>
    </ThemeProvider>
  );
}
