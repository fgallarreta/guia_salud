import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TranslationCard } from '../components/translation-card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Languages, ArrowRight } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'zh', name: '中文' },
];

const commonPhrases = [
  'Necesito un médico',
  'Tengo dolor',
  '¿Dónde está el hospital?',
  'Soy alérgico a...',
  'Necesito medicina',
  'Llame a una ambulancia',
];

const mockTranslations: Record<string, Record<string, string>> = {
  'Necesito un médico': {
    en: 'I need a doctor',
    fr: "J'ai besoin d'un médecin",
    de: 'Ich brauche einen Arzt',
    pt: 'Eu preciso de um médico',
  },
  'Tengo dolor': {
    en: 'I have pain',
    fr: "J'ai mal",
    de: 'Ich habe Schmerzen',
    pt: 'Eu tenho dor',
  },
  '¿Dónde está el hospital?': {
    en: 'Where is the hospital?',
    fr: "Où est l'hôpital?",
    de: 'Wo ist das Krankenhaus?',
    pt: 'Onde fica o hospital?',
  },
};

export function Translate() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [customText, setCustomText] = useState('');
  const [translations, setTranslations] = useState<Array<{ phrase: string; translation: string; language: string }>>([]);

  const handleQuickTranslate = (phrase: string) => {
    const translation = mockTranslations[phrase]?.[selectedLanguage] || 'Translation not available';
    const languageName = languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage.toUpperCase();
    
    setTranslations([
      { phrase, translation, language: languageName },
      ...translations,
    ]);
  };

  const handleCustomTranslate = () => {
    if (!customText.trim()) return;
    
    const translation = `[${customText}]`; // Mock translation
    const languageName = languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage.toUpperCase();
    
    setTranslations([
      { phrase: customText, translation, language: languageName },
      ...translations,
    ]);
    setCustomText('');
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Traducción médica</h1>
        <p className="text-sm text-muted-foreground">
          Comunícate en situaciones de emergencia
        </p>
      </div>

      {/* Language selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Traducir a:</label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom translation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Frase personalizada:</label>
        <div className="flex gap-2">
          <Input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Escribe tu frase..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomTranslate();
              }
            }}
          />
          <Button onClick={handleCustomTranslate} size="icon" className="flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick phrases */}
      <div className="space-y-3">
        <h3 className="font-semibold">Frases comunes:</h3>
        <div className="grid grid-cols-2 gap-2">
          {commonPhrases.map((phrase) => (
            <Button
              key={phrase}
              variant="outline"
              className="h-auto py-3 text-sm whitespace-normal text-left justify-start"
              onClick={() => handleQuickTranslate(phrase)}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>

      {/* Translations history */}
      {translations.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Traducciones recientes:</h3>
          <div className="space-y-3">
            {translations.map((item, index) => (
              <TranslationCard
                key={index}
                localPhrase={item.phrase}
                translation={item.translation}
                language={item.language}
                onPlay={() => console.log('Play audio for:', item.translation)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <Languages className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Consejo para viajeros</p>
            <p className="text-xs">
              Guarda las traducciones importantes para acceder a ellas sin conexión a internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
