import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, MapPin, Languages, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { ThemeToggle } from '../components/theme-toggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImg from '../../imports/WhatsApp_Image_2026-05-28_at_16.34.47.jpeg';

export function Home() {
  return (
    <div className="max-w-screen-sm mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={logoImg}
              alt="Guía Salud logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Guía Salud</h1>
            <p className="text-sm text-muted-foreground">Tu asistente de salud personal</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Important notice */}
        <Card className="p-4 bg-muted/50 border-muted">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Información importante</p>
              <p className="text-xs text-muted-foreground">
                Esta aplicación no reemplaza la atención médica profesional. Ante una emergencia, llama al 911.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">¿Qué necesitas?</h2>

        <Link to="/evaluation" className="block">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Evaluar síntomas</h3>
                <p className="text-sm text-muted-foreground">
                  Responde algunas preguntas sobre tu condición
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/map" className="block">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Buscar atención médica</h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra hospitales y farmacias cercanas
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/translate" className="block">
          <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Languages className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Traducción médica</h3>
                <p className="text-sm text-muted-foreground">
                  Comunícate en otro idioma
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick tips */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Consejos rápidos</h2>
        <Card className="p-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Mantén tus datos de contacto actualizados</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Guarda información de emergencia accesible</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Revisa regularmente tu historial de síntomas</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Design System Link */}
      <div className="pt-4 text-center">
        <Link to="/design-system">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Ver Design System →
          </Button>
        </Link>
      </div>
    </div>
  );
}
