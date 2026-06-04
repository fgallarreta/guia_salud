import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { Evaluation } from './pages/Evaluation';
import { Map } from './pages/Map';
import { Translate } from './pages/Translate';
import { TriageResult } from './pages/TriageResult';
import { DesignSystem } from './pages/DesignSystem';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'evaluation', Component: Evaluation },
      { path: 'triage-result', Component: TriageResult },
      { path: 'map', Component: Map },
      { path: 'translate', Component: Translate },
      { path: 'design-system', Component: DesignSystem },
      { path: '*', Component: NotFound },
    ],
  },
]);