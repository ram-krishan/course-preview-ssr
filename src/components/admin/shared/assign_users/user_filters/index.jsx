import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import SearchBoxField from './SearchBoxField';
import AllFilters from './AllFilters';

const UserFilters = ({
  searchText,
  handleInputChange,
  handleEnterPress,
  getFilteredUsers,
  salesRoleSelectOptions,
  isNoneOption,
  selectedSalesRoles,
  handleSalesRoleChange,
  territorySelectOptions,
  selectedTerritories,
  handleTerritoryChange,
  businessUnitSelectOptions,
  selectedBusinessUnits,
  handleBusinessUnitChange,
  handleIsManagerChange,
  selectedIsManager,
  handleOrganizationalGroupChange,
  selectedOrganizationalGroups,
  organizationalGroupSelectOptions,
  handleUserGroupChange,
  userGroupSelectOptions,
  selectedUserGroups,
  objectType,
  handleEmbeddedValueChange,
  embeddedFieldValue,
}) => (
  <Card className="bg-faded card-block">
    <Card.Body>
      <div className="row">
        <div className="col-xl-3">
          <SearchBoxField
            searchText={searchText}
            handleInputChange={handleInputChange}
            handleEnterPress={handleEnterPress}
            getFilteredUsers={getFilteredUsers}
          />
        </div>

        <div className="col-xl-9">
          {
            objectType === 'Vib::EmbeddedField'
              ? (
                <div className="value-input-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Value"
                    value={embeddedFieldValue}
                    onChange={(event) => handleEmbeddedValueChange(event.target.value)}
                  />
                </div>
              ) : (
                <AllFilters
                  salesRoleSelectOptions={salesRoleSelectOptions}
                  isNoneOption={isNoneOption}
                  selectedSalesRoles={selectedSalesRoles}
                  handleSalesRoleChange={handleSalesRoleChange}

                  territorySelectOptions={territorySelectOptions}
                  selectedTerritories={selectedTerritories}
                  handleTerritoryChange={handleTerritoryChange}

                  businessUnitSelectOptions={businessUnitSelectOptions}
                  selectedBusinessUnits={selectedBusinessUnits}
                  handleBusinessUnitChange={handleBusinessUnitChange}

                  handleOrganizationalGroupChange={handleOrganizationalGroupChange}
                  selectedOrganizationalGroups={selectedOrganizationalGroups}
                  organizationalGroupSelectOptions={organizationalGroupSelectOptions}

                  handleUserGroupChange={handleUserGroupChange}
                  userGroupSelectOptions={userGroupSelectOptions}
                  selectedUserGroups={selectedUserGroups}

                  handleIsManagerChange={handleIsManagerChange}
                  selectedIsManager={selectedIsManager}
                />
              )
            }
        </div>
      </div>
    </Card.Body>
  </Card>
);

UserFilters.defaultProps = {
  isNoneOption: false,
};

UserFilters.propTypes = {
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  getFilteredUsers: PropTypes.func.isRequired,

  salesRoleSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedSalesRoles: PropTypes.instanceOf(Array).isRequired,
  handleSalesRoleChange: PropTypes.func.isRequired,

  territorySelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedTerritories: PropTypes.instanceOf(Array).isRequired,
  handleTerritoryChange: PropTypes.func.isRequired,

  businessUnitSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedBusinessUnits: PropTypes.instanceOf(Array).isRequired,
  handleBusinessUnitChange: PropTypes.func.isRequired,

  userGroupSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedUserGroups: PropTypes.instanceOf(Array).isRequired,
  handleUserGroupChange: PropTypes.func.isRequired,

  organizationalGroupSelectOptions: PropTypes.instanceOf(Array).isRequired,
  selectedOrganizationalGroups: PropTypes.instanceOf(Array).isRequired,
  handleOrganizationalGroupChange: PropTypes.func.isRequired,

  isNoneOption: PropTypes.bool,

  handleIsManagerChange: PropTypes.func.isRequired,
  selectedIsManager: PropTypes.oneOfType([
    PropTypes.instanceOf(Object),
    null,
  ]).isRequired,

  objectType: PropTypes.string.isRequired,
  handleEmbeddedValueChange: PropTypes.func.isRequired,
  embeddedFieldValue: PropTypes.string.isRequired,
};

export default UserFilters;
