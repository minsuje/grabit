import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
// const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  //  <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>,
  //  </React.StrictMode>,
);
