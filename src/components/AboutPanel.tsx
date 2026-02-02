import { Github, Twitter, Mail, Heart, ExternalLink, Linkedin } from 'lucide-react';

interface AboutPanelProps {
    articleCount: number;
    categoryCount: number;
    isLoading?: boolean;
}

export default function AboutPanel({ articleCount, categoryCount, isLoading }: AboutPanelProps) {
    return (
        <div className="flex-1 overflow-y-auto py-4 px-3">


            {/* Profile */}
            <div className="bg-[color:var(--bg-primary)] rounded-lg p-4 mb-4 border border-[color:var(--bg-hover)]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[color:var(--accent-blue)] to-[color:var(--accent-cyan)] flex items-center justify-center text-[color:var(--text-on-accent)] font-bold text-lg">
                        RX
                    </div>
                    <div>
                        <h3 className="text-[color:var(--accent-yellow)] font-semibold">Rixa</h3>
                        <p className="text-xs text-[color:var(--text-secondary)]">Developer & Writer</p>
                    </div>
                </div>
                <p className="text-sm text-[color:var(--text-primary)] leading-relaxed">
                    Writing clear guides for busy builders. Helping developers level up, one article at a time.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[color:var(--bg-primary)] rounded p-3 border border-[color:var(--bg-hover)] text-center">
                    <div className="text-xl font-bold text-[color:var(--accent-cyan)]">{isLoading ? '…' : articleCount}</div>
                    <div className="text-xs text-[color:var(--text-secondary)]">Articles</div>
                </div>
                <div className="bg-[color:var(--bg-primary)] rounded p-3 border border-[color:var(--bg-hover)] text-center">
                    <div className="text-xl font-bold text-[color:var(--accent-purple)]">{isLoading ? '…' : categoryCount}</div>
                    <div className="text-xs text-[color:var(--text-secondary)]">Categories</div>
                </div>
            </div>

            {/* Mission */}
            <div className="mb-4">
                <h4 className="text-sm text-[color:var(--accent-yellow)] mb-2">Mission</h4>
                <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                    Creating practical, no-fluff guides that respect your time.
                    Every article is designed to be actionable and immediately useful.
                    Even better than AI.
                </p>
            </div>

            {/* Social Links */}
            <div className="mb-4">
                <h4 className="text-sm text-[color:var(--accent-yellow)] mb-2">Connect</h4>
                <div className="space-y-2">
                    <a
                        href="https://github.com/rizamohammadkhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[color:var(--accent-cyan)] hover:text-[color:var(--accent-yellow)] transition-colors"
                    >
                        <Github size={14} />
                        <span>GitHub</span>
                        <ExternalLink size={10} className="ml-auto text-[color:var(--text-muted)]" />
                    </a>
                    <a
                        href="https://x.com/_RizaMohammad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[color:var(--accent-cyan)] hover:text-[color:var(--accent-yellow)] transition-colors"
                    >
                        <Twitter size={14} />
                        <span>Twitter</span>
                        <ExternalLink size={10} className="ml-auto text-[color:var(--text-muted)]" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/rizamkhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[color:var(--accent-cyan)] hover:text-[color:var(--accent-yellow)] transition-colors"
                    >
                        <Linkedin size={14} />
                        <span>LinkedIn</span>
                        <ExternalLink size={10} className="ml-auto text-[color:var(--text-muted)]" />
                    </a>
                    <a
                        href="mailto:rizamohammad.work@gmail.com"
                        className="flex items-center gap-2 text-sm text-[color:var(--accent-cyan)] hover:text-[color:var(--accent-yellow)] transition-colors"
                    >
                        <Mail size={14} />
                        <span>Email</span>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[color:var(--bg-hover)] text-center">
                <p className="text-xs text-[color:var(--text-muted)] flex items-center justify-center gap-1">
                    Made with <Heart size={10} className="text-[#f14e32]" /> in 2026
                </p>
            </div>
        </div>
    );
}
