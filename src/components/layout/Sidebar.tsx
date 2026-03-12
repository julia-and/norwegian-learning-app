'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, BookOpen, Settings, Flame, Sun, Moon, Globe, PenLine, BookMarked, MessageSquare } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './sidebar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Hjem', icon: LayoutDashboard },
  { href: '/progress', label: 'Fremgang', icon: BarChart3 },
  { href: '/vocabulary', label: 'Ordforråd', icon: BookOpen },
  { href: '/grammar', label: 'Grammatikk', icon: BookMarked },
  { href: '/resources', label: 'Ressurser', icon: Globe },
  { href: '/writing', label: 'Skriving', icon: PenLine },
  { href: '/conversation', label: 'Samtale', icon: MessageSquare },
  { href: '/settings', label: 'Innstillinger', icon: Settings },
];

interface SidebarProps {
  streak?: number;
}

export function Sidebar({ streak = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🇳🇴</span>
        <div>
          <div className={styles.logoText}>Norsk</div>
          <div className={styles.logoSubtext}>Tracker</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {streak > 0 && (
          <div className={styles.streakDisplay}>
            <Flame size={16} />
            {streak} dagers rekke
          </div>
        )}
        <button className={styles.themeToggle} onClick={toggle}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Lys modus' : 'Mørk modus'}
        </button>
      </div>
    </aside>
  );
}
