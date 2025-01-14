import React, { Suspense } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import layoutStyles from './layout-style.module.scss';
import '../components/assets/css/common-style.css';

const Layout = ({ children }) => (
  <Suspense fallback="loading">
    <div className="row mx-0">
      <div className="container px-0">
        <div className={layoutStyles['layout-wrapper']}>
          <div className={layoutStyles['layout-content-wrapper']}>
            {children}
          </div>
        </div>
      </div>
    </div>
  </Suspense>
);

export default Layout;
