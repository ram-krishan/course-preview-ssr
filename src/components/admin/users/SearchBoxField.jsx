import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, intlShape } from 'react-intl';
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBoxField = ({
  intl,
  searchText,
  handleInputChange,
  handleAdvanceSearchPanel,
}) => (

  <InputGroup>
    <Form.Control
      type="text"
      placeholder={
        intl.formatMessage({ id: 'admin.shared.assignUsersPopup.filters.searchFor' })
      }
      className="form-control input-search"
      value={searchText}
      name="search_text"
      onChange={event => handleInputChange(event.target.value)}
    />
    <Button className="btn btn-default" type="button" onClick={handleAdvanceSearchPanel}>
        <FontAwesomeIcon icon={faCaretDown} />
      </Button>
      <Button className="search-btn" type="submit">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
);

SearchBoxField.propTypes = {
  intl: intlShape.isRequired,
  // searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAdvanceSearchPanel: PropTypes.func.isRequired,
};

export default useIntl(SearchBoxField);
