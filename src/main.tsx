import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';

const container = document.getElementById('root');
if (container) {
	createRoot(container).render(<App />);
}
