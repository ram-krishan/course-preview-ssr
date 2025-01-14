import React, { useEffect } from 'react';
import { map, pull, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Row } from 'react-bootstrap';
import { useIntl, intlShape, FormattedMessage } from 'react-intl';
import AccountFilters from './account_filters';
import AccountTable from './account_table';
import AlertMessage from '../../../shared/AlertMessage';
import LoadMoreButton from './account_table/LoadMoreButton';

import {
  // Filters Operations
  setSearchText,
  // Accounts Table Operations
  setIsAllAccountsSelected,
  setSelectedAccountIds,
  getNewAccountsList,
  assignAccounts,
  setUnSelectedAccountIds,
  setAccountList,
  setShowInActive,
} from '../../../../actions/admin/assign_accounts/operations/AssignAccountsOperations';
const AssignAccountsPopup = ({
  isVisible,
  handleClosePopup,
  isAddingAccounts,
  objectId,
  objectType,
  filters,
  actions,
  accountsTable,
  intl,
  isShowInActiveSelected,
  addedAccountsCount,
  getExistingAccounts,
  popupTitle,
}) => {

  useEffect(() => {
    actions.setAccountList([]);
    actions.setUnSelectedAccountIds([]);
    actions.setSelectedAccountIds([]);
  }, []);

  const getFilteredAccounts = (isNextPage) => {
    let page = 1;

    const { showInActive } = accountsTable;

    if (isNextPage === true) {
      page = accountsTable.page + 1;
    }
    actions.getNewAccountsList({
      objectId,
      objectType,
      page,
      searchText: filters.searchText,
      showInActive,
    });
  }

  const handleEnterOnSearchBox = (event) => {
    if (event.key === 'Enter') {
      getFilteredAccounts();
    }
  }

  const handleAddAccountsClick = () => {
    const { isAllAccountsSelected, selectedAccountIds, unSelectedAccountIds, showInActive } = accountsTable;
    if (isEmpty(selectedAccountIds)) {
      const alertMessage = intl.formatMessage({ id: 'admin.shared.assignAccountsPopup.alert.selectAccounts' });
      alert(alertMessage);
    } else {
      actions.assignAccounts({
        objectId,
        objectType,
        isAllAccountsSelected,
        accountIds: isAllAccountsSelected ? unSelectedAccountIds : selectedAccountIds,
        searchText: filters.searchText,
        showInActive,
      })
      .then(() => {
        getExistingAccounts({ userGroupType: objectType, objectId });
      });
    }
  }

  const handleSelectAccountChange = (event, accountId) => {
    const { selectedAccountIds, unSelectedAccountIds } = accountsTable;
    const accountIds = Object.assign([], selectedAccountIds);
    const uncheckedAccountIds = Object.assign([], unSelectedAccountIds);

    if (event.target.checked) {
      accountIds.push(accountId);
      !isEmpty(uncheckedAccountIds) && pull(uncheckedAccountIds, accountId);
    } else {
      uncheckedAccountIds.push(accountId);
      pull(accountIds, accountId);
    }
    actions.setUnSelectedAccountIds(uncheckedAccountIds);
    actions.setSelectedAccountIds(accountIds);
  }

  const handleSelectAllAccounts = (event) => {
    const { accountsList } = accountsTable;
    const isChecked = event.target.checked;
    const participantIds = isChecked ? map(accountsList, 'id') : [];
    actions.setIsAllAccountsSelected(isChecked);
    actions.setSelectedAccountIds(participantIds);
  }

  const handleShowInActiveChange = (event) => {
    const isChecked = event.target.checked;
    actions.setShowInActive(isChecked);
  }

  return (
    <Modal
      show={isVisible}
      className="add-users-popup"
      size="xl"
      onHide={handleClosePopup}
    >
      <Modal.Header tag="div" closeButton cssModule={{ 'modal-title': 'flex-fill' }}>
        <Row className="px-3">
          <h3 className="flex-fill">{popupTitle}</h3>
          <Button color="success" onClick={handleAddAccountsClick} disabled={isAddingAccounts}>
            <h1 id="admin.shared.assignAccountsPopup.addSelectedAccounts" />
          </Button>
        </Row>
      </Modal.Header>

      <Modal.Body>
        {(!isAddingAccounts && addedAccountsCount > 0) ? (
          <AlertMessage
            autoHide
            alertType="success"
            message={(
              <h1
                id="admin.shared.assignAccountsPopup.alert.addedAccounts"
                values={{ accountsCount: addedAccountsCount }}
              />
            )}
          />
        ) : null}

        <AccountFilters
          searchText={filters.searchText}
          handleInputChange={actions.setSearchText}
          handleEnterPress={handleEnterOnSearchBox}
          getFilteredAccounts={getFilteredAccounts}
        />

        <input
          type="checkbox"
          checked={isShowInActiveSelected}
          onChange={handleShowInActiveChange}
        />&nbsp;&nbsp;
        <span>Show Inactive</span>
        <AccountTable
          onSelectAllAccountsChange={handleSelectAllAccounts}
          isAllAccountsSelected={accountsTable.isAllAccountsSelected}
          selectedAccountIds={accountsTable.selectedAccountIds}
          accountsList={accountsTable.accountsList}
          handleAccountSelectChange={handleSelectAccountChange}
          handleShowInActiveChange={handleShowInActiveChange}
        />
      </Modal.Body>

      <Modal.Footer>
        <LoadMoreButton
          currentPage={accountsTable.page}
          totalPages={accountsTable.totalPages}
          handleLoadMoreClick={getFilteredAccounts}
        />
      </Modal.Footer>
    </Modal>
  );
}
// handleClosePopup


const mapStateToProps = state => (
  {
    addedAccountsCount: state.admin.assignAccounts.addedAccountsCount,
    isAddingAccounts: state.admin.assignAccounts.isAddingAccounts,
    filters: state.admin.assignAccounts.filters,
    accountsTable: state.admin.assignAccounts.accountsTable,
  }
);

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({
      setSearchText,

      setIsAllAccountsSelected,
      setSelectedAccountIds,
      assignAccounts,
      setUnSelectedAccountIds,
      getNewAccountsList,
      setAccountList,
      setShowInActive,
    }, dispatch),
  }
);

AssignAccountsPopup.defaultProps = {
  popupTitle: <h1 id="admin.shared.assignAccountsPopup.title" />,
  isNoneOptionWithFilters: false,
};

AssignAccountsPopup.propTypes = {
  // Inside Props
  isAddingAccounts: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    searchText: PropTypes.string.isRequired,
  }).isRequired,
  accountsTable: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    accountsList: PropTypes.instanceOf(Array).isRequired,
    selectedAccountIds: PropTypes.instanceOf(Array).isRequired,
    isAllAccountsSelected: PropTypes.bool.isRequired,
    authenticityToken: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    // Filters Actions
    setSearchText: PropTypes.func.isRequired,
    // User List Actions
    setIsAllAccountsSelected: PropTypes.func.isRequired,
    setSelectedAccountIds: PropTypes.func.isRequired,
    setUnSelectedAccountIds: PropTypes.func.isRequired,
    getNewAccountsList: PropTypes.func.isRequired,
    assignAccounts: PropTypes.func.isRequired,
    setAccountList: PropTypes.func.isRequired,
    setShowInActive: PropTypes.func.isRequired,
  }).isRequired,

  // Outside Props
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool.isRequired,
  handleClosePopup: PropTypes.func.isRequired,
  popupTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object),
  ]),
  objectId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  getExistingAccounts: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(useIntl(AssignAccountsPopup));
