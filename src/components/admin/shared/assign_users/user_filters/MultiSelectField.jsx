import React from 'react';
import PropTypes from 'prop-types';
import SpiSelect from '../../../../shared/select_boxes/SpiSelect';

const MultiSelectField = ({
  placeholder,
  handleChange,
  selectBoxOptions,
  isNoneOption,
  selectedValues,
}) => (
  <SpiSelect
    isMulti
    options={selectBoxOptions}
    isNoneOption={isNoneOption}
    selectedValue={selectedValues}
    handleChange={handleChange}
    placeholder={placeholder}
    className="react-select-container modal-search-sm-margin"
  />
);

MultiSelectField.defaultProps = {
  isNoneOption: false,
};

MultiSelectField.propTypes = {
  placeholder: PropTypes.instanceOf(Object).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectBoxOptions: PropTypes.instanceOf(Array).isRequired,
  isNoneOption: PropTypes.bool,
  selectedValues: PropTypes.instanceOf(Array).isRequired,
};

export default MultiSelectField;
