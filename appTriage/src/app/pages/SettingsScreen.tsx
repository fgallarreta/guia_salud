import { useState } from 'react';
import {
  Bell,
  Globe,
  Moon,
  Shield,
  Heart,
  ChevronRight,
  Info,
  Mail,
  HelpCircle
} from 'lucide-react';
import { BottomTabBar } from '../components/BottomTabBar';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImg from '../../imports/logo.jpeg';

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Preferencias',
      items: [
        {
          icon: Bell,
          label: 'Notificaciones',
          description: 'Recibe alertas y recordatorios',
          action: (
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          )
        },
        {
          icon: Moon,
          label: 'Modo oscuro',
          description: 'Próximamente disponible',
          action: (
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
            />
          )
        },
        {
          icon: Globe,
          label: 'Idioma',
          description: 'Español',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      ]
    },
    {
      title: 'Privacidad y Seguridad',
      items: [
        {
          icon: Shield,
          label: 'Privacidad',
          description: 'Gestiona tus datos',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        },
        {
          icon: Heart,
          label: 'Datos de salud',
          description: 'Información médica guardada',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      ]
    },
    {
      title: 'Soporte',
      items: [
        {
          icon: HelpCircle,
          label: 'Ayuda y FAQ',
          description: 'Preguntas frecuentes',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        },
        {
          icon: Mail,
          label: 'Contacto',
          description: 'Envíanos tus comentarios',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        },
        {
          icon: Info,
          label: 'Acerca de',
          description: 'Versión 1.0.0',
          action: <ChevronRight className="w-5 h-5 text-gray-400" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a3a5c] to-[#224e70] text-white px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold mb-1">Configuración</h1>
        <p className="text-blue-100 text-sm">
          Personaliza tu experiencia
        </p>
      </div>

      {/* Contenido */}
      <div className="px-6 py-6 space-y-6">
        {settingsSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
              {section.title}
            </h2>

            <Card className="divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  role="button"
                  tabIndex={0}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <Label className="font-medium text-gray-900">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {item.action}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Información de la app */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#1a3a5c] rounded-2xl flex items-center justify-center mx-auto mb-3 p-2">
              <ImageWithFallback
                src={logoImg}
                alt="Guía Salud"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 tracking-wide">
              GUÍA SALUD
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tu asistente de salud personal
            </p>
            <p className="text-xs text-gray-500">
              Versión 1.0.0 • Hecho con ❤️ para tu bienestar
            </p>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm mb-1">
                Aviso importante
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Guía Salud es una herramienta de orientación y no reemplaza el consejo,
                diagnóstico o tratamiento médico profesional. Siempre consulta con un
                profesional de la salud calificado.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomTabBar />
    </div>
  );
}