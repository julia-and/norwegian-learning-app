'use client';

import { useRef, useState, DragEvent } from 'react';
import { Upload, Loader } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FieldMappingStep } from './FieldMappingStep';
import { ImportPreview } from './ImportPreview';
import { useAnkiImport } from '@/lib/hooks/use-anki-import';
import styles from './apkg-import-dialog.module.css';

interface ApkgImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ApkgImportDialog({ open, onClose }: ApkgImportDialogProps) {
  const imp = useAnkiImport();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleClose = () => {
    imp.reset();
    onClose();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.apkg')) {
      imp.handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) imp.handleFile(file);
  };

  const stepTitle = {
    'select-file': 'Importer Anki-kortstokk',
    'map-fields': 'Knytt felt',
    'preview': 'Forhåndsvis',
    'importing': 'Importerer...',
    'done': 'Import fullført',
  }[imp.step];

  return (
    <Dialog open={open} onClose={handleClose} title={stepTitle}>
      {imp.error && <div className={styles.error}>{imp.error}</div>}

      {imp.step === 'select-file' && (
        imp.loading ? (
          <div className={styles.loading}>
            <Loader size={20} className="animate-pulse" />
            Leser fil...
          </div>
        ) : (
          <>
            <div
              className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <Upload size={32} className={styles.dropIcon} />
              <span className={styles.dropText}>
                Slipp en .apkg-fil her eller klikk for å bla
              </span>
              <span className={styles.dropHint}>
                Eksporter fra Anki: Fil &rarr; Eksporter &rarr; Anki Deck Package (.apkg)
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".apkg"
              className={styles.fileInput}
              onChange={handleFileSelect}
            />
          </>
        )
      )}

      {imp.step === 'map-fields' && imp.parsed && (
        <FieldMappingStep
          models={imp.models}
          selectedModel={imp.selectedModel}
          onSelectModel={imp.setSelectedModel}
          notes={imp.parsed.notes}
          onConfirm={imp.confirmMapping}
        />
      )}

      {imp.step === 'preview' && (
        <ImportPreview
          entries={imp.previewEntries}
          totalNotes={imp.totalNotes}
          duplicateStrategy={imp.duplicateStrategy}
          onDuplicateStrategyChange={imp.setDuplicateStrategy}
          category={imp.category}
          onCategoryChange={imp.setCategory}
          onImport={imp.executeImport}
          onBack={() => imp.reset()}
        />
      )}

      {imp.step === 'importing' && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${imp.progress}%` }} />
          </div>
          <span className={styles.progressText}>Importerer... {imp.progress}%</span>
        </div>
      )}

      {imp.step === 'done' && imp.result && (
        <div className={styles.doneSection}>
          <div className={styles.doneIcon}>🎉</div>
          <div className={styles.doneStats}>
            <div className={styles.doneStat}>
              <span className={styles.doneStatValue} style={{ color: 'var(--color-success)' }}>
                {imp.result.added}
              </span>
              <span className={styles.doneStatLabel}>Lagt til</span>
            </div>
            <div className={styles.doneStat}>
              <span className={styles.doneStatValue} style={{ color: 'var(--color-primary)' }}>
                {imp.result.updated}
              </span>
              <span className={styles.doneStatLabel}>Oppdatert</span>
            </div>
            <div className={styles.doneStat}>
              <span className={styles.doneStatValue} style={{ color: 'var(--color-text-tertiary)' }}>
                {imp.result.skipped}
              </span>
              <span className={styles.doneStatLabel}>Hoppet over</span>
            </div>
          </div>
          <Button onClick={handleClose}>Ferdig</Button>
        </div>
      )}
    </Dialog>
  );
}
