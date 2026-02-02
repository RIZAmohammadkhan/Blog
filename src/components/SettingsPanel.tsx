import { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { fontFamilyOptions, type FontSettings, defaultFontSettings, defaultThemeId, themeOptions, type ThemeId } from '../types';
import { useIsMobile } from '../hooks/use-mobile';
import { Drawer, DrawerContent } from './ui/drawer';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: FontSettings;
    onSettingsChange: (settings: FontSettings) => void;
    theme: ThemeId;
    onThemeChange: (theme: ThemeId) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange, theme, onThemeChange }: SettingsPanelProps) {
    const isMobile = useIsMobile();
    const [localSettings, setLocalSettings] = useState(settings);
    const [localTheme, setLocalTheme] = useState<ThemeId>(theme);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    useEffect(() => {
        setLocalTheme(theme);
    }, [theme]);

    // Prevent background scrolling when panel is open (desktop modal)
    useEffect(() => {
        if (!isOpen) return;
        if (isMobile) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, isMobile]);

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

        setLocalTheme(defaultThemeId);
        onThemeChange(defaultThemeId);
    };

    if (isMobile) {
        return (
            <Drawer
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DrawerContent className="bg-[color:var(--bg-secondary)] border-t border-[color:var(--bg-hover)] rounded-t-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--bg-hover)]">
                        <div className="flex items-center gap-2 text-[color:var(--text-primary)]">
                            <SettingsIcon size={18} />
                            <div>
                                <div className="font-medium leading-tight">Settings</div>
                                <div className="text-[11px] text-[color:var(--text-secondary)]">Reading experience</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 -mr-1 rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                            aria-label="Close settings"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-[75dvh] overflow-y-auto p-4 space-y-4 pb-[calc(env(safe-area-inset-bottom)+88px)]">
                        {/* Theme */}
                        <div className="bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded-lg p-4">
                            <label className="block text-sm text-[color:var(--text-primary)] mb-2">Theme</label>
                            <select
                                value={localTheme}
                                onChange={e => {
                                    const nextTheme = e.target.value as ThemeId;
                                    setLocalTheme(nextTheme);
                                    onThemeChange(nextTheme);
                                }}
                                className="w-full px-3 py-2.5 bg-[color:var(--bg-secondary)] border border-[color:var(--bg-hover)] rounded text-sm text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent-blue)] transition-colors"
                            >
                                {themeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Font Family */}
                        <div className="bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded-lg p-4">
                            <label className="block text-sm text-[color:var(--text-primary)] mb-2">Font Family</label>
                            <select
                                value={localSettings.fontFamily}
                                onChange={e => handleFontFamilyChange(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[color:var(--bg-secondary)] border border-[color:var(--bg-hover)] rounded text-sm text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent-blue)] transition-colors"
                            >
                                {fontFamilyOptions.map(option => (
                                    <option key={option.label} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Font Weight */}
                        <div className="bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded-lg p-4">
                            <label className="block text-sm text-[color:var(--text-primary)] mb-2">
                                Font Weight: <span className="text-[color:var(--accent-blue)]">{localSettings.fontWeight}</span>
                            </label>
                            <input
                                type="range"
                                min="300"
                                max="700"
                                step="100"
                                value={localSettings.fontWeight}
                                onChange={e => handleFontWeightChange(Number(e.target.value))}
                                className="w-full h-2 bg-[color:var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[color:var(--accent-blue)]"
                            />
                            <div className="flex justify-between text-xs text-[color:var(--text-muted)] mt-2">
                                <span>Light</span>
                                <span>Normal</span>
                                <span>Bold</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded-lg p-4">
                            <p className="text-xs text-[color:var(--text-muted)] mb-2">Preview</p>
                            <p
                                className="text-[color:var(--text-primary)]"
                                style={{
                                    fontFamily: localSettings.fontFamily,
                                    fontWeight: localSettings.fontWeight
                                }}
                            >
                                The quick brown fox jumps over the lazy dog.
                            </p>
                            <p
                                className="text-sm text-[color:var(--accent-cyan)] mt-2"
                                style={{
                                    fontFamily: localSettings.fontFamily,
                                    fontWeight: localSettings.fontWeight
                                }}
                            >
                                // Code comment style preview
                            </p>
                        </div>
                    </div>

                    {/* Sticky Footer Actions */}
                    <div className="absolute inset-x-0 bottom-0 bg-[color:var(--bg-secondary)] border-t border-[color:var(--bg-hover)] p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 px-4 py-2.5 text-sm text-[color:var(--text-primary)] bg-[color:var(--bg-primary)] hover:bg-[color:var(--bg-hover)] border border-[color:var(--bg-hover)] rounded transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm text-[color:var(--text-on-accent)] bg-[color:var(--accent-blue)] hover:bg-[color:var(--accent-blue-hover)] rounded transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start md:items-center justify-center pt-4 md:pt-0 px-3"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onPointerDown={onClose} />

            {/* Panel */}
            <div
                className="relative w-full max-w-md bg-[color:var(--bg-secondary)] rounded-lg border border-[color:var(--bg-hover)] shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)] md:max-h-[90dvh]"
                onPointerDown={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--bg-hover)]">
                    <div className="flex items-center gap-2 text-[color:var(--text-primary)]">
                        <SettingsIcon size={18} />
                        <span className="font-medium">Settings</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                        aria-label="Close settings"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
                    {/* Theme */}
                    <div>
                        <label className="block text-sm text-[color:var(--text-primary)] mb-2">
                            Theme
                        </label>
                        <select
                            value={localTheme}
                            onChange={e => {
                                const nextTheme = e.target.value as ThemeId;
                                setLocalTheme(nextTheme);
                                onThemeChange(nextTheme);
                            }}
                            className="w-full px-3 py-2 bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded text-sm text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent-blue)] transition-colors"
                        >
                            {themeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Font Family */}
                    <div>
                        <label className="block text-sm text-[color:var(--text-primary)] mb-2">
                            Font Family
                        </label>
                        <select
                            value={localSettings.fontFamily}
                            onChange={e => handleFontFamilyChange(e.target.value)}
                            className="w-full px-3 py-2 bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)] rounded text-sm text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent-blue)] transition-colors"
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
                        <label className="block text-sm text-[color:var(--text-primary)] mb-2">
                            Font Weight: <span className="text-[color:var(--accent-blue)]">{localSettings.fontWeight}</span>
                        </label>
                        <input
                            type="range"
                            min="300"
                            max="700"
                            step="100"
                            value={localSettings.fontWeight}
                            onChange={e => handleFontWeightChange(Number(e.target.value))}
                            className="w-full h-2 bg-[color:var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-[color:var(--accent-blue)]"
                        />
                        <div className="flex justify-between text-xs text-[color:var(--text-muted)] mt-1">
                            <span>Light</span>
                            <span>Normal</span>
                            <span>Bold</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-[color:var(--bg-primary)] rounded border border-[color:var(--bg-hover)]">
                        <p className="text-xs text-[color:var(--text-muted)] mb-2">Preview:</p>
                        <p
                            className="text-[color:var(--text-primary)]"
                            style={{
                                fontFamily: localSettings.fontFamily,
                                fontWeight: localSettings.fontWeight
                            }}
                        >
                            The quick brown fox jumps over the lazy dog.
                        </p>
                        <p
                            className="text-sm text-[color:var(--accent-cyan)] mt-2"
                            style={{
                                fontFamily: localSettings.fontFamily,
                                fontWeight: localSettings.fontWeight
                            }}
                        >
              // Code comment style preview
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4 border-t border-[color:var(--bg-hover)]">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] rounded transition-colors"
                        >
                            Reset to Defaults
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-[color:var(--text-on-accent)] bg-[color:var(--accent-blue)] hover:bg-[color:var(--accent-blue-hover)] rounded transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
