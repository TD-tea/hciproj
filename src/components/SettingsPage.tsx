import React from 'react';

interface SettingsPageProps {
    language: string;
    onLanguageChange: (lang: string) => void;
}

export function SettingsPage({ language, onLanguageChange }: SettingsPageProps) {
    return (
        <>
            <h2 className="title">Settings</h2>
            <div className="form">
                <div style={{ marginBottom: 20 }}>
                    <label style={{ color: 'var(--task-item-color)', display: 'block', marginBottom: 8 }}>
                        Language
                    </label>
                    <select
                        className="input"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>
            </div>
        </>
    );
} 