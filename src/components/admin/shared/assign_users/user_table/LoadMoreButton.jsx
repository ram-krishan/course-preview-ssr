import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const renderButton = (currentPage, totalPages, handleLoadMoreClick) => {
  if (currentPage === 0 || (currentPage === 1 && totalPages === 1)) {
    return null;
  }

  if (currentPage === totalPages) {
    return (
      <center>
        <FormattedMessage id="admin.shared.assignUsersPopup.footer.noMoreUsers" />
      </center>
    );
  }

  return (
    <center>
      <Button className="center btn btn-info" onClick={() => handleLoadMoreClick(true)}>
        <FormattedMessage id="admin.shared.assignUsersPopup.footer.loadMoreUsers" />
      </Button>
    </center>
  );
};

const LoadMoreButton = ({ currentPage, totalPages, handleLoadMoreClick }) => (
  renderButton(currentPage, totalPages, handleLoadMoreClick)
);

LoadMoreButton.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handleLoadMoreClick: PropTypes.func.isRequired,
};

export default LoadMoreButton;
