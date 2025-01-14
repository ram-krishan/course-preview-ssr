import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import CoursePreview from './components/CoursePreviews';
import reportWebVitals from './reportWebVitals';

import './scss/_open_sans_font.scss';
import './scss/heading_classes.scss'

ReactDOM.render(
  <React.StrictMode>
    <CoursePreview />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
