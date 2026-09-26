import React, { useState, useEffect } from 'react';
import { Github, Key, AlertCircle, ExternalLink, X, CheckCircle2, Shield } from 'lucide-react';
import { api } from '../lib/api.ts';

interface ConnectGithubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConnectGithubModal: React.FC<ConnectGithubModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'oauth' | 'pat'>('oauth');
  const [pat, setPat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthConfig, setOauthConfig] = useState<{ configured: boolean; redirectUri: string; message?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      api.getOAuthUrl().then(setOauthConfig).catch(() => {});
    }
  }, [isOpen]);

  // Listen for OAuth postMessage as required by oauth-integration skill
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('github.com')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setLoading(false);
        onSuccess();
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onClose]);

  if (!isOpen) return null;

  const handleOAuthConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOAuthUrl();
      if (!data.configured || !data.url) {
        setError(data.message || 'GitHub OAuth App credentials are not yet set in .env. Use Personal Access Token below to connect instantly.');
        setLoading(false);
        setTab('pat');
        return;
      }

      // Open OAuth provider directly in popup (never container URL)
      const authWindow = window.open(
        data.url,
        'gitpulse_oauth_popup',
        'width=600,height=750,menubar=no,toolbar=no'
      );

      if (!authWindow) {
        setError('Popup was blocked by your browser. Please allow popups for GitPulse.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initiate GitHub OAuth.');
      setLoading(false);
    }
  };

  const handlePatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.connectWithPat(pat.trim());
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate token with GitHub.');
      setLoading(false);
    }
  };

  const callbackUrl = oauthConfig?.redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#0B0F19] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 border border-white/[0.08] text-white">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Connect GitHub</h3>
            <p className="text-xs text-neutral-400">Authorize GitPulse to automate repository maintenance</p>
          </div>
        </div>

        {/* Auth method tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900/80 rounded-lg border border-white/[0.06] mb-5">
          <button
            onClick={() => { setTab('oauth'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'oauth' ? 'bg-[#161F30] text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            GitHub OAuth (Recommended)
          </button>
          <button
            onClick={() => { setTab('pat'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'pat' ? 'bg-[#161F30] text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Personal Access Token
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {tab === 'oauth' ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-white/[0.06] bg-neutral-900/40 p-4 space-y-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-neutral-200 font-medium">
                <Shield className="w-4 h-4 text-emerald-400" />
                Required GitHub Permissions
              </div>
              <ul className="space-y-1.5 text-neutral-400 pl-6 list-disc">
                <li><strong className="text-neutral-300">repo</strong>: To create maintenance commits and pull requests</li>
                <li><strong className="text-neutral-300">workflow</strong>: To manage GitHub Actions maintenance pipelines</li>
                <li><strong className="text-neutral-300">read:user</strong>: To display your repository ownership and profile</li>
              </ul>
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <div className="text-neutral-300 font-medium">OAuth Callback URL:</div>
              <div className="font-mono bg-neutral-950 p-2 rounded border border-white/[0.06] text-[11px] text-neutral-300 select-all break-all">
                {callbackUrl}
              </div>
            </div>

            <button
              onClick={handleOAuthConnect}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 font-sans cursor-pointer"
            >
              <Github className="w-4 h-4" />
              {loading ? 'Opening GitHub Authorization...' : 'Authorize via GitHub OAuth'}
            </button>
          </div>
        ) : (
          <form onSubmit={handlePatSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                GitHub Personal Access Token (Classic or Fine-Grained)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  placeholder="ghp_... or github_pat_..."
                  className="w-full rounded-lg border border-white/[0.08] bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-hidden font-mono"
                  required
                />
              </div>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Create a token at GitHub Settings &gt; Developer settings &gt; Personal access tokens. Required scopes: <code className="text-emerald-400 font-mono">repo</code>, <code className="text-emerald-400 font-mono">workflow</code>.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-neutral-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Token Security Guarantee
              </div>
              <p className="text-[11px] text-neutral-400">
                Tokens are immediately encrypted with AES-256-GCM before storage. Raw credentials are never transmitted back to the browser.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !pat.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              {loading ? 'Validating Token...' : 'Connect with Access Token'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
