import React from 'react';
import { Outlet } from 'react-router';
import { MobileNav } from '../components/mobile-nav';

export function Root() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Outlet />
      <MobileNav />
    </div>
  );
}
