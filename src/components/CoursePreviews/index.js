import React, {
  useState, useEffect, Suspense,
} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ErrorBoundary from '@honeybadger-io/react';
import HoneyBadgerClient from '../../HoneyBadger';
import ErrorFallbackPage from '../../ErrorFallbackPage';

import client from '../../contentstackClient';
import Loader from '../../components/shared/Loader';

import MainContainer from '../../MainContainer';

const CoursePreview = () => {
  const [clientState, setClient] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setClient(client);
    setLoaded(true);
  }, []);

  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-spinner sk-spinner-pulse" />
    </div>
  );

  if (!loaded) {
    return <Loader />;
  }

  return (
    <ErrorBoundary honeybadger={HoneyBadgerClient} ErrorComponent={ErrorFallbackPage}>
      <Suspense fallback={loading()} style={{ width: '100%' }}>
        <ApolloProvider client={clientState}>
          <BrowserRouter>
            <MainContainer />
          </BrowserRouter>
        </ApolloProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default CoursePreview;
