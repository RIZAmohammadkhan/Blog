import { FileCode, X } from 'lucide-react';
import { getLanguageColor, type Tab } from '../types';

interface TabBarProps {
    tabs: Tab[];
    activeTabId: number | null;
    onTabClick: (tabId: number) => void;
    onTabClose: (tabId: number) => void;
}

export default function TabBar({ tabs, activeTabId, onTabClick, onTabClose }: TabBarProps) {
    if (tabs.length === 0) {
        return (
            <div className="h-9 bg-[#2d2d2d] flex items-end">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] text-[#969696] text-sm border-t-2 border-transparent">
                    <span className="italic">No open editors</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-9 bg-[#2d2d2d] flex items-end overflow-x-auto">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer min-w-fit group transition-colors ${tab.id === activeTabId
                            ? 'bg-[#1e1e1e] text-[#cccccc] border-t-2 border-[#007acc]'
                            : 'text-[#969696] hover:bg-[#2d2d2d] border-t-2 border-transparent'
                        }`}
                >
                    <FileCode
                        size={14}
                        style={{ color: getLanguageColor(tab.language) }}
                    />
                    <span className="truncate max-w-[150px]">{tab.title}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(tab.id);
                        }}
                        className={`p-0.5 rounded transition-colors ${tab.id === activeTabId
                                ? 'hover:bg-[#3e3e42]'
                                : 'opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42]'
                            }`}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
