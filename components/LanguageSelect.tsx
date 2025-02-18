"use client";

import { useLanguageStore, useSubscriptionStore, LanguageSupported, LanguageSupportedMap } from "@/store/store";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function LanguageSelect() {
  const { language, setLanguage, getLanguages, getNotSupportedLanguages } = useLanguageStore();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const isPro = subscription?.role === "pro";

  // Memoize the language getter functions
  const getSupportedLanguages = useCallback(() => {
    return isPro ? [...getLanguages(true)] : getLanguages(false);
  }, [getLanguages, isPro]);
  
  const getUnsupportedLanguages = useCallback(() => {
    return isPro ? [] : getNotSupportedLanguages(false);
  }, [getNotSupportedLanguages, isPro]);
  
  // Keep track of supported and non-supported languages
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageSupported[]>([]);
  const [nonSupportedLanguages, setNonSupportedLanguages] = useState<LanguageSupported[]>([]);
  
  // Update languages when subscription changes
  useEffect(() => {
    if (subscription !== undefined) {
      setSupportedLanguages(getSupportedLanguages());
      setNonSupportedLanguages(getUnsupportedLanguages());
    }
  }, [subscription, getSupportedLanguages, getUnsupportedLanguages]);

  // Safe language change handler
  const handleLanguageChange = (value: LanguageSupported) => {
    if (value !== language) {
      setLanguage(value);
    }
  };

  return (
    <div>
      <Select onValueChange={handleLanguageChange} value={language}>
        <SelectTrigger className="w-[150px] text-black dark:text-white">
          <SelectValue placeholder={LanguageSupportedMap[language]} />
        </SelectTrigger>

        <SelectContent>
          {subscription === undefined ? (
            <LoadingSpinner />
          ) : (
            <>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {LanguageSupportedMap[lang]}
                </SelectItem>
              ))}
              {!isPro && nonSupportedLanguages.map((lang) => (
                <Link key={lang} href={`/register`} prefetch={false}>
                  <SelectItem key={lang} value={lang} disabled className="bg-gray-300/50 text-gray-500 dark:text-white">
                    {LanguageSupportedMap[lang]} PRO
                  </SelectItem>
                </Link>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}