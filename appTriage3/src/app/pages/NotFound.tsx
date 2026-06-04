import React from 'react';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="max-w-screen-sm mx-auto px-4 py-16 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="text-muted-foreground">
          Lo sentimos, la página que buscas no existe.
        </p>
      </div>
      <Link to="/">
        <Button size="lg" className="min-h-[var(--touch-target-min)]">
          <Home className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
