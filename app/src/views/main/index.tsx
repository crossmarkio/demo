import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import Index from '../../screens';
import StoreProvider from '../../store/store'

const root = ReactDOM.createRoot(
  document.getElementById('main-root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <StoreProvider>
        <div className="root-wrapper">
            <Index/>
        </div>
      </StoreProvider>
  </React.StrictMode>
);
