import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import SpiSelect from '../../shared/select_boxes/SpiSelect';

const MultiSelectField = ({
  placeholder,
  handleChange,
  selectBoxOptions,
  selectedValues,
  fieldName,
}) => (
  <SpiSelect
    isMulti
    name={isEmpty(selectedValues) ? '' : fieldName}
    options={selectBoxOptions}
    selectedValue={selectedValues}
    handleChange={handleChange}
    placeholder={placeholder}
    className="react-select-container modal-search-sm-margin"
  />
);

MultiSelectField.propTypes = {
  placeholder: PropTypes.instanceOf(Object).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectBoxOptions: PropTypes.instanceOf(Array).isRequired,
  selectedValues: PropTypes.instanceOf(Array).isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default MultiSelectField;
