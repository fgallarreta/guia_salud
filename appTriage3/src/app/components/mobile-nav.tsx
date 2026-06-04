import React from 'react';
import { cn } from './ui/utils';
import { Home, ClipboardList, MapPin, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', icon: Home, path: '/' },
  { label: 'Evaluación', icon: ClipboardList, path: '/evaluation' },
  { label: 'Mapa', icon: MapPin, path: '/map' },
  { label: 'Traducir', icon: Languages, path: '/translate' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'min-w-[var(--touch-target-min)] transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
