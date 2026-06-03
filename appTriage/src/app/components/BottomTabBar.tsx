import { Home, MapPin, History, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomTabBar() {
  const location = useLocation();

  const tabs = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: MapPin, label: 'Mapa', path: '/map' },
    { icon: History, label: 'Historial', path: '/history' },
    { icon: Settings, label: 'Ajustes', path: '/settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#1a3a5c]' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
