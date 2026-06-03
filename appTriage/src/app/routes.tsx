import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './pages/SplashScreen';
import { HomeScreen } from './pages/HomeScreen';
import { SymptomEvaluation } from './pages/SymptomEvaluation';
import { SeverityResult } from './pages/SeverityResult';
import { MapScreen } from './pages/MapScreen';
import { HistoryScreen } from './pages/HistoryScreen';
import { SettingsScreen } from './pages/SettingsScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen
  },
  {
    path: '/home',
    Component: HomeScreen
  },
  {
    path: '/evaluation',
    Component: SymptomEvaluation
  },
  {
    path: '/result',
    Component: SeverityResult
  },
  {
    path: '/map',
    Component: MapScreen
  },
  {
    path: '/history',
    Component: HistoryScreen
  },
  {
    path: '/settings',
    Component: SettingsScreen
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-4">Página no encontrada</p>
          <a href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }
]);
