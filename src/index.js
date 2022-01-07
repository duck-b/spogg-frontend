import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { CookiesProvider } from 'react-cookie';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

ReactDOM.render(  
  <React.StrictMode>
    <CookiesProvider>
        <SnackbarProvider 
          maxSnack={window.location.href.includes('/admin') ? 4 : 1} 
          anchorOrigin={
            {
              vertical: window.location.href.includes('/admin') ? 'top' : 'bottom',
              horizontal: window.location.href.includes('/admin') ? 'right' : 'center',
            }
          }
          style={{marginBottom: window.location.href.includes('/admin') ? '0px' : '50px'}}
          >
            <Router>
              <App />
            </Router>
        </SnackbarProvider>
      </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
