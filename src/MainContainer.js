import React, { lazy, Suspense } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import {
  Row,
  Col,
} from 'react-bootstrap';

import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/de';
import esLocaleData from 'react-intl/locale-data/es';
import frLocaleData from 'react-intl/locale-data/fr';
import jaLocaleData from 'react-intl/locale-data/ja';
import nlLocaleData from 'react-intl/locale-data/nl';
import ptLocaleData from 'react-intl/locale-data/pt';
import zhLocaleData from 'react-intl/locale-data/zh';
import plLocaleData from 'react-intl/locale-data/pl';
import thLocaleData from 'react-intl/locale-data/th';
import itLocaleData from 'react-intl/locale-data/it';
import koLocaleData from 'react-intl/locale-data/ko';

import CoursePreviewRoutes from './components/CoursePreviews/CoursePreviewRoutes';
import * as Locale from './locales';
import componentLoader from './components/componentLoader';

const Layout = lazy(() => componentLoader(() => import('./components/Layout')));

const xxLocaleData = {
  locale: 'xx',
};

const getTranslationsFor = () => Locale.en;

addLocaleData([
  ...enLocaleData,
  ...deLocaleData,
  ...esLocaleData,
  ...frLocaleData,
  ...jaLocaleData,
  ...nlLocaleData,
  ...ptLocaleData,
  ...zhLocaleData,
  ...plLocaleData,
  ...thLocaleData,
  ...itLocaleData,
  ...koLocaleData,
  xxLocaleData,
]);

// TODO: Comment to test update file in jira/github workflow, remove later

function MainContainer() {
  return (
    <IntlProvider
      locale="en"
      messages={getTranslationsFor('en')}
    >
      <>
        <Row className="mx-0" style={{ backgroundColor: '#cbd5e0', minHeight: '100vh' }}>
          <Col className="px-0">
            <div id="custom-prompt" />
            <Suspense fallback="loading" style={{ width: '100%' }}>
              <Layout>
                <CoursePreviewRoutes />
              </Layout>
            </Suspense>
          </Col>
        </Row>
      </>
    </IntlProvider>
  );
}

export default MainContainer;
