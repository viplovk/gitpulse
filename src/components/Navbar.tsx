import React from 'react';
import { Github } from 'lucide-react';
import { User } from '../types.ts';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: User | null;
  onOpenConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, user, onOpenConnect }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090D16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="text-base font-bold tracking-tight text-white flex items-center gap-2 group cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            GP
          </span>
          <span className="group-hover:text-emerald-400 transition-colors">GitPulse</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-400">
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentPath === '/dashboard' ? 'text-white font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('/repositories')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentPath.startsWith('/repositories') ? 'text-white font-semibold' : ''
            }`}
          >
            Repositories
          </button>
          <button
            onClick={() => onNavigate('/schedules')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentPath === '/schedules' ? 'text-white font-semibold' : ''
            }`}
          >
            Schedules
          </button>
          <button
            onClick={() => onNavigate('/activity')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentPath === '/activity' ? 'text-white font-semibold' : ''
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => onNavigate('/settings')}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentPath === '/settings' ? 'text-white font-semibold' : ''
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => onNavigate('/dashboard')}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-neutral-900/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-4 h-4 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Github className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{user.username}</span>
            </button>
          ) : (
            <button
              onClick={onOpenConnect}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Connect GitHub</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
