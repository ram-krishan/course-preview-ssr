import React from 'react';
import PropTypes from 'prop-types';
import TreeSelect from 'rc-tree-select';


const customizedTreeData = (treeData, isNoneOption) => {
  if(isNoneOption) {
    treeData.unshift({
      value: "null",
      label: <h1 id="shared.selectBoxes.options.none" />,
    });
  }
  return treeData;
}

const TreeSelectField = ({
  placeholder,
  handleChange,
  treeData,
  isNoneOption,
  selectedValues,
}) => (
  <TreeSelect
    multiple
    allowClear
    treeNodeFilterProp="title"
    transitionName="rc-tree-select-dropdown-slide-up"
    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
    choiceTransitionName="rc-tree-select-selection__choice-zoom"
    placeholder={placeholder}
    treeData={customizedTreeData(treeData, isNoneOption)}
    value={selectedValues}
    onChange={handleChange}
    className="modal-search-sm-margin"
  />
);

TreeSelectField.defaultProps = {
  isNoneOption: false,
};

TreeSelectField.propTypes = {
  placeholder: PropTypes.instanceOf(Object).isRequired,
  handleChange: PropTypes.func.isRequired,
  treeData: PropTypes.instanceOf(Array).isRequired,
  isNoneOption: PropTypes.bool,
  selectedValues: PropTypes.instanceOf(Array).isRequired,
};

export default TreeSelectField;
