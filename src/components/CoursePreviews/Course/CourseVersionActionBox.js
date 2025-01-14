import React from 'react';
import { isEmpty, some } from 'lodash';

import { useApolloClient } from '@apollo/react-hooks';

import validateLevelCourse from './validator';
import VibButton from '../../shared/vib_button';

const CourseVersionActionBox = ({
  treeBaseData,
  treeData,
  selectedCourse,
  validatorLoading,
  courseValidateObject,
  isComparingCourseVersion,
  compareCourseVesrionPopupVisibility,
  handleExpand,
  handleCollapseAll,
  handleCompare,
  setValidatorLoading,
  setCourseValidateObject,
  getUpdatedTreeData,
  setTreeData,
}) => {
  const client = useApolloClient();
  const canShowCompareBtn = document.body.dataset.canShowCompare === 'true';
  const getBadgeForCourseLabel = () => {
    if (isEmpty(courseValidateObject)) return null;
    const courseHash = courseValidateObject.find((obj) => obj.typeName === 'course');

    if (isEmpty(courseHash)) return null;
    if (courseHash.isValid === null) return '';

    return (
      courseHash.isValid ? (
        <span className="badge badge-success mx-2">
          <h1 id="coursePreview.label.valid" />
        </span>
      ) : (
        <span className="badge badge-danger mx-2">
          <h1 id="coursePreview.label.inValid" />
        </span>
      )
    );
  };

  const handleValidateData = () => {
    setValidatorLoading(true);
    setCourseValidateObject([]);
    const promise = validateLevelCourse(treeBaseData, client);
    promise.then((courseValidateResponse) => {
      setCourseValidateObject(courseValidateResponse);
      const updatedTreeData = getUpdatedTreeData(courseValidateResponse, treeData);

      setTreeData(updatedTreeData);
      setValidatorLoading(false);
    });
  };

  return (
    <div className="display-5 pl-2 mb-2">
      {selectedCourse.label}
      { getBadgeForCourseLabel() }
      <VibButton
        key={`expand-btn-${Math.random()}`}
        isLoading={validatorLoading}
        handleSubmit={handleValidateData}
        isDisabled={isComparingCourseVersion}
        classes="ml-3 px-3 py-2"
      >
        <h1 id="coursePreview.btn.validateData" />
      </VibButton>
      <VibButton
        key={`expand-btn-${Math.random()}`}
        handleSubmit={handleExpand}
        classes="text-right ml-3 px-3 py-2"
        isDisabled={isComparingCourseVersion || !(some(treeData, ['expanded', false]) || some(treeData, ['expanded', undefined]))}
      >
        <h1 id="coursePreview.btn.expandAll" />
      </VibButton>
      <VibButton
        key={`collapse-btn-${Math.random()}`}
        handleSubmit={handleCollapseAll}
        classes="text-right ml-3 px-3 py-2"
        isDisabled={isComparingCourseVersion || !some(treeData, ['expanded', true])}
      >
        <h1 id="coursePreview.btn.collapseAll" />
      </VibButton>
      {
        canShowCompareBtn ? (
          <VibButton
            key={`compare-btn-${compareCourseVesrionPopupVisibility}`}
            handleSubmit={handleCompare}
            classes="text-right ml-3 px-3 py-2 float-right"
            isDisabled={isComparingCourseVersion}
          >
            <h1 id="coursePreview.btn.compare" />
          </VibButton>
        ) : null
      }
    </div>
  );
};

export default CourseVersionActionBox;
