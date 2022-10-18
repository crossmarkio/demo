import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.module.scss';

import Index from '../../screens';
import StoreProvider from '../../store/store'
import AuthProvider from '../../store/auth'
import ThemeWrapper from '../../components/Theme';
import Cursor from '../../components/Cursor';

const root = ReactDOM.createRoot(
  document.getElementById('popup-root') as HTMLElement
);

root.render(
      <StoreProvider>
         <AuthProvider>
               <ThemeWrapper>
                  <Cursor>
                     <div className={style.inner}>
                        <Index/>
                     </div>
                  </Cursor>
               </ThemeWrapper>
         </AuthProvider>
      </StoreProvider>
);
