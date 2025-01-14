import React, { useEffect, useState } from 'react';
import {
  keys, values, isEmpty, without,
} from 'lodash';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccountsList from './AccountsList';
import ActionHeader from './ActionHeader';
import RemoveAllWarningPopup from './RemoveAllWarningPopup';
import AssignAccountsPopup from '../../shared/assign_accounts/AssignAccountsPopup';
import {
  updateAccountRemoved,
  addAccountToSelectedAccountIds,
  removeAccountFromSelectedAccountIds,
  getExistingAccountsForAdministrator,
  removeAccounts,
} from '../../../../actions/admin/administrators/operations/AdministratorOperations';

import {
  setAddedAccountCount,
  setIsAllAccountsSelected,
  setShowInActive,
} from '../../../../actions/admin/assign_accounts/operations/AssignAccountsOperations';

const FlashMessage = ({ handleCloseMessage }) => (
  <div className="alert alert-success show fade in alert-dismissable">
    <a
      className="close"
      data-dismiss="alert"
      aria-label="close"
      title="close"
      onClick={() => handleCloseMessage(false)}
    >
      ×
    </a>
    <FormattedHTMLMessage
      id="admin.users.accountTable.removedMessage"
    />
  </div>
);

FlashMessage.propTypes = {
  handleCloseMessage: PropTypes.func.isRequired,
};


const getUserId = () => {
  const element = document.getElementById('add_administrator_to_accounts');
  return {
    userId: element.dataset.user_id,
    userGroupType: element.dataset.user_group_type,
  };
};

const getSortedKey = (key) => ({
  name: 'name',
  status: 'status',
}[key]);

const AccountsPanel = ({
  accountsList, selectedAccountIds, accountRemoved, actions, totalPages,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState('name');
  const [direction, setDirection] = useState('asc');
  const [searchText, setSearchText] = useState('');
  const [showRemoveAllWarning, setShowRemoveAllWarning] = useState(false);
  const [assignAccountsPopupVisibility, setAssignAccountsPopupVisibility] = useState(false);

  const { userId, userGroupType } = getUserId();

  const getAccountsList = () => {
    actions.getExistingAccountsForAdministrator({
      objectId: userId,
      userGroupType,
      page: currentPage + 1,
      sort,
      direction,
      searchText,
    });
  };

  useEffect(() => {
    getAccountsList();
  }, []);

  const handleSearchInputChange = (text) => {
    setSearchText(text);
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      getAccountsList();
    }
  };

  const toggleRemoveAllWarningPopup = () => {
    setShowRemoveAllWarning(!showRemoveAllWarning);
  };

  const removeSelectedAccounts = (removeAllAccounts = false) => {
    const accountIds = removeAllAccounts ? [] : selectedAccountIds;
    actions.removeAccounts(
      userId,
      userGroupType,
      accountIds,
      currentPage,
      sort,
      direction,
      searchText,
    );
    if (removeAllAccounts) {
      toggleRemoveAllWarningPopup();
    }
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.selected);
    getAccountsList();
  };

  const handleRemoveAccountCheckBoxChange = (event, accountId) => {
    event.target.checked ? actions.addAccountToSelectedAccountIds(accountId) : actions.removeAccountFromSelectedAccountIds(accountId);
  };


  const toggleAssignAccountsPopupVisibility = () => {
    actions.setShowInActive(false);
    actions.setAddedAccountCount(0);
    actions.setIsAllAccountsSelected(false);
    setAssignAccountsPopupVisibility(!assignAccountsPopupVisibility);
  };

  const onSort = (data) => {
    const sortedKey = getSortedKey(keys(data)[0]);
    const sortedDirection = values(data)[0];
    setDirection(sortedDirection);
    setSort(sortedKey);
    getAccountsList();
  };

  const currentAdminUserRole = document.getElementById('add_administrator_to_accounts').getAttribute('data-current_admin_user_role');
  return (
    <Card>
      {accountRemoved ? (
        <FlashMessage
          handleCloseMessage={actions.updateAccountRemoved}
        />
      ) : null}

      <Card.Header>
        <Row>
          <Col lg={8}>
            <h4>Accounts</h4>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {
          currentAdminUserRole !== 'operations_member'
            ? (
              <ActionHeader
                searchText={searchText}
                handleInputChange={handleSearchInputChange}
                handleEnterPress={handleEnterPress}
                disableRemoveAccountsBtn={isEmpty(selectedAccountIds)}
                disableRemoveAllBtn={isEmpty(accountsList)}
                removeSelectedAccounts={removeSelectedAccounts}
                toggleWarningModal={toggleRemoveAllWarningPopup}
                handleAddAccountsClick={toggleAssignAccountsPopupVisibility}
                handlePageClick={handlePageChange}
                totalPages={totalPages}
                getExistingAccounts={getAccountsList}
              />
            )
            : null
        }

        {assignAccountsPopupVisibility ? (
          <AssignAccountsPopup
            isVisible={assignAccountsPopupVisibility}
            handleClosePopup={toggleAssignAccountsPopupVisibility}
            objectId={userId}
            objectType={userGroupType}
            getExistingAccounts={getAccountsList}
          />
        ) : null}

        {isEmpty(accountsList) ? (
          <div className="mt-4 text-center">
            <FormattedMessage id="admin.users.accountTable.noData" />
          </div>
        ) : (
          <div>
            <AccountsList
              accounts={accountsList}
              userId={userId}
              onSort={onSort}
              handleRemoveAccountChange={handleRemoveAccountCheckBoxChange}
              currentAdminUserRole={currentAdminUserRole}
            />

            <RemoveAllWarningPopup
              showModal={showRemoveAllWarning}
              toggleModal={toggleRemoveAllWarningPopup}
              removeSelectedAccounts={removeSelectedAccounts}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  accountsList: state.admin.administrators.accounts,
  selectedAccountIds: state.admin.administrators.selectedAccountIds,
  accountRemoved: state.admin.administrators.accountRemoved,
  responseMessages: state.admin.administrators.responseMessages,
  totalPages: state.admin.administrators.totalPages,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getExistingAccountsForAdministrator,
      removeAccounts,
      updateAccountRemoved,
      addAccountToSelectedAccountIds,
      removeAccountFromSelectedAccountIds,
      setAddedAccountCount,
      setIsAllAccountsSelected,
      setShowInActive,
    },
    dispatch,
  ),
});

AccountsPanel.propTypes = {
  accountsList: PropTypes.instanceOf(Array).isRequired,
  accountRemoved: PropTypes.bool.isRequired,
  selectedAccountIds: PropTypes.instanceOf(Array).isRequired,
  totalPages: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    setAddedAccountCount: PropTypes.func.isRequired,
    getExistingAccountsForAdministrator: PropTypes.func.isRequired,
    removeAccounts: PropTypes.func.isRequired,
    updateAccountRemoved: PropTypes.func.isRequired,
    addAccountToSelectedAccountIds: PropTypes.func.isRequired,
    removeAccountFromSelectedAccountIds: PropTypes.func.isRequired,
    setAddedUserCount: PropTypes.func.isRequired,
    setIsAllAccountsSelected: PropTypes.func.isRequired,
    setShowInActive: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountsPanel);
