import React from 'react';
import PropTypes from 'prop-types';

import {Row, Col} from 'react-bootstrap';
import SpiSelect from '../../../../shared/select_boxes/SpiSelect';

import MultiSelectField from './MultiSelectField';
import TreeSelectField from './TreeSelectField';

const AllFilters = ({
  salesRoleSelectOptions,
  selectedSalesRoles,
  handleSalesRoleChange,

  territorySelectOptions,
  selectedTerritories,
  handleTerritoryChange,

  businessUnitSelectOptions,
  selectedBusinessUnits,
  handleBusinessUnitChange,

  handleUserGroupChange,
  userGroupSelectOptions,
  selectedUserGroups,

  handleOrganizationalGroupChange,
  selectedOrganizationalGroups,
  organizationalGroupSelectOptions,
  isNoneOption,

  handleIsManagerChange,
  selectedIsManager,
}) => (
  <div>
    <Row className="navbar-form">
      <Col xl={3}>
        <TreeSelectField
          placeholder={<h1 id="admin.shared.assignUsersPopup.filters.selectOrganizationalGroups" />}
          treeData={organizationalGroupSelectOptions}
          isNoneOption={isNoneOption}
          selectedValues={selectedOrganizationalGroups}
          handleChange={handleOrganizationalGroupChange}
        />
      </Col>
      <Col xl={3}>
        <TreeSelectField
          placeholder={<h1 id="admin.shared.assignUsersPopup.filters.selectTerritories" />}
          treeData={territorySelectOptions}
          isNoneOption={isNoneOption}
          selectedValues={selectedTerritories}
          handleChange={handleTerritoryChange}
        />
      </Col>
      <Col xl={3}>
        <SpiSelect
          placeholder={<div>Manager?</div>}
          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
          handleChange={handleIsManagerChange}
          selectedValue={selectedIsManager !== null ? selectedIsManager.value : ''}
          isClearable
        />
      </Col>
      <Col xl={3}>
        <MultiSelectField
          placeholder={<h1 id="admin.shared.assignUsersPopup.filters.selectUserGroups" />}
          isNoneOption={isNoneOption}
          selectBoxOptions={userGroupSelectOptions}
          selectedValues={selectedUserGroups}
          handleChange={handleUserGroupChange}
          fieldName="userGroups[]"
        />
      </Col>
    </Row>
    <Row className="mt-3" />
  </div>
);

AllFilters.defaultProps = {
  isNoneOption: false,
};

AllFilters.propTypes = {
  salesRoleSelectOptions: PropTypes.instanceOf(Array).isRequired,
  isNoneOption: PropTypes.bool,
  selectedSalesRoles: PropTypes.instanceOf(Array).isRequired,
  handleSalesRoleChange: PropTypes.func.isRequired,

  territorySelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedTerritories: PropTypes.instanceOf(Array).isRequired,
  handleTerritoryChange: PropTypes.func.isRequired,

  businessUnitSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedBusinessUnits: PropTypes.instanceOf(Array).isRequired,
  handleBusinessUnitChange: PropTypes.func.isRequired,

  handleOrganizationalGroupChange: PropTypes.func.isRequired,
  selectedOrganizationalGroups: PropTypes.instanceOf(Array).isRequired,
  organizationalGroupSelectOptions: PropTypes.instanceOf(Array).isRequired,

  handleIsManagerChange: PropTypes.func.isRequired,
  selectedIsManager: PropTypes.oneOfType([
    PropTypes.instanceOf(Object),
    null,
  ]).isRequired,
};

export default AllFilters;
