import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦" },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (language: typeof languages[0]) => {
    i18n.changeLanguage(language.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <ScrollArea className="h-[300px]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">({language.name})</span>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="w-4 h-4 text-eco-leaf" />
              )}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
