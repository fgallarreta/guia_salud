import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Stethoscope, MapPin, Clock, Shield, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BottomTabBar } from '../components/BottomTabBar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logoImg from '../../imports/logo.jpeg';

export function HomeScreen() {
  const navigate = useNavigate();
  const [time] = useState(new Date());

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const quickActions = [
    {
      icon: Activity,
      title: 'Evaluación de Síntomas',
      description: 'Responde preguntas sobre tu salud',
      color: 'bg-[#1a3a5c]',
      action: () => navigate('/evaluation')
    },
    {
      icon: MapPin,
      title: 'Centros Médicos',
      description: 'Encuentra el más cercano',
      color: 'bg-[#22a699]',
      action: () => navigate('/map')
    }
  ];

  const features = [
    { icon: Stethoscope, text: 'Evaluación inteligente', color: 'text-[#1a3a5c]' },
    { icon: MapPin, text: 'Ubicación en tiempo real', color: 'text-[#22a699]' },
    { icon: Clock, text: 'Disponible 24/7', color: 'text-[#6366f1]' },
    { icon: Shield, text: 'Información confiable', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-[#1a3a5c] to-[#224e70] text-white px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">{getGreeting()}</p>
              <h1 className="text-3xl font-bold tracking-wide">GUÍA SALUD</h1>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm p-2">
              <ImageWithFallback
                src={logoImg}
                alt="Guía Salud"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <p className="text-blue-100 text-sm leading-relaxed">
            Evaluamos tus síntomas y te guiamos hacia la atención médica adecuada
          </p>
        </motion.div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 -mt-4">
        {/* Acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-5 cursor-pointer hover:shadow-lg transition-all active:scale-98"
              onClick={action.action}
            >
              <div className="flex items-center gap-4">
                <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-0.5">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Información importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 mb-6">
            <div className="flex gap-3">
              <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Importante</h3>
                <p className="text-sm text-red-800 leading-relaxed">
                  Esta aplicación proporciona orientación, pero <strong>NO reemplaza</strong> la atención médica profesional. 
                  En caso de emergencia, llama al <strong>107</strong> o acude al hospital más cercano.
                </p>
              </div>
            </div>
          </Card>

          {/* Características */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <Card key={index} className="p-4 text-center">
                  <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                  <p className="text-xs text-gray-700">{feature.text}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Principal */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#224e70] hover:from-[#0f2438] hover:to-[#1a3a5c] shadow-lg text-base h-14"
            onClick={() => navigate('/evaluation')}
          >
            <Activity className="w-5 h-5 mr-2" />
            Comenzar Evaluación
          </Button>
        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
}
