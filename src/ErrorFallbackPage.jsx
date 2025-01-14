
import "./components/assets/css/common-style.css";
import AlertMessage from './components/shared/AlertMessage';
import * as Locale from './locales';
import { IntlProvider, addLocaleData } from 'react-intl';

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

const xxLocaleData = {
  locale: 'xx',
};

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

const getTranslationsFor = () => Locale.en;

const ErrorFallbackPage = () => {
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/course-preview/en-us';

  const handleClick = () => {
    window.location.href = '/';
  };

  return (
    <IntlProvider locale={"en"}  messages={getTranslationsFor('en')}>
      <div>
        <AlertMessage
          alertType="danger"
          customClass="m-3"
          message= {<h1 id="errFallbackPage.alert.message"/>}
        />
        {isHomePage? null : (
          <button className='btn btn-primary error-fallback-btn' onClick={handleClick}>
            <h1 id="errorFallbackPage.btn.goBack" />
          </button>
        )}
      </div>
    </IntlProvider>
  );
};

export default ErrorFallbackPage;