import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from '@/context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <CookiesProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CookiesProvider>
  </Provider>,
  // </React.StrictMode>,
);
