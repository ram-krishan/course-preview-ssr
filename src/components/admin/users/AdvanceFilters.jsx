import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import MultiSelectField from './MultiSelectField';
import TreeSelectField from './TreeSelectField';
import SpiSelect from '../../shared/select_boxes/SpiSelect';
import DateTimeRangePicker from '../../shared/DateTimeRangePicker';


const AdvanceFilters = ({
  permissionSelectOptions,
  selectedPermissions,
  handlePermissionChange,

  statusOptions,
  selectedStatus,
  handleStatusChange,

  salesRoleSelectOptions,
  selectedSalesRoles,
  handleSalesRoleChange,

  territorySelectOptions,
  selectedTerritories,
  handleTerritoryChange,

  languageOptions,
  selectedLanguages,
  handleLanguagesChange,

  managerSelectOptions,
  selectedManagers,
  handleMangersChange,

  confirmOptions,
  selectedConfirmation,
  handleConfirmChange,

  organizationalGroupsSelectOptions,
  selectedOrganizationalGroups,
  handleOrganizationalGroupsChange,

  userGroupsSelectOptions,
  selectedUserGroups,
  handleUserGroupsChange,

  toggleAdvanceSearchPopupVisibility,
  handleResetFilters,
  selectedDate,
}) => (
  <div className="advance-search-filter-popup">
    <div className="row">
      <div className="col-md-6 mb-4">
        <MultiSelectField
          placeholder={
            <h1 id="user.filter.label.salesRoles" />
          }
          selectBoxOptions={salesRoleSelectOptions}
          selectedValues={selectedSalesRoles}
          handleChange={handleSalesRoleChange}
          fieldName="sales_role_ids[]"
        />
      </div>
      <div className="col-md-6 mb-4">
        <MultiSelectField
          fieldName="permissions[]"
          placeholder={<h1 id="user.filter.label.permissions" />}
          selectBoxOptions={permissionSelectOptions}
          selectedValues={selectedPermissions}
          handleChange={handlePermissionChange}
        />
      </div>
      <div className="col-md-6 mb-4">
        <SpiSelect
          name="status[]"
          options={statusOptions}
          selectedValue={selectedStatus}
          handleChange={handleStatusChange}
          placeholder={<h1 id="user.profile.form.label.status" />}
          className="react-select-container modal-search-sm-margin"
        />
      </div>
      <div className="col-md-6 mb-4">
        <SpiSelect
          name="confirmed"
          options={confirmOptions}
          selectedValue={selectedConfirmation}
          handleChange={handleConfirmChange}
          placeholder={<h1 id="user.profile.form.label.confirmed" />}
          className="react-select-container modal-search-sm-margin"
        />
      </div>
      <div className="col-md-6 mb-4">
        <MultiSelectField
          placeholder={
            <h1 id="user.profile.form.label.manager" />
        }
          selectBoxOptions={managerSelectOptions}
          selectedValues={selectedManagers}
          handleChange={handleMangersChange}
          fieldName="manager_ids[]"
        />
      </div>
      <div className="col-md-6 mb-4">
        <MultiSelectField
          placeholder={
            <h1 id="user.profile.form.label.userGroup" />
        }
          selectBoxOptions={userGroupsSelectOptions}
          selectedValues={selectedUserGroups}
          handleChange={handleUserGroupsChange}
          fieldName="user_group_ids[]"
        />
      </div>

      <div className="col-md-6 mb-4">
        <MultiSelectField
          placeholder={
            <h1 id="user.profile.form.label.languagePreference" />
        }
          selectBoxOptions={languageOptions}
          selectedValues={selectedLanguages}
          handleChange={handleLanguagesChange}
          fieldName="languages[]"
        />
      </div>
      <div className="col-md-6 tree-select-style mb-4">
        <TreeSelectField
          placeholder={
            <h1 id="user.profile.form.label.organizationalGroup" />
          }
          treeData={organizationalGroupsSelectOptions}
          selectedValues={selectedOrganizationalGroups}
          handleChange={handleOrganizationalGroupsChange}
          fieldName="organizational_group_ids[]"
        />
      </div>
      <div className="col-md-6 tree-select-style mb-4">
        <TreeSelectField
          placeholder={
            <h1 id="user.profile.form.label.territory" />
        }
          treeData={territorySelectOptions}
          selectedValues={selectedTerritories}
          handleChange={handleTerritoryChange}
          fieldName="territory_ids[]"
        />
      </div>
      <div className="col-md-6 mb-4">
        <DateTimeRangePicker
          name="Launch Date Range"
          selectedDate={selectedDate}
        />
      </div>
    </div>

    <div className="row my-4">
      <div className="col-md-12 text-right">
        <Button variant="secondary" className="search-btn" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </Button>

        <Button variant="link" type="submit" onClick={handleResetFilters}>
          Reset filters
        </Button>

      </div>
    </div>
    <Button
      className="disable-inside-popup"
      onClick={toggleAdvanceSearchPopupVisibility}
    >
      <FontAwesomeIcon icon={faTimes} />
    </Button>
  </div>
);


AdvanceFilters.propTypes = {
  permissionSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedPermissions: PropTypes.instanceOf(Array).isRequired,
  handlePermissionChange: PropTypes.func.isRequired,

  statusOptions: PropTypes.instanceOf(Array).isRequired,
  selectedStatus: PropTypes.instanceOf(Array).isRequired,
  handleStatusChange: PropTypes.func.isRequired,

  salesRoleSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedSalesRoles: PropTypes.instanceOf(Array).isRequired,
  handleSalesRoleChange: PropTypes.func.isRequired,

  territorySelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedTerritories: PropTypes.instanceOf(Array).isRequired,
  handleTerritoryChange: PropTypes.func.isRequired,

  toggleAdvanceSearchPopupVisibility: PropTypes.func.isRequired,

  languageOptions: PropTypes.instanceOf(Array).isRequired,
  selectedLanguages: PropTypes.instanceOf(Array).isRequired,
  handleLanguagesChange: PropTypes.func.isRequired,

  managerSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedManagers: PropTypes.instanceOf(Array).isRequired,
  handleMangersChange: PropTypes.func.isRequired,

  confirmOptions: PropTypes.instanceOf(Array).isRequired,
  handleConfirmChange: PropTypes.func.isRequired,

  organizationalGroupsSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedOrganizationalGroups: PropTypes.instanceOf(Array).isRequired,
  handleOrganizationalGroupsChange: PropTypes.func.isRequired,

  handleResetFilters: PropTypes.func.isRequired,

  // userGroupsSelectOptions: PropTypes.instanceOf(Array).isRequired,
  // selectedUserGroups: PropTypes.instanceOf(Array).isRequired,
  // handleUserGroupsChange: PropTypes.func.isRequired,
};

export default AdvanceFilters;
