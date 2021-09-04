import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {GlobalProvider} from './context/GlobalState'
import {SpeechProvider} from '@speechly/react-client'


ReactDOM.render(
  <SpeechProvider appId="d556e796-2695-42c2-8e9e-5aa53d6e1981" language="en-US">
  <GlobalProvider>
    <App />
  </GlobalProvider>
  </SpeechProvider>,
  document.getElementById('root')
);
