/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import HexaMapPage from './components/HexaMapPage';
import ContactPage from './components/ContactPage';
import ContentPage from './components/ContentPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import HexaMapActionCreators from './actions/HexaMapActionCreators';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/hexamap', async () => {
    return <HexaMapPage paf='le chien'/>
  });

  on('/contact', async () => <ContactPage />);

  on('/login', async () => <LoginPage />);

  on('/register', async () => <RegisterPage />);

  on('*', async (state) => {
    const content = await http.get(`/api/content?path=${state.path}`);
    return content && <ContentPage {...content} />;
  });

  setTimeout(function(){HexaMapActionCreators.citationLocatedCountByHexagon(1.0, 2011);},1000);


  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
