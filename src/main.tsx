import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { registerPwaServiceWorker } from './app/pwa/pwa-update-store';
import './styles/index.css';

registerPwaServiceWorker();

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
