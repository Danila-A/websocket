import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './styles/styles.css';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
