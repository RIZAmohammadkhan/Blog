import { Github, Twitter, Mail, Heart, ExternalLink, Linkedin } from 'lucide-react';

interface AboutPanelProps {
    onClose?: () => void;
}

export default function AboutPanel({ onClose: _onClose }: AboutPanelProps) {
    return (
        <div className="flex-1 overflow-y-auto py-4 px-3">


            {/* Profile */}
            <div className="bg-[#1e1e1e] rounded-lg p-4 mb-4 border border-[#3e3e42]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007acc] to-[#4ec9b0] flex items-center justify-center text-white font-bold text-lg">
                        RX
                    </div>
                    <div>
                        <h3 className="text-[#dcdcaa] font-semibold">Rixa</h3>
                        <p className="text-xs text-[#858585]">Developer & Writer</p>
                    </div>
                </div>
                <p className="text-sm text-[#cccccc] leading-relaxed">
                    Writing clear guides for busy builders. Helping developers level up, one article at a time.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#1e1e1e] rounded p-3 border border-[#3e3e42] text-center">
                    <div className="text-xl font-bold text-[#4ec9b0]">15+</div>
                    <div className="text-xs text-[#858585]">Articles</div>
                </div>
                <div className="bg-[#1e1e1e] rounded p-3 border border-[#3e3e42] text-center">
                    <div className="text-xl font-bold text-[#c586c0]">6</div>
                    <div className="text-xs text-[#858585]">Categories</div>
                </div>
            </div>

            {/* Mission */}
            <div className="mb-4">
                <h4 className="text-sm text-[#dcdcaa] mb-2">Mission</h4>
                <p className="text-xs text-[#858585] leading-relaxed">
                    Creating practical, no-fluff guides that respect your time.
                    Every article is designed to be actionable and immediately useful.
                    Even better than AI.
                </p>
            </div>

            {/* Social Links */}
            <div className="mb-4">
                <h4 className="text-sm text-[#dcdcaa] mb-2">Connect</h4>
                <div className="space-y-2">
                    <a
                        href="https://github.com/rizamohammadkhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#9cdcfe] hover:text-[#dcdcaa] transition-colors"
                    >
                        <Github size={14} />
                        <span>GitHub</span>
                        <ExternalLink size={10} className="ml-auto text-[#6e6e6e]" />
                    </a>
                    <a
                        href="https://x.com/_RizaMohammad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#9cdcfe] hover:text-[#dcdcaa] transition-colors"
                    >
                        <Twitter size={14} />
                        <span>Twitter</span>
                        <ExternalLink size={10} className="ml-auto text-[#6e6e6e]" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/rizamkhan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#9cdcfe] hover:text-[#dcdcaa] transition-colors"
                    >
                        <Linkedin size={14} />
                        <span>LinkedIn</span>
                        <ExternalLink size={10} className="ml-auto text-[#6e6e6e]" />
                    </a>
                    <a
                        href="mailto:rizamohammad.work@gmail.com"
                        className="flex items-center gap-2 text-sm text-[#9cdcfe] hover:text-[#dcdcaa] transition-colors"
                    >
                        <Mail size={14} />
                        <span>Email</span>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#3e3e42] text-center">
                <p className="text-xs text-[#6e6e6e] flex items-center justify-center gap-1">
                    Made with <Heart size={10} className="text-[#f14e32]" /> in 2026
                </p>
            </div>
        </div>
    );
}
