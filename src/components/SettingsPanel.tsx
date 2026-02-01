import { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { fontFamilyOptions, type FontSettings, defaultFontSettings } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: FontSettings;
    onSettingsChange: (settings: FontSettings) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    // Prevent background scrolling when panel is open (especially important on mobile)
    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const handleFontFamilyChange = (value: string) => {
        const newSettings = { ...localSettings, fontFamily: value };
        setLocalSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const handleFontWeightChange = (value: number) => {
        const newSettings = { ...localSettings, fontWeight: value };
        setLocalSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const handleReset = () => {
        setLocalSettings(defaultFontSettings);
        onSettingsChange(defaultFontSettings);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start md:items-center justify-center pt-4 md:pt-0 px-3"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onPointerDown={onClose} />

            {/* Panel */}
            <div
                className="relative w-full max-w-md bg-[#252526] rounded-lg border border-[#3c3c3c] shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] md:max-h-[90dvh]"
                onPointerDown={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#3c3c3c]">
                    <div className="flex items-center gap-2 text-[#cccccc]">
                        <SettingsIcon size={18} />
                        <span className="font-medium">Settings</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#858585] hover:text-[#cccccc] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
                    {/* Font Family */}
                    <div>
                        <label className="block text-sm text-[#cccccc] mb-2">
                            Font Family
                        </label>
                        <select
                            value={localSettings.fontFamily}
                            onChange={e => handleFontFamilyChange(e.target.value)}
                            className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#3e3e42] rounded text-sm text-[#cccccc] outline-none focus:border-[#007acc] transition-colors"
                        >
                            {fontFamilyOptions.map(option => (
                                <option key={option.label} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Font Weight */}
                    <div>
                        <label className="block text-sm text-[#cccccc] mb-2">
                            Font Weight: <span className="text-[#569cd6]">{localSettings.fontWeight}</span>
                        </label>
                        <input
                            type="range"
                            min="300"
                            max="700"
                            step="100"
                            value={localSettings.fontWeight}
                            onChange={e => handleFontWeightChange(Number(e.target.value))}
                            className="w-full h-2 bg-[#1e1e1e] rounded-lg appearance-none cursor-pointer accent-[#007acc]"
                        />
                        <div className="flex justify-between text-xs text-[#6e6e6e] mt-1">
                            <span>Light</span>
                            <span>Normal</span>
                            <span>Bold</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-[#1e1e1e] rounded border border-[#3e3e42]">
                        <p className="text-xs text-[#6e6e6e] mb-2">Preview:</p>
                        <p
                            className="text-[#cccccc]"
                            style={{
                                fontFamily: localSettings.fontFamily,
                                fontWeight: localSettings.fontWeight
                            }}
                        >
                            The quick brown fox jumps over the lazy dog.
                        </p>
                        <p
                            className="text-sm text-[#9cdcfe] mt-2"
                            style={{
                                fontFamily: localSettings.fontFamily,
                                fontWeight: localSettings.fontWeight
                            }}
                        >
              // Code comment style preview
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4 border-t border-[#3e3e42]">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm text-[#cccccc] hover:bg-[#3e3e42] rounded transition-colors"
                        >
                            Reset to Defaults
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-white bg-[#007acc] hover:bg-[#006bb3] rounded transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
