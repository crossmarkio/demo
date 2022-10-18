import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('notification-root') as HTMLElement
);
root.render(
  <React.StrictMode>
        <div className="root-wrapper">
            This is the notification page
        </div>
  </React.StrictMode>
);
