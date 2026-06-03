import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Phone, MapPin, Home, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LocationCard } from '../components/LocationCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { getTriageResult, severityColors } from '../services/triageService';
import { SeverityLevel } from '../types';

export function SeverityResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { severity, totalPoints } = location.state as { severity: SeverityLevel; totalPoints: number } || {};

  useEffect(() => {
    if (!severity) {
      navigate('/home');
    }
  }, [severity, navigate]);

  if (!severity) return null;

  const result = getTriageResult(severity);
  const colors = severityColors[severity];

  const handleEmergencyCall = () => {
    window.open('tel:107');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con resultado */}
      <div className={`${colors.bg} border-b-4 ${colors.border} px-6 pt-12 pb-8`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={severity === 'red' || severity === 'orange' ? { 
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ 
              duration: 1,
              repeat: severity === 'red' ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="mb-4"
          >
            <SeverityBadge severity={severity} size="lg" />
          </motion.div>

          <h1 className={`text-3xl font-bold ${colors.text} mb-3`}>
            {result.title}
          </h1>

          <p className={`text-base ${colors.text} leading-relaxed max-w-md mx-auto`}>
            {result.description}
          </p>
        </motion.div>
      </div>

      {/* Contenido */}
      <div className="px-6 py-6 pb-24 max-w-2xl mx-auto">
        {/* Botón de acción principal */}
        {severity === 'red' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              size="lg"
              onClick={handleEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-16 text-lg shadow-lg"
            >
              <Phone className="w-6 h-6 mr-2" />
              {result.action}
            </Button>
          </motion.div>
        )}

        {/* Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              Recomendaciones
            </h2>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Medicamentos (solo para verde y amarillo) */}
        {result.medications && result.medications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Card className="p-5 bg-green-50 border-green-200">
              <h2 className="font-semibold text-green-900 mb-3">
                💊 Medicación de autocuidado
              </h2>
              <ul className="space-y-2">
                {result.medications.map((med, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-green-700 mt-3 pt-3 border-t border-green-200">
                <strong>Importante:</strong> Consulta con un farmacéutico antes de tomar cualquier medicamento.
              </p>
            </Card>
          </motion.div>
        )}

        {/* Ubicaciones cercanas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Lugares cercanos
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/map')}
              className="text-blue-600"
            >
              Ver en mapa
            </Button>
          </div>

          <div className="space-y-3">
            {result.locations.slice(0, 3).map(loc => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <Card className="p-5 bg-gray-100 border-gray-300 mb-6">
          <p className="text-sm text-gray-700 text-center leading-relaxed">
            ⚕️ <strong>Importante:</strong> Esta información no reemplaza la atención médica profesional. 
            Siempre consulta con un médico para obtener un diagnóstico preciso.
          </p>
        </Card>

        {/* Botón volver al inicio */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/home')}
          className="w-full"
        >
          <Home className="w-5 h-5 mr-2" />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}
