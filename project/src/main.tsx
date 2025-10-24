import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const removeBranding = () => {
  const selectors = [
    'a[href*="bolt"]',
    'a[href*="stackblitz"]',
    '[data-bolt]',
    '[data-branding]',
    'div[class*="watermark"]',
    'div[class*="badge"]',
    'iframe[title*="bolt"]',
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.parentNode && !el.closest('#root')) {
        el.remove();
      }
    });
  });

  document.querySelectorAll('body > *:not(#root)').forEach((el) => {
    const element = el as HTMLElement;
    if (element.id !== 'root' && element.tagName !== 'SCRIPT') {
      const style = window.getComputedStyle(element);
      if (style.position === 'fixed' || style.position === 'absolute') {
        element.remove();
      }
    }
  });
};

removeBranding();
setInterval(removeBranding, 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
