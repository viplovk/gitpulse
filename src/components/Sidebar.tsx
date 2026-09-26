import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  Calendar,
  Activity,
  Settings,
  Plus,
  Github,
  ShieldCheck,
} from 'lucide-react';
import { User } from '../types.ts';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: User | null;
  onOpenAddRepo: () => void;
  onOpenConnect: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  user,
  onOpenAddRepo,
  onOpenConnect,
}) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Repositories', path: '/repositories', icon: GitFork },
    { label: 'Schedules', path: '/schedules', icon: Calendar },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-white/[0.08] bg-[#090D16] min-h-[calc(100vh-3.5rem)] select-none">
      {/* Action button */}
      <div className="p-4 border-b border-white/[0.06]">
        <button
          onClick={onOpenAddRepo}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2 px-3 text-xs font-semibold text-black hover:bg-emerald-400 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Repository</span>
        </button>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold border border-white/[0.08]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Security badge & Account footer */}
      <div className="p-3 border-t border-white/[0.06] space-y-2">
        <div className="flex items-center gap-2 rounded-md bg-neutral-950 px-2.5 py-1.5 border border-white/[0.04] text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">AES-256-GCM Encrypted</span>
        </div>

        {user ? (
          <div
            onClick={() => onNavigate('/settings')}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-7 h-7 rounded-full border border-white/[0.1]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-300">
                <Github className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.username}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenConnect}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-white/20 text-xs text-neutral-400 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Connect GitHub</span>
          </button>
        )}
      </div>
    </aside>
  );
};
