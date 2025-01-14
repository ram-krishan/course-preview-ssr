import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

import SearchBoxField from './SearchBoxField';
const AccountFilters = ({
  searchText,
  handleInputChange,
  handleEnterPress,
  getFilteredAccounts,
}) => (
  <Card className="bg-faded card-block">
    <Card.Body>
      <div className="row">
        <div className="col-xl-3">
          <SearchBoxField
            searchText={searchText}
            handleInputChange={handleInputChange}
            handleEnterPress={handleEnterPress}
            getFilteredAccounts={getFilteredAccounts}
          />
        </div>
      </div>
    </Card.Body>
  </Card>
);

AccountFilters.propTypes = {
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  getFilteredAccounts: PropTypes.func.isRequired,
};

export default AccountFilters;
