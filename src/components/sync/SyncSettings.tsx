'use client';

import { useObservable } from 'dexie-react-hooks';
import { Cloud, CloudOff, Loader2, LogIn, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import styles from './sync-settings.module.css';

export function SyncSettings() {
  const currentUser = useObservable(db.cloud.currentUser);
  const syncState = useObservable(db.cloud.syncState);

  const isLoggedIn = currentUser?.isLoggedIn ?? false;
  const phase = syncState?.phase;
  const isSyncing = phase === 'pushing' || phase === 'pulling';

  const statusIcon = !isLoggedIn ? (
    <CloudOff size={16} className={styles.iconOff} />
  ) : isSyncing ? (
    <Loader2 size={16} className={styles.iconSyncing} />
  ) : (
    <Cloud size={16} className={styles.iconOn} />
  );

  const statusText = !isLoggedIn
    ? 'Ikke tilkoblet'
    : isSyncing
    ? 'Synkroniserer…'
    : phase === 'error'
    ? 'Synkroniseringsfeil'
    : phase === 'offline'
    ? 'Frakoblet'
    : 'Synkronisert';

  return (
    <Card>
      <div className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.sectionTitle}>Skysynkronisering ☁️</h2>
            <p className={styles.sectionDesc}>
              {isLoggedIn
                ? `Innlogget som ${currentUser?.email}`
                : 'Logg inn for å synkronisere mellom enheter'}
            </p>
          </div>
          <div className={styles.status}>
            {statusIcon}
            <span className={styles.statusText}>{statusText}</span>
          </div>
        </div>

        {isLoggedIn ? (
          <Button
            variant="secondary"
            size="md"
            onClick={() => db.cloud.logout()}
          >
            <LogOut size={16} /> Logg ut
          </Button>
        ) : (
          <Button size="md" onClick={() => db.cloud.login()}>
            <LogIn size={16} /> Logg inn
          </Button>
        )}
      </div>
    </Card>
  );
}
