'use client';

import { useState, FormEvent } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface VocabFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { norwegian: string; english: string; notes?: string; category?: string }) => void;
  categories: string[];
}

export function VocabForm({ open, onClose, onSubmit, categories }: VocabFormProps) {
  const [norwegian, setNorwegian] = useState('');
  const [english, setEnglish] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!norwegian.trim() || !english.trim()) return;
    onSubmit({
      norwegian: norwegian.trim(),
      english: english.trim(),
      notes: notes.trim() || undefined,
      category: category.trim() || undefined,
    });
    setNorwegian('');
    setEnglish('');
    setNotes('');
    setCategory('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Legg til nytt ord"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
          <Button onClick={handleSubmit}>Legg til</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Norsk"
          value={norwegian}
          onChange={e => setNorwegian(e.target.value)}
          placeholder="f.eks. hyggelig"
          autoFocus
        />
        <Input
          label="Engelsk"
          value={english}
          onChange={e => setEnglish(e.target.value)}
          placeholder="f.eks. koselig, hyggelig"
        />
        <Textarea
          label="Notater (valgfritt)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Brukseksempler, grammatikknotater..."
        />
        <Input
          label="Kategori (valgfritt)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="f.eks. adjektiver, mat, reise"
          list="vocab-categories"
        />
        <datalist id="vocab-categories">
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
      </form>
    </Dialog>
  );
}
