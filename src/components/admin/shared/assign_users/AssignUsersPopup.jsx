import React from 'react';
import { map, pull, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Row } from 'react-bootstrap';
import { useIntl, intlShape, FormattedMessage } from 'react-intl';

import UserFilters from './user_filters';
import UserTable from './user_table';
import AlertMessage from '../../../shared/AlertMessage';
import LoadMoreButton from './user_table/LoadMoreButton';
import { inverseKeyMapping, remapSelectOptionsKeys } from '../../../shared/select_boxes/utils';

import {
  // Filters Operations
  getUserFilters,
  setSearchText,
  setSelectedSalesRoles,
  setSelectedTerritories,
  setSelectedBusinessUnits,
  setIsManager,
  // Users Table Operations
  setIsAllUsersSelected,
  setSelectedUserIds,
  getNewUsersList,
  assignUsers,
  setUnSelectedUserIds,
  setUserList,
  setSelectedOrganizationalGroups,
  setSelectedUserGroups,
} from '../../../../actions/admin/assign_users/operations/AssignUsersOperations';

class AssignUsersPopup extends React.Component {
  constructor(props) {
    super(props);
    // Filters Handlers
    this.getCurrentFilters = this.getCurrentFilters.bind(this);
    this.getFilteredUsers = this.getFilteredUsers.bind(this);
    this.handleEnterOnSearchBox = this.handleEnterOnSearchBox.bind(this);
    this.handleSalesRoleChange = this.handleSalesRoleChange.bind(this);
    this.handleTerritoryChange = this.handleTerritoryChange.bind(this);
    this.handleBusinessUnitChange = this.handleBusinessUnitChange.bind(this);
    this.handleOrganizationalGroupChange = this.handleOrganizationalGroupChange.bind(this);
    this.handleUserGroupChange = this.handleUserGroupChange.bind(this);
    // Users Table Handlers
    this.handleAddUsersClick = this.handleAddUsersClick.bind(this);
    this.handleSelectUserChange = this.handleSelectUserChange.bind(this);
    this.handleSelectAllUsers = this.handleSelectAllUsers.bind(this);

    this.handleIsManagerChange = this.handleIsManagerChange.bind(this);
  }

  componentDidMount() {
    const {
      actions, accountId, objectId, objectType, userType, filters,
    } = this.props;
    const page = 1;

    let currentFilters = {};

    if (objectType !== 'Vib::EmbeddedField') {
      actions.getUserFilters(accountId);
      currentFilters = this.getCurrentFilters();
    }

    actions.setUserList({
      accountId,
      objectId,
      objectType,
      userType,
      page,
      searchText: filters.searchText,
      filters: currentFilters,
    });
    actions.setUnSelectedUserIds([]);
    actions.setSelectedUserIds([]);
  }

  getCurrentFilters() {
    const {
      selectedSalesRoles, selectedTerritories,
      selectedBusinessUnits, selectedIsManager,
      selectedOrganizationalGroups,
      selectedUserGroups,
    } = this.props.filters;

    return {
      sales_roles: map(selectedSalesRoles, 'id'),
      territories: selectedTerritories,
      business_units: selectedBusinessUnits,
      organizationalGroups: selectedOrganizationalGroups,
      userGroups: selectedUserGroups,
      is_a_manager: selectedIsManager !== null ? selectedIsManager.value : '',
    };
  }

  getFilteredUsers(isNextPage) {
    const {
      accountId, objectId, objectType, userType, actions, filters, usersTable,
    } = this.props;
    let page = 1;

    if (isNextPage === true) {
      page = usersTable.page + 1;
    }

    let currentFilters = {};

    if (objectType !== 'Vib::EmbeddedField') {
      currentFilters = this.getCurrentFilters();
    }

    actions.getNewUsersList({
      accountId,
      objectId,
      objectType,
      userType,
      page,
      searchText: filters.searchText,
      filters: currentFilters,
    });
  }

  handleEnterOnSearchBox(event) {
    if (event.key === 'Enter') {
      this.getFilteredUsers();
    }
  }

  handleSalesRoleChange(selectedOptions) {
    const salesRoles = remapSelectOptionsKeys(selectedOptions, inverseKeyMapping);
    this.props.actions.setSelectedSalesRoles(salesRoles)
      .then(() => this.getFilteredUsers());
  }

  handleTerritoryChange(territories) {
    this.props.actions.setSelectedTerritories(territories)
      .then(() => this.getFilteredUsers());
  }

  handleBusinessUnitChange(businessUnits) {
    this.props.actions.setSelectedBusinessUnits(businessUnits)
      .then(() => this.getFilteredUsers());
  }

  handleOrganizationalGroupChange(organizationalGroups) {
    const { actions } = this.props;
    actions.setSelectedOrganizationalGroups(organizationalGroups)
      .then(() => this.getFilteredUsers());
  }

  remapSelectOptions(options, key) {
    const selectOption = remapSelectOptionsKeys(
      options,
      inverseKeyMapping,
    );
    const { actions } = this.props;
    actions.setSelectedUserGroups(selectOption)
      .then(() => this.getFilteredUsers());
  }

  handleUserGroupChange(userGroups) {
    this.remapSelectOptions(userGroups, 'userGroup');
  }

  handleIsManagerChange(option) {
    const { actions } = this.props;

    actions.setIsManager(option)
      .then(() => this.getFilteredUsers());
  }

  handleAddUsersClick() {
    const {
      accountId, embeddedFieldValue, objectId, objectType, userType, filters, usersTable, actions,
    } = this.props;
    const { isAllUsersSelected, selectedUserIds, unSelectedUserIds } = usersTable;

    let currentFilters = {};
    if (objectType !== 'Vib::EmbeddedField') {
      actions.getUserFilters(accountId);
      currentFilters = this.getCurrentFilters();
    }
    const isEmbeddedFieldModal = () => objectType === 'Vib::EmbeddedField';

    if (isEmpty(selectedUserIds)) {
      const alertMessage = this.props.intl.formatMessage({ id: 'admin.shared.assignUsersPopup.alert.selectUsers' });
      alert(alertMessage);
    } else if (isEmbeddedFieldModal() && isEmpty(embeddedFieldValue)) {
      const alertMessage = this.props.intl.formatMessage({ id: 'vib.admin.shared.assignUsersPopup.alert.enterEmbeddedFieldValue' });
      alert(alertMessage);
    } else {
      actions.assignUsers({
        accountId,
        objectId,
        objectType,
        userType,
        isAllUsersSelected,
        userIds: isAllUsersSelected ? unSelectedUserIds : selectedUserIds,
        searchText: filters.searchText,
        value: embeddedFieldValue,
        filters: currentFilters,
      })
        .then(() => {
          this.props.getExistingUsers({
            accountId, objectType, userType, objectId,
          });
        });
    }
  }

  handleSelectUserChange(event, userId) {
    const { actions, usersTable: { selectedUserIds, unSelectedUserIds } } = this.props;
    const userIds = Object.assign([], selectedUserIds);
    const uncheckedUserIds = Object.assign([], unSelectedUserIds);

    if (event.target.checked) {
      userIds.push(userId);
      !isEmpty(uncheckedUserIds) && pull(uncheckedUserIds, userId);
    } else {
      uncheckedUserIds.push(userId);
      pull(userIds, userId);
    }
    actions.setUnSelectedUserIds(uncheckedUserIds);
    actions.setSelectedUserIds(userIds);
  }

  handleSelectAllUsers(event) {
    const { actions, usersTable: { usersList } } = this.props;
    const isChecked = event.target.checked;
    const participantIds = isChecked ? map(usersList, 'id') : [];
    actions.setIsAllUsersSelected(isChecked);
    actions.setSelectedUserIds(participantIds);
  }

  render() {
    const {
      isVisible,
      handleClosePopup,
      isAddingUsers,
      filters,
      usersTable,
      userType,
      objectType,
      embeddedFieldValue,
    } = this.props;

    const isEmbeddedFieldModal = () => objectType === 'Vib::EmbeddedField';

    return (
      <Modal
        show={isVisible}
        className="add-users-popup pb-5"
        size="xl"
        onHide={handleClosePopup}

      >
        <Modal.Header tag="div" closeButton cssModule={{ 'modal-title': 'flex-fill' }}>
          <Row className="px-3">
            <h3 className="flex-fill"><h1 id={`admin.shared.assignUsersPopup.${userType}.title`} /></h3>
            { !isEmbeddedFieldModal() ? (
              <Button color="success" onClick={this.handleAddUsersClick} disabled={isAddingUsers}>
                <h1 id="admin.shared.assignUsersPopup.addSelectedUsers" />
              </Button>
            ) : null}
          </Row>
        </Modal.Header>

        <Modal.Body>
          {(!isAddingUsers && this.props.addedUsersCount > 0) ? (
            <AlertMessage
              autoHide
              alertType="success"
              message={(
                <h1
                  id="admin.shared.assignUsersPopup.alert.addedUsers"
                  values={{ usersCount: this.props.addedUsersCount }}
                />
              )}
            />
          ) : null}

          <UserFilters
            searchText={filters.searchText}
            handleInputChange={this.props.actions.setSearchText}
            handleEmbeddedValueChange={this.props.handleEmbeddedValueChange}
            embeddedFieldValue={embeddedFieldValue}
            handleEnterPress={this.handleEnterOnSearchBox}
            getFilteredUsers={this.getFilteredUsers}
            salesRoleSelectOptions={filters.salesRoles}
            selectedSalesRoles={filters.selectedSalesRoles}
            handleSalesRoleChange={this.handleSalesRoleChange}
            territorySelectOptions={filters.territories}
            selectedTerritories={filters.selectedTerritories}
            handleTerritoryChange={this.handleTerritoryChange}
            businessUnitSelectOptions={filters.businessUnits}
            selectedBusinessUnits={filters.selectedBusinessUnits}
            handleBusinessUnitChange={this.handleBusinessUnitChange}
            handleIsManagerChange={this.handleIsManagerChange}
            selectedIsManager={filters.selectedIsManager}
            isNoneOption={this.props.isNoneOptionWithFilters}
            handleOrganizationalGroupChange={this.handleOrganizationalGroupChange}
            organizationalGroupSelectOptions={filters.organizationalGroups}
            selectedOrganizationalGroups={filters.selectedOrganizationalGroups}
            handleUserGroupChange={this.handleUserGroupChange}
            userGroupSelectOptions={filters.userGroups}
            selectedUserGroups={filters.selectedUserGroups}
            objectType={objectType}
          />

          <UserTable
            onSelectAllUsersChange={this.handleSelectAllUsers}
            isAllUsersSelected={usersTable.isAllUsersSelected}
            selectedUserIds={usersTable.selectedUserIds}
            usersList={usersTable.usersList}
            handleUserSelectChange={this.handleSelectUserChange}
          />
        </Modal.Body>

        <Modal.Footer className={`d-flex justify-content-between ${isEmbeddedFieldModal() ? 'position-sticky bottom-0 bg-white' : ''}`}>
          { isEmbeddedFieldModal()
            ? (
              <div>
                <Button className="mr-3" color="primary" onClick={this.handleAddUsersClick}>
                  <h1 id="btn.save" />
                </Button>
                <Button color="secondary" onClick={handleClosePopup}>
                  <h1 id="btn.cancel" />
                </Button>
              </div>
            ) : null}
          <LoadMoreButton
            currentPage={usersTable.page}
            totalPages={usersTable.totalPages}
            handleLoadMoreClick={this.getFilteredUsers}
          />
        </Modal.Footer>
      </Modal>
    );
  }
}
// handleClosePopup


const mapStateToProps = (state) => (
  {
    addedUsersCount: state.admin.assignUsers.addedUsersCount,
    isAddingUsers: state.admin.assignUsers.isAddingUsers,
    filters: state.admin.assignUsers.filters,
    usersTable: state.admin.assignUsers.usersTable,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    actions: bindActionCreators({
      getUserFilters,
      setSearchText,
      setSelectedSalesRoles,
      setSelectedTerritories,
      setSelectedBusinessUnits,
      setIsManager,

      setIsAllUsersSelected,
      setSelectedUserIds,
      getNewUsersList,
      assignUsers,
      setUnSelectedUserIds,
      setUserList,
      setSelectedOrganizationalGroups,
      setSelectedUserGroups,
    }, dispatch),
  }
);

AssignUsersPopup.defaultProps = {
  isNoneOptionWithFilters: false,
};

AssignUsersPopup.propTypes = {
  // Inside Props
  isAddingUsers: PropTypes.bool.isRequired,
  embeddedFieldValue: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    searchText: PropTypes.string.isRequired,
    salesRoles: PropTypes.instanceOf(Array).isRequired,
    selectedSalesRoles: PropTypes.instanceOf(Array).isRequired,
    territories: PropTypes.instanceOf(Array).isRequired,
    selectedTerritories: PropTypes.instanceOf(Array).isRequired,
    businessUnits: PropTypes.instanceOf(Array).isRequired,
    selectedBusinessUnits: PropTypes.instanceOf(Array).isRequired,
    organizationalGroups: PropTypes.instanceOf(Array).isRequired,
    selectedOrganizationalGroups: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  usersTable: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    usersList: PropTypes.instanceOf(Array).isRequired,
    selectedUserIds: PropTypes.instanceOf(Array).isRequired,
    isAllUsersSelected: PropTypes.bool.isRequired,
    authenticityToken: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    // Filters Actions
    getUserFilters: PropTypes.func.isRequired,
    setSearchText: PropTypes.func.isRequired,
    setSelectedSalesRoles: PropTypes.func.isRequired,
    setSelectedTerritories: PropTypes.func.isRequired,
    setSelectedBusinessUnits: PropTypes.func.isRequired,
    setIsManager: PropTypes.func.isRequired,
    setSelectedOrganizationalGroups: PropTypes.func.isRequired,
    setSelectedUserGroups: PropTypes.func.isRequired,
    // User List Actions
    setIsAllUsersSelected: PropTypes.func.isRequired,
    setSelectedUserIds: PropTypes.func.isRequired,
    setUnSelectedUserIds: PropTypes.func.isRequired,
    getNewUsersList: PropTypes.func.isRequired,
    assignUsers: PropTypes.func.isRequired,
    setUserList: PropTypes.func.isRequired,
  }).isRequired,

  // Outside Props
  intl: intlShape.isRequired,
  isVisible: PropTypes.bool.isRequired,
  handleClosePopup: PropTypes.func.isRequired,
  popupTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object),
  ]),
  accountId: PropTypes.string.isRequired,
  objectId: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  getExistingUsers: PropTypes.func.isRequired,
  isNoneOptionWithFilters: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(useIntl(AssignUsersPopup));
