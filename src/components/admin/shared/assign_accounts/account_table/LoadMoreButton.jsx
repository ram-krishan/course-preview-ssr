import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';


const renderButton = (currentPage, totalPages, handleLoadMoreClick) => {
  if (currentPage === 0 || (currentPage === 1 && totalPages === 1)) {
    return null;
  }

  if (currentPage === totalPages) {
    return (
      <center>
        <h1 id="admin.shared.assignAccountsPopup.footer.noMoreAccounts" />
      </center>
    );
  }

  return (
    <center>
      <Button className="center btn btn-info" onClick={() => handleLoadMoreClick(true)}>
        <h1 id="admin.shared.assignAccountsPopup.footer.loadMoreAccounts" />
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
