'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, BookOpen, Settings, Globe, PenLine, BookMarked, MessageSquare } from 'lucide-react';
import styles from './mobile-nav.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Hjem', icon: LayoutDashboard },
  { href: '/progress', label: 'Fremgang', icon: BarChart3 },
  { href: '/vocabulary', label: 'Ord', icon: BookOpen },
  { href: '/grammar', label: 'Grammatikk', icon: BookMarked },
  { href: '/resources', label: 'Ressurser', icon: Globe },
  { href: '/writing', label: 'Skriving', icon: PenLine },
  { href: '/conversation', label: 'Samtale', icon: MessageSquare },
  { href: '/settings', label: 'Innstillinger', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
