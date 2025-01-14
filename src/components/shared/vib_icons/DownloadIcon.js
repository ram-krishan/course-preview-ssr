import React from 'react';
import PropTypes from 'prop-types';

const DownloadIcon = ({ fillColor }) => (
  <svg data-testid="download-icon" width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>Group 2</title>
    <g id="Apply-v2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Apply---See-More" transform="translate(-354.000000, -990.000000)" fill={fillColor} fillRule="nonzero">
        <g id="Group-2" transform="translate(354.000000, 990.000000)">
          <path d="M8.75,6.875 L8.75,8.75 L1.25,8.75 L1.25,6.875 L0,6.875 L0,8.75 C0,9.4375 0.5625,10 1.25,10 L8.75,10 C9.4375,10 10,9.4375 10,8.75 L10,6.875 L8.75,6.875 Z" id="Path" />
          <polygon id="Path" points="8.125 4.375 7.24375 3.49375 5.625 5.10625 5.625 0 4.375 0 4.375 5.10625 2.75625 3.49375 1.875 4.375 5 7.5" />
        </g>
      </g>
    </g>
  </svg>
);


DownloadIcon.propTypes = {
  fillColor: PropTypes.string,
};

DownloadIcon.defaultProps = {
  fillColor: '#FFFFFF',
};

export default DownloadIcon;
