import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, intlShape } from 'react-intl';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBoxField = ({
  intl,
  searchText,
  handleInputChange,
  handleEnterPress,
  getFilteredUsers,
}) => (
  <div
    method="get"
    className="nav-search-bar navbar-form navbar-left form-inline navbar-xs-align"
  >
    <div className="form-group modal-search-align">
      <input
        type="text"
        placeholder={
          intl.formatMessage({ id: 'admin.shared.assignUsersPopup.filters.searchFor' })
        }
        className="form-control input-search"
        value={searchText}
        name="search_text"
        onChange={event => handleInputChange(event.target.value)}
        onKeyPress={handleEnterPress}
      />

      <Button className="search-btn" onClick={getFilteredUsers}>
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </div>
  </div>
);

SearchBoxField.propTypes = {
  intl: intlShape.isRequired,
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  getFilteredUsers: PropTypes.func.isRequired,
};

export default useIntl(SearchBoxField);
