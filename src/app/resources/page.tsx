'use client';

import { useState, useCallback } from 'react';
import {
  ExternalLink,
  Headphones,
  BookOpen,
  Sparkles,
  Shuffle,
  SkipForward,
  Play,
  Check,
  CheckCircle,
  Clock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { RESOURCES, type ResourceType, type CEFRLevel, type CuratedResource } from '@/lib/resources';
import { useCuratedResources } from '@/lib/hooks/use-curated-resources';
import { useTimer } from '@/lib/hooks/use-timer';
import { useTodayRatings } from '@/lib/hooks/use-difficulty-ratings';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import { DifficultyRatingWidget } from '@/components/resources/DifficultyRatingWidget';
import { db, type TimerCategory, type DifficultyRating } from '@/lib/db';
import { todayISO, formatDuration } from '@/lib/utils';
import styles from './page.module.css';

const TYPE_OPTIONS: { value: ResourceType | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'listening', label: 'Lytting' },
  { value: 'reading', label: 'Lesing' },
  { value: 'both', label: 'Begge' },
];

const LEVEL_OPTIONS: { value: CEFRLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
];

const typeIcon = (type: ResourceType) => {
  switch (type) {
    case 'listening': return <Headphones size={12} />;
    case 'reading': return <BookOpen size={12} />;
    case 'both': return <Sparkles size={12} />;
  }
};

const typeLabel = (type: ResourceType) => {
  switch (type) {
    case 'listening': return 'Lytting';
    case 'reading': return 'Lesing';
    case 'both': return 'Begge';
  }
};

const typeBadgeClass = (type: ResourceType) => {
  switch (type) {
    case 'listening': return styles.typeBadgeListening;
    case 'reading': return styles.typeBadgeReading;
    case 'both': return styles.typeBadgeBoth;
  }
};

function getSourceName(sourceId: string): string {
  const source = RESOURCES.find(r => r.id === sourceId);
  return source?.title ?? sourceId;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

// --- Helpers ---

type Phase = 'idle' | 'active' | 'rating' | 'done';

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'nå nettopp';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min siden`;
  return `${Math.floor(mins / 60)} t siden`;
}

function contentTypeEmoji(type: ResourceType): string {
  switch (type) {
    case 'listening': return '🎧';
    case 'reading': return '📖';
    case 'both': return '✨';
  }
}

// --- Recent Ratings Row ---

function RecentRatingsRow() {
  const ratings = useTodayRatings();
  if (ratings.length === 0) return null;

  return (
    <div className={styles.recentRatings}>
      {ratings.map((r: DifficultyRating) => (
        <span key={r.id} className={styles.ratingPill}>
          {contentTypeEmoji(r.contentType)} {r.rating}/5 · {timeAgo(r.ratedAt)}
        </span>
      ))}
    </div>
  );
}

// --- Quick Practice Section ---

function QuickPracticeSection({
  levelFilter,
}: {
  levelFilter: CEFRLevel | 'all';
}) {
  const { pickRandom, markConsumed, consumedIds } = useCuratedResources();
  const timer = useTimer();
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeResource, setActiveResource] = useState<CuratedResource | null>(null);
  const [activeType, setActiveType] = useState<ResourceType | 'all'>('all');
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

  const startPractice = useCallback(async (type: ResourceType | 'all') => {
    // Stop any running timer without blocking UX — save if >= 30s
    if (timer.status !== 'idle') {
      if (timer.elapsed >= 30) await timer.stop();
      else timer.reset();
    }

    const resource = pickRandom(type, levelFilter);
    if (!resource) return;

    setActiveResource(resource);
    setSavedSessionId(null);
    setActiveType(type);

    const cat: TimerCategory = resource.contentType === 'reading' ? 'reading' : 'listening';
    timer.setCategory(cat);
    timer.start();
    setPhase('active');
  }, [timer, pickRandom, levelFilter]);

  const handleDone = useCallback(async () => {
    const session = await timer.stop();
    if (session) setSavedSessionId(session.id);
    if (activeResource) markConsumed(activeResource.id);
    setPhase('rating');
  }, [timer, activeResource, markConsumed]);

  const handleSkip = useCallback(async () => {
    if (timer.elapsed >= 30) await timer.stop();
    else timer.reset();

    const resource = pickRandom(activeType, levelFilter);
    if (resource) {
      setActiveResource(resource);
      setSavedSessionId(null);
      const cat: TimerCategory = resource.contentType === 'reading' ? 'reading' : 'listening';
      timer.setCategory(cat);
      timer.start();
      setPhase('active');
    } else {
      setActiveResource(null);
      setPhase('idle');
    }
  }, [timer, pickRandom, activeType, levelFilter]);

  const handleRate = useCallback(async (rating: number) => {
    if (savedSessionId && activeResource) {
      await db.difficultyRatings.add({
        id: crypto.randomUUID(),
        sessionId: savedSessionId,
        contentType: activeResource.contentType,
        rating,
        date: todayISO(),
        ratedAt: new Date(),
      });
    }
    setPhase('done');
    setTimeout(() => {
      setPhase('idle');
      setActiveResource(null);
    }, 1200);
  }, [savedSessionId, activeResource]);

  const handleSkipRating = useCallback(() => {
    setPhase('idle');
    setActiveResource(null);
  }, []);

  return (
    <section className={styles.quickPractice}>
      <h2 className={styles.sectionTitle}>Rask øvelse</h2>
      <div className={styles.quickButtons}>
        <button
          className={`${styles.quickBtn} ${styles.quickBtnListening}`}
          onClick={() => startPractice('listening')}
        >
          <Headphones size={20} />
          Start lytting
        </button>
        <button
          className={`${styles.quickBtn} ${styles.quickBtnReading}`}
          onClick={() => startPractice('reading')}
        >
          <BookOpen size={20} />
          Start lesing
        </button>
        <button
          className={`${styles.quickBtn} ${styles.quickBtnSurprise}`}
          onClick={() => startPractice('all')}
        >
          <Shuffle size={20} />
          Overrask meg
        </button>
      </div>

      {phase !== 'idle' && activeResource && (
        <div className={styles.previewCard}>
          {phase === 'done' ? (
            <div className={styles.doneFlash}>
              <CheckCircle size={24} /> Lagret!
            </div>
          ) : phase === 'rating' ? (
            <DifficultyRatingWidget onRate={handleRate} onSkip={handleSkipRating} />
          ) : (
            <>
              <div className={styles.previewHeader}>
                <div>
                  <span className={`${styles.typeBadge} ${typeBadgeClass(activeResource.contentType)}`}>
                    {typeIcon(activeResource.contentType)} {typeLabel(activeResource.contentType)}
                  </span>
                  <span className={styles.previewSource}>{getSourceName(activeResource.sourceId)}</span>
                  {consumedIds.has(activeResource.id) && (
                    <span className={styles.consumedBadge}><Check size={10} /> Sett</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className={styles.elapsedBadge}>
                    <Clock size={12} /> {formatDuration(timer.elapsed)}
                  </span>
                  <div className={styles.previewLevels}>
                    {activeResource.cefrLevels.map(level => (
                      <span key={level} className={styles.levelBadge}>{level}</span>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className={styles.previewTitle}>{activeResource.title}</h3>
              <p className={styles.previewDesc}>{activeResource.description}</p>
              {activeResource.durationMinutes && (
                <span className={styles.duration}>
                  <Clock size={12} /> {activeResource.durationMinutes} min
                </span>
              )}

              {activeResource.audioUrl ? (
                <div className={styles.audioSection}>
                  <audio
                    controls
                    src={activeResource.audioUrl}
                    className={styles.audioPlayer}
                    onPlay={() => markConsumed(activeResource.id)}
                  >
                    Nettleseren din støtter ikke lydavspilling.
                  </audio>
                  <a
                    href={activeResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.openExternal}
                  >
                    Åpne kilde <ExternalLink size={12} />
                  </a>
                </div>
              ) : (
                <button
                  className={styles.openBtn}
                  onClick={() => {
                    markConsumed(activeResource.id);
                    window.open(activeResource.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <Play size={14} /> Åpne artikkel
                </button>
              )}

              <div className={styles.cardActions}>
                <button className={styles.doneBtn} onClick={handleDone}>
                  <CheckCircle size={16} /> Ferdig
                </button>
                <button className={styles.skipBtn} onClick={handleSkip}>
                  <SkipForward size={14} /> Hopp over
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <RecentRatingsRow />
    </section>
  );
}

// --- Browse Section ---

const ITEMS_PER_PAGE = 20;

function BrowseSection({
  typeFilter,
  levelFilter,
}: {
  typeFilter: ResourceType | 'all';
  levelFilter: CEFRLevel | 'all';
}) {
  const { filterResources, consumedIds, markConsumed } = useCuratedResources();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [expandedAudio, setExpandedAudio] = useState<string | null>(null);

  const filtered = filterResources(typeFilter, levelFilter);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleClick = useCallback((resource: CuratedResource) => {
    if (resource.audioUrl) {
      setExpandedAudio(prev => prev === resource.id ? null : resource.id);
      markConsumed(resource.id);
    } else {
      markConsumed(resource.id);
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  }, [markConsumed]);

  if (filtered.length === 0) {
    return (
      <section>
        <h2 className={styles.sectionTitle}>Bla gjennom</h2>
        <div className={styles.empty}>Ingen innhold matcher filtrene.</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>
        Bla gjennom
        <span className={styles.sectionCount}>{filtered.length} elementer</span>
      </h2>
      <div className={styles.browseGrid}>
        {visible.map(resource => (
          <div
            key={resource.id}
            className={`${styles.browseCard} ${consumedIds.has(resource.id) ? styles.browseCardConsumed : ''}`}
          >
            <div className={styles.browseCardTop} onClick={() => handleClick(resource)}>
              <div className={styles.browseCardHeader}>
                <span className={`${styles.typeBadge} ${typeBadgeClass(resource.contentType)}`}>
                  {typeIcon(resource.contentType)}
                </span>
                <span className={styles.browseSource}>{getSourceName(resource.sourceId)}</span>
                <span className={styles.browseDate}>{formatDate(resource.publishedAt)}</span>
                {consumedIds.has(resource.id) && <Check size={12} className={styles.checkIcon} />}
              </div>
              <h3 className={styles.browseTitle}>{resource.title}</h3>
              <p className={styles.browseDesc}>{resource.description}</p>
              <div className={styles.badges}>
                {resource.cefrLevels.map(level => (
                  <span key={level} className={styles.levelBadge}>{level}</span>
                ))}
                {resource.durationMinutes && (
                  <span className={styles.durationBadge}>
                    <Clock size={10} /> {resource.durationMinutes}m
                  </span>
                )}
              </div>
            </div>
            {expandedAudio === resource.id && resource.audioUrl && (
              <div className={styles.inlineAudio}>
                <audio
                  controls
                  autoPlay
                  src={resource.audioUrl}
                  className={styles.audioPlayer}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={() => setVisibleCount(c => c + ITEMS_PER_PAGE)}
        >
          <ChevronDown size={16} /> Vis mer
        </button>
      )}
    </section>
  );
}

// --- Source Directory Section ---

function SourceDirectory() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Utforsk kilder</h2>
      <p className={styles.sectionSubtitle}>Nettsteder for norsk øvelse</p>
      <div className={styles.grid}>
        {RESOURCES.map(resource => (
          <div key={resource.id} className={styles.resourceCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{resource.title}</span>
            </div>
            <p className={styles.cardDesc}>{resource.description}</p>
            <div className={styles.badges}>
              <span className={`${styles.typeBadge} ${typeBadgeClass(resource.type)}`}>
                {typeIcon(resource.type)} {typeLabel(resource.type)}
              </span>
              {resource.levels.map(level => (
                <span key={level} className={styles.levelBadge}>{level}</span>
              ))}
              <span className={resource.free ? styles.freeBadge : styles.paidBadge}>
                {resource.free ? 'Gratis' : 'Betalt'}
              </span>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              Besøk <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Main Page ---

export default function ResourcesPage() {
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'all'>('all');
  const [preferredLevel] = usePreferredLevel();
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>(preferredLevel);
  const { loading, error } = useCuratedResources();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ressurser</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${typeFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => setTypeFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          {LEVEL_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${levelFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => setLevelFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <QuickPracticeSection levelFilter={levelFilter} />

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={20} className={styles.spinner} /> Laster innhold...
        </div>
      ) : error ? (
        <div className={styles.empty}>Kunne ikke laste innhold. Viser kun kilder.</div>
      ) : (
        <BrowseSection typeFilter={typeFilter} levelFilter={levelFilter} />
      )}

      <SourceDirectory />

      <footer className={styles.attribution}>
        News content from{' '}
        <a href="https://www.nrk.no" target="_blank" rel="noopener noreferrer">NRK</a>
        . Titles and descriptions are unaltered and link directly to nrk.no.
        See{' '}
        <a href="https://www.nrk.no/rss/" target="_blank" rel="noopener noreferrer">NRK RSS usage terms</a>.
      </footer>
    </div>
  );
}
