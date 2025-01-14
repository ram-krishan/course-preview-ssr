import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form } from 'react-bootstrap';
import 'url-polyfill';
import AdvanceFilters from './AdvanceFilters';
import SearchBoxField from './SearchBoxField';
import {
  inverseKeyMapping,
  remapSelectOptionsKeys,
} from '../../shared/select_boxes/utils';

import {
  // Filters Operations
  getUserFilters,
  getAvailableLanguages,
} from '../../../actions/admin/users/operations';

class AdvanceSearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      AdvanceSearchPopupVisibility: false,
      selectedSalesRoles: [],
      selectedTerritories: [],
      selectedLanguages: [],
      selectedManagers: [],
      selectedConfirmation: [],
      availableConfirmation: [
        { id: 'yes', name: 'Yes' },
        { id: 'no', name: 'No' },
      ],
      selectedStatus: [],
      availableStatus: [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
      ],
      selectedPermissions: [],
      selectedDate: '',
    };
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.toggleAdvanceSearchPopupVisibility = this.toggleAdvanceSearchPopupVisibility.bind(
      this,
    );
    this.handleSalesRoleChange = this.handleSalesRoleChange.bind(this);
    this.handleTerritoryChange = this.handleTerritoryChange.bind(this);
    this.handleLanguagesChange = this.handleLanguagesChange.bind(this);
    this.handleMangersChange = this.handleMangersChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleOrganizationalGroupsChange = this.handleOrganizationalGroupsChange.bind(this);
    this.handleUserGroupsChange = this.handleUserGroupsChange.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.handlePermissionChange = this.handlePermissionChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    const url = new URL(document.location.href);
    const permissions = url.searchParams.getAll('permissions[]');
    const salesRoleIds = url.searchParams.getAll('sales_role_ids[]');
    const searchText = url.searchParams.get('search_text');
    const territoryIds = url.searchParams.getAll('territory_ids[]');
    const languages = url.searchParams.getAll('languages[]');
    const managerIds = url.searchParams.getAll('manager_ids[]');
    const organizationalGroupsIds = url.searchParams.getAll('organizational_group_ids[]');
    const userGroupsIds = url.searchParams.getAll('user_group_ids[]');
    const confirmed = url.searchParams.get('confirmed');
    const status = url.searchParams.get('status[]');
    const selectedDate = url.searchParams.get('launch_date_range');
    const accountId = document.getElementById('users_advance_search').dataset
      .account_id;
    const {
      actions: {
        getUserFilters: getUserFiltersAction,
        getAvailableLanguages: getAvailableLanguagesAction,
      },
    } = this.props;
    
    this.setState({
      searchText,
      selectedPermissions: permissions,
      selectedSalesRoles: salesRoleIds,
      selectedTerritories: territoryIds,
      selectedLanguages: languages,
      selectedManagers: managerIds,
      selectedConfirmation: confirmed,
      selectedStatus: status,
      selectedOrganizationalGroups: organizationalGroupsIds,
      selectedUserGroups: userGroupsIds,
      selectedDate: selectedDate,
    });
    getUserFiltersAction(accountId);
    getAvailableLanguagesAction();
  }

  toggleAdvanceSearchPopupVisibility() {
    this.setState({
      AdvanceSearchPopupVisibility: !this.state.AdvanceSearchPopupVisibility,
    });
  }

  handleSearchTextChange(text) {
    this.setState({ searchText: text });
  }

  remapSelectOptions(options, key) {
    const selectOption = remapSelectOptionsKeys(
      options,
      inverseKeyMapping,
    );
    this.setState({ [key]: selectOption });
  }

  handlePermissionChange(selectedPermissionOptions) {
    this.remapSelectOptions(selectedPermissionOptions, 'selectedPermissions');
  }

  handleSalesRoleChange(selectedSalesRoleOptions) {
    this.remapSelectOptions(selectedSalesRoleOptions, 'selectedSalesRoles');
  }

  handleTerritoryChange(territories) {
    this.setState({ selectedTerritories: territories });
  }

  handleLanguagesChange(selectedLanguageOptions) {
    this.remapSelectOptions(selectedLanguageOptions, 'selectedLanguages');
  }

  handleMangersChange(selectedManagerOptions) {
    this.remapSelectOptions(selectedManagerOptions, 'selectedManagers');
  }

  handleConfirmChange(selectedConfirmOptions) {
    this.setState({ selectedConfirmation: selectedConfirmOptions['value'] });
  }

  handleStatusChange(selectedStatusOption) {
    this.setState({ selectedStatus: selectedStatusOption['value'] });
  }

  handleOrganizationalGroupsChange(organizationalGroups) {
    this.setState({ selectedOrganizationalGroups: organizationalGroups });
  }

  handleUserGroupsChange(selectedUserGroupsOptions) {
    this.remapSelectOptions(selectedUserGroupsOptions, 'selectedUserGroups');
  }

  handleResetFilters() {
    this.setState({
      selectedPermissions: [],
      selectedSalesRoles: [],
      selectedTerritories: [],
      selectedLanguages: [],
      selectedManagers: [],
      selectedConfirmation: [],
      selectedOrganizationalGroups: [],
      selectedUserGroups: [],
      selectedStatus: [],
      selectedDate: '',
    });
  }

  render() {
    const { filters } = this.props;

    const {
      searchText,
      AdvanceSearchPopupVisibility,
      selectedPermissions,
      selectedSalesRoles,
      selectedTerritories,
      selectedLanguages,
      selectedManagers,
      selectedConfirmation,
      availableConfirmation,
      selectedOrganizationalGroups,
      selectedUserGroups,
      selectedStatus,
      availableStatus,
      selectedDate,
    } = this.state;
    return (
      <Form
        method="get"
        className="navbar-form navbar-left"
        role="search"
        id="userAdvanceSearchForm"
      >
        <Form.Group className="position-relative mb-0">
          <SearchBoxField
            searchText={searchText}
            handleInputChange={this.handleSearchTextChange}
            handleAdvanceSearchPanel={this.toggleAdvanceSearchPopupVisibility}
          />

          {AdvanceSearchPopupVisibility ? (
            <AdvanceFilters
              permissionSelectOptions={filters.userPermissions}
              selectedPermissions={selectedPermissions}
              handlePermissionChange={this.handlePermissionChange}

              statusOptions={availableStatus}
              selectedStatus={selectedStatus}
              handleStatusChange={this.handleStatusChange}

              salesRoleSelectOptions={filters.salesRoles}
              selectedSalesRoles={selectedSalesRoles}
              handleSalesRoleChange={this.handleSalesRoleChange}
              territorySelectOptions={filters.territories}
              selectedTerritories={selectedTerritories}
              handleTerritoryChange={this.handleTerritoryChange}
              languageOptions={filters.availableLanguageOptions}
              selectedLanguages={selectedLanguages}
              handleLanguagesChange={this.handleLanguagesChange}
              managerSelectOptions={filters.managers}
              selectedManagers={selectedManagers}
              handleMangersChange={this.handleMangersChange}
              confirmOptions={availableConfirmation}
              selectedConfirmation={selectedConfirmation}
              handleConfirmChange={this.handleConfirmChange}
              organizationalGroupsSelectOptions={filters.organizationalGroups}
              selectedOrganizationalGroups={selectedOrganizationalGroups}
              handleOrganizationalGroupsChange={this.handleOrganizationalGroupsChange}
              userGroupsSelectOptions={filters.userGroups}
              selectedUserGroups={selectedUserGroups}
              handleUserGroupsChange={this.handleUserGroupsChange}
              toggleAdvanceSearchPopupVisibility={
                this.toggleAdvanceSearchPopupVisibility
              }
              handleResetFilters={this.handleResetFilters}
              selectedDate={selectedDate}
            />
          ) : null}
          {AdvanceSearchPopupVisibility ? (
            <button
              type="button"
              className="disable-popup"
              onClick={this.toggleAdvanceSearchPopupVisibility}
            >
              disable-popup
            </button>
          ) : null}
        </Form.Group>
      </Form>
    );
  }
}

AdvanceSearchPanel.propTypes = {
  filters: PropTypes.instanceOf(Object).isRequired,
  actions: PropTypes.shape({
    getUserFilters: PropTypes.func.isRequired,
    getAvailableLanguages: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = (state) => ({
  filters: state.admin.users.filters,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getUserFilters,
      getAvailableLanguages,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdvanceSearchPanel);
