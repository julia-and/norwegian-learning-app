'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ThemeProvider } from './ThemeProvider';
import { db, seedDefaults } from '@/lib/db';
import { useStats } from '@/lib/hooks/use-stats';
import styles from './app-shell.module.css';

function AppShellInner({ children }: { children: ReactNode }) {
  const { currentStreak } = useStats();
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    db.open()
      .then(() => seedDefaults())
      .catch(err => {
        if (err?.name === 'DatabaseClosedError' || err?.inner?.name === 'UpgradeError') {
          setDbError(true);
        }
      });
  }, []);

  if (dbError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, padding: 32, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <h2 style={{ margin: 0 }}>Database needs to be reset</h2>
        <p style={{ margin: 0, color: '#6b7280', maxWidth: 400 }}>
          A database upgrade conflict was detected. Open DevTools → Application → IndexedDB → delete the <strong>norsk-tracker</strong> database, then reload the page. Your data will resync from the cloud.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 8, padding: '8px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'none', cursor: 'pointer', fontSize: 14 }}
        >
          Reload
        </button>
      </div>
    );
  }

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
