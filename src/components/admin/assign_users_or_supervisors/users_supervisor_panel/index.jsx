import React from 'react';
import { keys, values, isEmpty, without, camelCase } from 'lodash';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import UsersList from '../../shared/assign_users/UsersList';
import ActionHeader from '../../shared/assign_users/ActionHeader';
import AssignUsersPopup from '../../shared/assign_users/AssignUsersPopup';
import RemoveAllWarningPopup from '../../shared/assign_users/RemoveAllWarningPopup';
import {
  updateUserRemoved,
  updateSelectedUserIds,
  getExistingUsers,
  removeUsers,
} from '../../../../actions/admin/assign_users_or_supervisors/operations/UserSupervisorOperations';

import { updateResponseMessages } from '../../../../actions/admin/assign_users_or_supervisors/action_creators/UserSupervisorActionCreators';
import {
  setAddedUserCount,
  setIsAllUsersSelected,
  setSearchText,
  setSelectedTerritories,
  setIsManager,
  setSelectedUserGroups,
  setSelectedOrganizationalGroups,
} from '../../../../actions/admin/assign_users/operations/AssignUsersOperations';

const FlashMessage = ({ handleCloseMessage, objectType }) => (
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
      id={`admin.${objectType}.userTable.removedMessage`}
    />
  </div>
);

FlashMessage.propTypes = {
  handleCloseMessage: PropTypes.func.isRequired,
};

const getSortedKey = key =>
  ({
    fullName: 'name',
    confirmedStatus: 'confirmed_status',
    salesRoleNames: 'sales_role',
    territoryName: 'territory',
    businessUnitName: 'business_unit',
    isManager: 'manager_availability',
  }[key]);

const getObjectDataSet = (type) => {
  let element;
  if(type == "user"){
    element = document.getElementById('add_users_to_object');
  }else if(type == "supervisor"){
    element = document.getElementById('add_supervisors_to_object');
  }
  return {
    accountId: element.dataset.account_id,
    objectId: element.dataset.object_id,
    objectType: element.dataset.object_type,
    userType: element.dataset.user_type,
  };
};

class UsersPanel extends React.Component {
  constructor(props) {
    
    super(props);
    this.onSort = this.onSort.bind(this);
    this.getUsersList = this.getUsersList.bind(this);
    this.removeSelectedUsers = this.removeSelectedUsers.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.handleRemoveUserCheckBoxChange = this.handleRemoveUserCheckBoxChange.bind(
      this
    );
    this.toggleRemoveAllWarningPopup = this.toggleRemoveAllWarningPopup.bind(
      this
    );
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleEmbeddedValueChange = this.handleEmbeddedValueChange.bind(this);
    this.getFilteredResults = this.getFilteredResults.bind(this);
    this.toggleAssignUsersPopupVisibility = this.toggleAssignUsersPopupVisibility.bind(
      this
    );

    this.state = {
      currentPage: 0,
      sort: 'name',
      direction: 'asc',
      searchText: '',
      embeddedFieldValue: '',
      showRemoveAllWarning: false,
      assignUsersPopupVisibility: false,
      importUsersPopup: false,
      importFileErrors: '',
      importUserFile: {},
      type: this.props.type
    };
  }
  // show, handleDismiss

  componentDidMount() {
    this.getUsersList();
  }

  onSort(data) {
    const sortedKey = getSortedKey(keys(data)[0]);
    const sortedDirection = values(data)[0];
    this.setState(
      { sort: sortedKey, direction: sortedDirection },
      this.getUsersList
    );
  }

  getUsersList() {
    const { actions, type } = this.props;
    const {
      accountId, objectId, objectType, userType,
    } = getObjectDataSet(type);

    const {
      sort, direction, searchText, currentPage,
    } = this.state;

    actions.getExistingUsers({
      accountId,
      objectType,
      userType,
      objectId,
      page: currentPage + 1,
      sort,
      direction,
      searchText,
    });
  }

  getFilteredResults() {
    this.setState({ currentPage: 0 }, this.getUsersList);
  }

  handlePageChange(event) {
    this.setState({ currentPage: event.selected }, this.getUsersList);
  }

  handleSearchInputChange(searchText) {
    this.setState({ searchText });
  }

  handleEmbeddedValueChange(embeddedFieldValue) {
    this.setState({ embeddedFieldValue });
  }

  handleEnterPress(event) {
    if (event.key === 'Enter') {
      this.getFilteredResults();
    }
  }

  handleRemoveUserCheckBoxChange(event, userId) {
    const { selectedUserIds, actions } = this.props;
    const ids = event.target.checked
      ? selectedUserIds.concat(userId)
      : without(selectedUserIds, userId);
    actions.updateSelectedUserIds(ids);
  }

  toggleRemoveAllWarningPopup() {
    const { showRemoveAllWarning } = this.state;
    this.setState({ showRemoveAllWarning: !showRemoveAllWarning });
  }

  toggleAssignUsersPopupVisibility() {
    const { actions } = this.props;
    const { assignUsersPopupVisibility } = this.state;
    actions.setAddedUserCount(0);
    actions.setIsAllUsersSelected(false);
    actions.setSearchText('')
    actions.setSelectedOrganizationalGroups([])
    actions.setSelectedTerritories([])
    actions.setIsManager('')
    actions.setSelectedUserGroups('')
    this.setState({ embeddedFieldValue: '', assignUsersPopupVisibility: !assignUsersPopupVisibility });
  }

  removeSelectedUsers(removeAllUsers = false) {
    const { actions, type, selectedUserIds } = this.props;
    const {
      currentPage, sort, direction, searchText,
    } = this.state;
    const {
      accountId, objectId, objectType, userType,
    } = getObjectDataSet(type);
    const UserIds = removeAllUsers ? [] : selectedUserIds;
    actions.removeUsers(
      accountId,
      objectType,
      userType,
      objectId,
      UserIds,
      currentPage,
      sort,
      direction,
      searchText,
    );
    if (removeAllUsers) {
      this.toggleRemoveAllWarningPopup();
    }
  }

  render() {
    const {
      usersList, totalPages, selectedUserIds, userRemoved, actions, type,
    } = this.props;

    const {
      searchText, showRemoveAllWarning, assignUsersPopupVisibility, embeddedFieldValue,
    } = this.state;

    const {
      accountId, objectId, objectType, userType,
    } = getObjectDataSet(type);
    return (
      <Card>
        {userRemoved ? (
          <FlashMessage
            handleCloseMessage={actions.updateUserRemoved}
            objectType={objectType}
          />
        ) : null}

        <Card.Header>
          <Row>
            <Col lg={8}>
              <h4>{type === "user" ? "User" : "Supervisor"}</h4>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <ActionHeader
            searchText={searchText}
            handleInputChange={this.handleSearchInputChange}
            handleEnterPress={this.handleEnterPress}
            getFilteredResults={this.getFilteredResults}
            disableRemoveUsersBtn={isEmpty(selectedUserIds)}
            disableRemoveAllBtn={isEmpty(usersList)}
            removeSelectedUsers={this.removeSelectedUsers}
            totalPages={totalPages}
            handlePageClick={this.handlePageChange}
            toggleWarningModal={this.toggleRemoveAllWarningPopup}
            handleAddUsersClick={this.toggleAssignUsersPopupVisibility}
            objectType={objectType}
          />

          {assignUsersPopupVisibility ? (
            <AssignUsersPopup
              isVisible={assignUsersPopupVisibility}
              handleClosePopup={this.toggleAssignUsersPopupVisibility}
              accountId={accountId}
              objectId={objectId}
              objectType={objectType}
              userType={userType}
              getExistingUsers={
                this.props.actions.getExistingUsers
              }
              isNoneOptionWithFilters
              handleEmbeddedValueChange={this.handleEmbeddedValueChange}
              embeddedFieldValue={embeddedFieldValue}
            />
          ) : null}

          {isEmpty(usersList) ? (
            <div className="mt-4 text-center">
              <FormattedMessage id="admin.userCollections.userTable.noData" />
            </div>
          ) : (
            <div>
              <UsersList
                users={usersList}
                accountId={accountId}
                onSort={this.onSort}
                handleRemoveUserChange={this.handleRemoveUserCheckBoxChange}
                selectedUserIds={selectedUserIds}
                objectType={objectType}
              />

              <RemoveAllWarningPopup
                showModal={showRemoveAllWarning}
                toggleModal={this.toggleRemoveAllWarningPopup}
                removeSelectedUsers={this.removeSelectedUsers}
                userGroupType={objectType}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  usersList: state.admin.assignUsersOrSupervisorsReducer.users,
  supervisorList: state.admin.assignUsersOrSupervisorsReducer.supervisors,
  totalPages: state.admin.assignUsersOrSupervisorsReducer.totalPages,
  selectedUserIds: state.admin.assignUsersOrSupervisorsReducer.selectedUserIds,
  userRemoved: state.admin.assignUsersOrSupervisorsReducer.userRemoved,
  responseMessages: state.admin.assignUsersOrSupervisorsReducer.responseMessages,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getExistingUsers,
      removeUsers,
      updateUserRemoved,
      updateSelectedUserIds,
      updateResponseMessages,
      setAddedUserCount,
      setIsAllUsersSelected,
      setSearchText,
      setSelectedTerritories,
      setIsManager,
      setSelectedUserGroups,
      setSelectedOrganizationalGroups,
    },
    dispatch
  ),
});

UsersPanel.defaultProps = {
  responseMessages: {
    success: false,
    message: [],
  },
};

UsersPanel.propTypes = {
  usersList: PropTypes.instanceOf(Array).isRequired,
  totalPages: PropTypes.number.isRequired,
  userRemoved: PropTypes.bool.isRequired,
  selectedUserIds: PropTypes.instanceOf(Array).isRequired,
  responseMessages: PropTypes.instanceOf(Object),
  actions: PropTypes.shape({
    getExistingUsers: PropTypes.func.isRequired,
    removeUsers: PropTypes.func.isRequired,
    updateUserRemoved: PropTypes.func.isRequired,
    updateSelectedUserIds: PropTypes.func.isRequired,
    updateResponseMessages: PropTypes.func.isRequired,
    setAddedUserCount: PropTypes.func.isRequired,
    setIsAllUsersSelected: PropTypes.func.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersPanel);
