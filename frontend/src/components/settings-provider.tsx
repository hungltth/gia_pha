'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Định nghĩa kiểu cho các thiết lập của chúng ta
export interface SiteSettings {
    site_title: string;
    site_subtitle: string;
}

// Giá trị mặc định trong lúc chờ tải dữ liệu (tránh giật màn hình tối đa)
const defaultSettings: SiteSettings = {
    site_title: 'Gia phả họ Lê',
    site_subtitle: 'Dòng họ Lê Huy',
};

// Context lưu trữ data & hàm refresh
interface SettingsContextValue {
    settings: SiteSettings;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
    settings: defaultSettings,
    isLoading: true,
    refreshSettings: async () => { },
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('system_settings')
                .select('key, value');

            if (error) {
                console.error('Error fetching system settings:', error.message || error);
                return;
            }

            if (data && data.length > 0) {
                const newSettings = { ...defaultSettings };
                data.forEach((item) => {
                    if (item.key === 'site_title' || item.key === 'site_subtitle') {
                        newSettings[item.key as keyof SiteSettings] = item.value;
                    }
                });
                setSettings(newSettings);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SettingsContext);
}
