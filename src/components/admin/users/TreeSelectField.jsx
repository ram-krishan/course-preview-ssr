import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import TreeSelect from 'rc-tree-select';

const TreeSelectField = ({
  placeholder,
  handleChange,
  treeData,
  selectedValues,
  fieldName,
}) => (
  <div>
    <TreeSelect
      multiple
      allowClear
      treeNodeFilterProp="title"
      transitionName="rc-tree-select-dropdown-slide-up"
      dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
      choiceTransitionName="rc-tree-select-selection__choice-zoom"
      placeholder={placeholder}
      treeData={treeData}
      value={selectedValues}
      onChange={handleChange}
      className="modal-search-sm-margin"
      name={fieldName}
    />
    {_.map(selectedValues, (value, index) => (
      <input type="hidden" key={index} name={fieldName} value={value}/>
    ))}
  </div>
);

TreeSelectField.propTypes = {
  placeholder: PropTypes.instanceOf(Object).isRequired,
  handleChange: PropTypes.func.isRequired,
  treeData: PropTypes.instanceOf(Array).isRequired,
  selectedValues: PropTypes.instanceOf(Array).isRequired,
  fieldName: PropTypes.string.isRequired,
};

export default TreeSelectField;
