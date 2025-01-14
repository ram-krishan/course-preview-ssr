import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactPaginate from 'react-paginate';
import { Button, Card, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import SearchBoxField from '../../shared/assign_accounts/account_filters/SearchBoxField';
const ActionHeader = ({
  searchText,
  handleInputChange,
  handleEnterPress,
  disableRemoveAccountsBtn,
  disableRemoveAllBtn,
  removeSelectedAccounts,
  toggleWarningModal,
  handleAddAccountsClick,
  handlePageClick,
  totalPages,
  getExistingAccounts,
}) => (
  <Card className="bg-faded card-block">
    <Card.Body>
      <Row className="m-0">
        <Button
          className="btn btn-danger btn-sm navbar-btn mr-3"
          onClick={() => removeSelectedAccounts(false)}
          disabled={disableRemoveAccountsBtn}
        >
          <i className="fa fa-remove" />
          {' '}
          <FormattedMessage id="admin.users.btn.remove_selected" />
        </Button>

        <Button
          className="btn btn-danger btn-sm navbar-btn mr-3"
          onClick={toggleWarningModal}
          disabled={disableRemoveAllBtn}
        >
          <i className="fa fa-remove" />
          {' '}
          <FormattedMessage id="admin.users.btn.remove_all" />
        </Button>

        <Button className="btn btn-success btn-sm navbar-btn mr-3" onClick={handleAddAccountsClick}>
          <FontAwesomeIcon icon={faPlus} />
          {' '}
          <FormattedMessage id="admin.users.btn.addAccounts" />
        </Button>

        <SearchBoxField
          searchText={searchText}
          handleInputChange={handleInputChange}
          handleEnterPress={handleEnterPress}
          getFilteredAccounts={getExistingAccounts}
        />
        <div className="navbar-btn pull-right">
          { totalPages <= 1 ? null
            : (
              <ReactPaginate
                previousLabel={<FormattedMessage id="pagination.previousLabel" />}
                nextLabel={<FormattedMessage id="pagination.nextLabel" />}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={1}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                subContainerClassName="pages pagination"
                activeClassName="active"
              />
            )}
        </div>
      </Row>
    </Card.Body>
  </Card>
);

ActionHeader.propTypes = {
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  disableRemoveAccountsBtn: PropTypes.bool.isRequired,
  disableRemoveAllBtn: PropTypes.bool.isRequired,
  removeSelectedAccounts: PropTypes.func.isRequired,
  toggleWarningModal: PropTypes.func.isRequired,
  handleAddAccountsClick: PropTypes.func.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  getExistingAccounts: PropTypes.func.isRequired,
};

export default ActionHeader;
