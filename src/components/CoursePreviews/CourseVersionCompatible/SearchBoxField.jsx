import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { injectIntl, intlShape } from 'react-intl';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './course-version-compatible-style.scss';

const SearchBoxField = ({
  intl,
  searchText,
  handleInputChange,
  handleSubmitSearchText,
  handleClearSearchText,
}) => {

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmitSearchText();
    }
  };

  return(
    <div className='input-group'>
      <input
        type='text'
        placeholder={intl.formatMessage({ id: 'admin.dashboard.searchField.placeholder' })}
        className='form-control w-75'
        value={searchText}
        onChange={event => handleInputChange(event.target.value)}
        onKeyPress={handleEnterPress}
      />
      {searchText && (
        <button
          className='ml-1 form-control search-cross-button'
          onClick={handleClearSearchText}
        >
            <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      <button
        className='ml-1 form-control'
        onClick={handleSubmitSearchText}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

SearchBoxField.propTypes = {
  intl: intlShape.isRequired,
  searchText: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmitSearchText: PropTypes.func.isRequired,
  handleClearSearchText: PropTypes.func.isRequired,
};

export default injectIntl(SearchBoxField);
