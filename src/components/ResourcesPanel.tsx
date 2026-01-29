import { ExternalLink, BookOpen, Video, Newspaper, Podcast, Code2 } from 'lucide-react';

interface ResourcesPanelProps {
    onClose?: () => void;
}

const resources = [
    {
        category: 'Learning',
        items: [
            { name: 'freeCodeCamp', url: 'https://freecodecamp.org', icon: Code2 },
            { name: 'The Odin Project', url: 'https://theodinproject.com', icon: BookOpen },
            { name: 'Fireship.io', url: 'https://fireship.io', icon: Video },
        ]
    },
    {
        category: 'News & Blogs',
        items: [
            { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: Newspaper },
            { name: 'DEV Community', url: 'https://dev.to', icon: Newspaper },
            { name: 'CSS-Tricks', url: 'https://css-tricks.com', icon: Newspaper },
        ]
    },
    {
        category: 'Podcasts',
        items: [
            { name: 'Syntax.fm', url: 'https://syntax.fm', icon: Podcast },
            { name: 'Changelog', url: 'https://changelog.com', icon: Podcast },
            { name: 'Software Engineering Daily', url: 'https://softwareengineeringdaily.com', icon: Podcast },
        ]
    },
    {
        category: 'Tools',
        items: [
            { name: 'Can I Use', url: 'https://caniuse.com', icon: Code2 },
            { name: 'Bundlephobia', url: 'https://bundlephobia.com', icon: Code2 },
            { name: 'Ray.so', url: 'https://ray.so', icon: Code2 },
        ]
    }
];

export default function ResourcesPanel({ onClose: _onClose }: ResourcesPanelProps) {
    return (
        <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="text-xs font-bold text-[#bbbbbb] uppercase tracking-wide mb-4">
                Resources
            </div>

            <p className="text-xs text-[#858585] mb-4">
                Curated links to help you grow as a developer.
            </p>

            {resources.map(section => (
                <div key={section.category} className="mb-4">
                    <h4 className="text-xs text-[#c586c0] font-semibold mb-2 uppercase tracking-wide">
                        {section.category}
                    </h4>
                    <div className="space-y-1">
                        {section.items.map(item => (
                            <a
                                key={item.name}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#9cdcfe] hover:text-[#dcdcaa] hover:bg-[#2a2d2e] transition-colors group"
                            >
                                <item.icon size={14} className="text-[#858585]" />
                                <span className="flex-1">{item.name}</span>
                                <ExternalLink size={10} className="text-[#6e6e6e] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>
            ))}

            {/* Add Resource Request */}
            <div className="mt-6 pt-4 border-t border-[#3e3e42]">
                <p className="text-xs text-[#6e6e6e] text-center">
                    Know a great resource? <br />
                    <a href="mailto:rixa@guide.dev" className="text-[#569cd6] hover:underline">
                        Let me know!
                    </a>
                </p>
            </div>
        </div>
    );
}
