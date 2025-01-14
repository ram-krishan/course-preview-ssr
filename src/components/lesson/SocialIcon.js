import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faShareAlt } from '@fortawesome/free-solid-svg-icons';

const SocialIcon = () => (
  <div className="ml-3 d-flex justify-content-end" data-testid="social-icon-container">
    <FontAwesomeIcon icon={faShareAlt} className="pl-3 h5" />
    <FontAwesomeIcon icon={faBookmark} className="pl-3 h5" />
  </div>
);

export default SocialIcon;
