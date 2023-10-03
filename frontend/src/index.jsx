import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import SideNav from './ScheduleEvent/SideNav';
import { NylasProvider } from '@nylas/nylas-react';
import './styles/style.scss';
import './styles/layout2style.scss';
import './styles/styleComp.scss';
import SummarizerApp from './components/Summarizer';


const root = ReactDOM.createRoot(document.getElementById('root'));
const SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';


root.render(
  <React.StrictMode>
    <NylasProvider serverBaseUrl={SERVER_URI}>
      <SideNav />
    </NylasProvider>
  </React.StrictMode>
);
