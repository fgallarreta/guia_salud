import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { TriageBadge } from '../components/triage-badge';
import { QuestionCard } from '../components/question-card';
import { TriageResultCard } from '../components/triage-result-card';
import { MedicalFacilityCard } from '../components/medical-facility-card';
import { TranslationCard } from '../components/translation-card';
import { ChatMessage, TypingIndicator } from '../components/chat-message';
import { ThemeToggle } from '../components/theme-toggle';
import { Heart, Activity, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router';

export function DesignSystem() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Guía Salud Design System</h1>
            <p className="text-muted-foreground">Componentes y patrones de diseño</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button variant="outline" size="icon">
                <HomeIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Color Palette</h2>
          <p className="text-sm text-muted-foreground">Sistema de colores WCAG AA compliant</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Triage Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--triage-green)] flex items-center justify-center text-white font-medium">
                  Green
                </div>
                <p className="text-xs text-muted-foreground">Autocuidado</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--triage-yellow)] flex items-center justify-center text-white font-medium">
                  Yellow
                </div>
                <p className="text-xs text-muted-foreground">Consulta médica</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[var(--triage-red)] flex items-center justify-center text-white font-medium">
                  Red
                </div>
                <p className="text-xs text-muted-foreground">Atención inmediata</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Semantic Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm">
                  Primary
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-[var(--success)] flex items-center justify-center text-white text-sm">
                  Success
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-[var(--warning)] flex items-center justify-center text-white text-sm">
                  Warning
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 rounded-lg bg-destructive flex items-center justify-center text-destructive-foreground text-sm">
                  Danger
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Typography */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Typography</h2>
          <p className="text-sm text-muted-foreground">Escala modular optimizada para mobile</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h1>H1 - Heading 1 (32px)</h1>
            <p className="text-xs text-muted-foreground">font-size: 2rem, font-weight: 600</p>
          </div>
          <div className="space-y-2">
            <h2>H2 - Heading 2 (24px)</h2>
            <p className="text-xs text-muted-foreground">font-size: 1.5rem, font-weight: 600</p>
          </div>
          <div className="space-y-2">
            <h3>H3 - Heading 3 (20px)</h3>
            <p className="text-xs text-muted-foreground">font-size: 1.25rem, font-weight: 600</p>
          </div>
          <div className="space-y-2">
            <p>Body - Regular text (16px)</p>
            <p className="text-xs text-muted-foreground">font-size: 1rem, font-weight: 400</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Buttons */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
          <p className="text-sm text-muted-foreground">Variantes y tamaños</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Sizes</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Heart className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">With Icons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Activity className="w-4 h-4 mr-2" />
                Evaluar síntomas
              </Button>
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Alerta
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Form Elements */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Form Elements</h2>
          <p className="text-sm text-muted-foreground">Inputs y controles</p>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input</label>
            <Input placeholder="Escribe algo..." />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            <label className="text-sm">Checkbox example</label>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={checked} onCheckedChange={setChecked} />
            <label className="text-sm">Switch example</label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Progress</label>
            <Progress value={66} />
          </div>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Badges</h2>
          <p className="text-sm text-muted-foreground">Indicadores de estado</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Standard Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Triage Badges</h3>
            <div className="flex flex-wrap gap-2">
              <TriageBadge level="green" />
              <TriageBadge level="yellow" />
              <TriageBadge level="red" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Question Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Question Cards</h2>
          <p className="text-sm text-muted-foreground">Tarjetas seleccionables</p>
        </div>

        <div className="space-y-3 max-w-md">
          <QuestionCard
            icon={Activity}
            title="Opción seleccionada"
            description="Esta es una tarjeta en estado seleccionado"
            selected={true}
          />
          <QuestionCard
            icon={Heart}
            title="Opción no seleccionada"
            description="Estado por defecto"
            selected={false}
          />
          <QuestionCard
            icon={AlertCircle}
            title="Opción deshabilitada"
            description="No se puede seleccionar"
            disabled={true}
          />
        </div>
      </section>

      <Separator />

      {/* Triage Result Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Triage Result Cards</h2>
          <p className="text-sm text-muted-foreground">Resultados del sistema de triage</p>
        </div>

        <div className="space-y-4 max-w-md">
          <TriageResultCard
            level="green"
            explanation="Basándonos en tus síntomas, puedes manejar esta situación con autocuidado en casa."
            nextSteps={[
              'Descansa adecuadamente',
              'Mantente hidratado',
              'Monitorea tu condición'
            ]}
            ctaLabel="Volver al inicio"
            onCtaClick={() => console.log('Green CTA')}
          />

          <TriageResultCard
            level="yellow"
            explanation="Recomendamos que consultes con un profesional médico en las próximas 24-48 horas."
            nextSteps={[
              'Agenda una cita médica',
              'Monitorea tus síntomas',
              'Si empeora, busca atención inmediata'
            ]}
            ctaLabel="Buscar centros médicos"
            onCtaClick={() => console.log('Yellow CTA')}
          />

          <TriageResultCard
            level="red"
            explanation="Tus síntomas sugieren una posible emergencia médica. Busca atención inmediata."
            nextSteps={[
              'Llama al 911 o acude a urgencias',
              'No conduzcas tú mismo',
              'Mantén la calma'
            ]}
            ctaLabel="Llamar al 911"
            onCtaClick={() => console.log('Red CTA')}
          />
        </div>
      </section>

      <Separator />

      {/* Medical Facility Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Medical Facility Cards</h2>
          <p className="text-sm text-muted-foreground">Información de centros médicos</p>
        </div>

        <div className="space-y-3 max-w-md">
          <MedicalFacilityCard
            name="Hospital General Central"
            type="hospital"
            distance="1.2 km"
            address="Av. Principal 123"
            hours="Abierto 24 horas"
            status="open"
            phone="+1234567890"
            onNavigate={() => console.log('Navigate')}
            onCall={() => console.log('Call')}
          />

          <MedicalFacilityCard
            name="Farmacia San José"
            type="pharmacy"
            distance="0.5 km"
            hours="7:00 - 22:00"
            status="closing-soon"
            onNavigate={() => console.log('Navigate')}
          />
        </div>
      </section>

      <Separator />

      {/* Translation Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Translation Cards</h2>
          <p className="text-sm text-muted-foreground">Traducciones médicas</p>
        </div>

        <div className="space-y-3 max-w-md">
          <TranslationCard
            localPhrase="Necesito un médico"
            translation="I need a doctor"
            language="EN"
            onPlay={() => console.log('Play audio')}
          />
        </div>
      </section>

      <Separator />

      {/* Chat Messages */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Chat Messages</h2>
          <p className="text-sm text-muted-foreground">Mensajes del chat con IA</p>
        </div>

        <Card className="p-4 space-y-4 max-w-md">
          <ChatMessage
            role="assistant"
            content="¡Hola! ¿En qué puedo ayudarte hoy?"
            timestamp="10:30"
          />
          <ChatMessage
            role="user"
            content="Tengo dolor de cabeza desde hace dos días"
            timestamp="10:31"
          />
          <ChatMessage
            role="assistant"
            content="Entiendo. El dolor de cabeza puede tener varias causas. ¿Has notado otros síntomas?"
            timestamp="10:31"
          />
          <TypingIndicator />
        </Card>
      </section>

      <Separator />

      {/* Spacing & Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Spacing Scale</h2>
          <p className="text-sm text-muted-foreground">Sistema de espaciado 8pt grid</p>
        </div>

        <div className="space-y-2">
          {[4, 8, 12, 16, 24, 32, 40, 48, 64].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <div
                className="bg-primary"
                style={{ width: `${size}px`, height: '20px' }}
              />
              <span className="text-sm text-muted-foreground">{size}px</span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Touch Targets */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Touch Targets</h2>
          <p className="text-sm text-muted-foreground">Mínimo 44x44px (WCAG AA)</p>
        </div>

        <div className="flex items-center gap-4">
          <Button size="lg" className="min-h-[var(--touch-target-min)]">
            Touch Target 44px
          </Button>
          <div className="text-sm text-muted-foreground">
            Todos los elementos interactivos deben cumplir con el tamaño mínimo de 44x44px
          </div>
        </div>
      </section>
    </div>
  );
}
