import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import layoutStyles from './layout-style.module.scss';
import './common-style.css';

const Layout = ({ children }) => (
  <div className="row mx-0">
    <div className="container px-0">
      <div className={layoutStyles['layout-wrapper']}>
        <div className={layoutStyles['layout-content-wrapper']}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default Layout;
