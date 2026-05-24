import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DiaryInterface } from './pages/DiaryInterface';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DiaryInterface />
  </StrictMode>
);
