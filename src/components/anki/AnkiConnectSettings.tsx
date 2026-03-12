'use client';

import { useEffect } from 'react';
import { RefreshCw, Loader, Wifi, WifiOff } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { useAnkiConnect } from '@/lib/hooks/use-anki-connect';
import styles from './anki-connect-settings.module.css';

export function AnkiConnectSettings() {
  const ac = useAnkiConnect();

  // Load field names when note type changes
  useEffect(() => {
    if (ac.config.noteType) {
      ac.loadFieldNames(ac.config.noteType);
    }
  }, [ac.config.noteType, ac.loadFieldNames]);

  const deckOptions = [
    { value: '', label: 'Velg en kortstokk...' },
    ...ac.decks.map(d => ({ value: d, label: d })),
  ];

  const modelOptions = [
    { value: '', label: 'Velg notetype...' },
    ...ac.modelNames.map(m => ({ value: m, label: m })),
  ];

  const fieldOptions = [
    { value: '', label: 'Velg felt...' },
    ...ac.fieldNames.map(f => ({ value: f, label: f })),
  ];

  const notesFieldOptions = [
    { value: '', label: '(ingen)' },
    ...ac.fieldNames.map(f => ({ value: f, label: f })),
  ];

  return (
    <Card>
      <CardHeader
        title="AnkiConnect-synkronisering"
        subtitle="Synkroniser ordforråd med Anki"
      />

      <div className={styles.container}>
        <p className={styles.hint}>
          Krever AnkiConnect-tillegget i Anki (kode:{' '}
          <strong>2055492159</strong>). Anki må kjøre for at synkronisering skal fungere.{' '}
          For å tillate tilkoblinger fra denne appen, åpne AnkiConnect-konfig
          (Verktøy → Tillegg → AnkiConnect → Konfig) og legg til nettstedets adresse i{' '}
          <code>webCorsOriginList</code>, f.eks.:{' '}
          <code>{'"webCorsOriginList": ["https://lang-learning-tracking-app.s3-website.fr-par.scw.cloud"]'}</code>
        </p>

        <div className={styles.connectionRow}>
          <span className={`${styles.statusDot} ${
            ac.connected === true ? styles.statusConnected :
            ac.connected === false ? styles.statusDisconnected :
            styles.statusUnknown
          }`} />
          <span className={styles.statusText}>
            {ac.connected === true ? 'Tilkoblet Anki' :
             ac.connected === false ? 'Kan ikke nå Anki' :
             'Ikke testet'}
          </span>
          <Button variant="secondary" size="sm" onClick={ac.checkConnection}>
            {ac.connected === null ? <Wifi size={14} /> : <RefreshCw size={14} />}
            {ac.connected === null ? 'Test tilkobling' : 'Prøv igjen'}
          </Button>
        </div>

        {ac.connected && (
          <div className={styles.configGrid}>
            <Select
              label="Kortstokk"
              value={ac.config.deckName}
              onChange={e => ac.setConfig({ deckName: e.target.value })}
              options={deckOptions}
            />

            <Select
              label="Notetype"
              value={ac.config.noteType}
              onChange={e => ac.setConfig({ noteType: e.target.value, norwegianField: '', englishField: '', notesField: '' })}
              options={modelOptions}
            />

            {ac.fieldNames.length > 0 && (
              <>
                <div className={styles.fieldRow}>
                  <Select
                    label="Norsk felt"
                    value={ac.config.norwegianField}
                    onChange={e => ac.setConfig({ norwegianField: e.target.value })}
                    options={fieldOptions}
                  />
                  <Select
                    label="Engelsk felt"
                    value={ac.config.englishField}
                    onChange={e => ac.setConfig({ englishField: e.target.value })}
                    options={fieldOptions}
                  />
                </div>
                <Select
                  label="Notatfelt (valgfritt)"
                  value={ac.config.notesField ?? ''}
                  onChange={e => ac.setConfig({ notesField: e.target.value || undefined })}
                  options={notesFieldOptions}
                />
              </>
            )}

            <div className={styles.syncRow}>
              <Button
                onClick={ac.sync}
                disabled={ac.syncing || !ac.config.deckName || !ac.config.norwegianField || !ac.config.englishField}
                size="md"
              >
                {ac.syncing ? (
                  <><Loader size={14} className="animate-pulse" /> Synkroniserer...</>
                ) : (
                  <><RefreshCw size={14} /> Synkroniser nå</>
                )}
              </Button>
              {ac.config.lastSyncedAt && (
                <span className={styles.lastSync}>
                  Sist synkronisert: {new Date(ac.config.lastSyncedAt).toLocaleString('nb-NO')}
                </span>
              )}
            </div>
          </div>
        )}

        {ac.error && <div className={styles.error}>{ac.error}</div>}

        {ac.syncResult && (
          <div className={styles.syncResult}>
            <span><strong>{ac.syncResult.added}</strong> lagt til</span>
            <span><strong>{ac.syncResult.updated}</strong> oppdatert</span>
            <span><strong>{ac.syncResult.skipped}</strong> hoppet over</span>
          </div>
        )}
      </div>
    </Card>
  );
}
