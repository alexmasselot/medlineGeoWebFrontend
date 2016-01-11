/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import InteractiveView from './components/InteractiveView';
import HexaMapPage from './components/HexaMapPage';
import AllPage from './components/AllPage';
import CountryPage from './components/CountryPage';
import CountryPairsPage from './components/CountryPairsPage';
import ContactPage from './components/ContactPage';
import ContentPage from './components/ContentPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import ActionCreators from './actions/ActionCreators';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/all', async () => {
    setTimeout(function(){
      ActionCreators.citationLocatedCountByHexagon(1, 2002);
      ActionCreators.countryCount(2002);
      ActionCreators.countryPairsCount(2002);
    },200);
    return <InteractiveView><AllPage/></InteractiveView>
  });
  on('/hexamap', async () => {
    setTimeout(function(){ActionCreators.citationLocatedCountByHexagon(1, 2002);},200);
    return <InteractiveView><HexaMapPage/></InteractiveView>
  });
  on('/country', async () => {
    setTimeout(function(){ActionCreators.countryCount(2002);},200);
    return <InteractiveView><CountryPage/></InteractiveView>
  });

  on('/country-pairs', async () => {
    setTimeout(function(){ActionCreators.countryPairsCount(2002);},200);
    return <InteractiveView><CountryPairsPage/></InteractiveView>
  });

  on('/hexamap/:year', async (req) => {
    setTimeout(function(){ActionCreators.citationLocatedCountByHexagon(1, req.params.year);},1000);
    return <HexaMapPage/>
  });

  on('/contact', async () => <ContactPage />);

  on('*', async (state) => {
    const content = await http.get(`/api/content?path=${state.path}`);
    return content && <ContentPage {...content} />;
  });



  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
