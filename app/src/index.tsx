import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import App from './app';
import Auth from './auth';
import StoreProvider from './store/store'
import AuthProvider from './store/auth'
import ThemeWrapper from './components/Theme';

import Cursor from './components/Cursor';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createSampleRequest } from './services/extension.service';

const root = ReactDOM.createRoot(
  document.getElementById('index-root') as HTMLElement
);

if (process.env['NODE_ENV'] != 'production') createSampleRequest(
   {'TransactionType':'SignIn'},
   'feb16c11-a35e-4bb4-98af-6fb52c767bb3')

root.render(
      <StoreProvider>
         <AuthProvider>
            <ThemeWrapper>
               <Cursor>
                  <BrowserRouter basename={'/'}>
                     <Routes>
                           <Route path={`${process.env.PUBLIC_URL}/`} element={<App/>} />
                           <Route path={`${process.env.PUBLIC_URL}/auth`} element={<Auth/>} />
                     </Routes>
                  </BrowserRouter>
               </Cursor>
            </ThemeWrapper>
         </AuthProvider>
      </StoreProvider>
);
