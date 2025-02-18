"use client";

import { usePathname } from "next/navigation";
import LanguageSelect from "./LanguageSelect";

export default function ClientLanguageSelect() {
  const pathname = usePathname();
  const isChatPage = pathname?.includes("/chat");
  
  if (!isChatPage) return null;
  
  return <LanguageSelect />;
}