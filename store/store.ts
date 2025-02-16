import { create } from 'zustand';
import { Subscription } from '@/types/Subscription';

export type LanguageSupported = 
    | 'en'
    | 'es'
    | 'fr'
    | 'de'
    | 'ja'
    | 'la'
    | 'ru'
    | 'zh'
    | 'ar';

export const LanguageSupportedMap: Record<LanguageSupported, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
    la: 'Latin',
    ru: 'Russian',
    zh: 'Mandarin',
    ar: 'Arabic',
};


interface SubscriptionState {
    subscription: Subscription | null | undefined;
    setSubscription: (subscription: Subscription | null) => void;
}


export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    subscription: undefined,
    setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));


