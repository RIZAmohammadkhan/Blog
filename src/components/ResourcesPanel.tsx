import { ExternalLink, Terminal, Monitor, Bot, Code2 } from 'lucide-react';

interface ResourcesPanelProps {
    onClose?: () => void;
}

const resources = [
    {
        category: 'Operating System',
        items: [
            { name: 'Omarchy', url: 'https://omacom.io', icon: Monitor },
        ]
    },
    {
        category: 'Code Editor',
        items: [
            { name: 'Zed', url: 'https://zed.dev', icon: Code2 },
        ]
    },
    {
        category: 'Terminal',
        items: [
            { name: 'Kitty', url: 'https://sw.kovidgoyal.net/kitty/', icon: Terminal },
            { name: 'Starship', url: 'https://starship.rs', icon: Terminal },
        ]
    },
    {
        category: 'AI Agent',
        items: [
            { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', icon: Bot },
        ]
    }
];

export default function ResourcesPanel({ onClose: _onClose }: ResourcesPanelProps) {
    void _onClose;
    return (
        <div className="flex-1 overflow-y-auto py-4 px-3">


            <p className="text-xs text-[color:var(--text-secondary)] mb-4">
                My current development environment and tech stack.
            </p>

            {resources.map(section => (
                <div key={section.category} className="mb-4">
                    <h4 className="text-xs text-[color:var(--accent-purple)] font-semibold mb-2 uppercase tracking-wide">
                        {section.category}
                    </h4>
                    <div className="space-y-1">
                        {section.items.map(item => (
                            <a
                                key={item.name}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[color:var(--accent-cyan)] hover:text-[color:var(--accent-yellow)] hover:bg-[color:var(--bg-hover)] transition-colors group"
                            >
                                <item.icon size={14} className="text-[color:var(--text-secondary)]" />
                                <span className="flex-1">{item.name}</span>
                                <ExternalLink size={10} className="text-[color:var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>
            ))}

            {/* Add Resource Request */}
            <div className="mt-6 pt-4 border-t border-[color:var(--bg-hover)]">
                <p className="text-xs text-[color:var(--text-muted)] text-center">
                    Know a great tool? <br />
                    <a href="mailto:rizamohammad.work@gmail.com" className="text-[color:var(--accent-blue)] hover:underline">
                        Let me know!
                    </a>
                </p>
            </div>
        </div>
    );
}
