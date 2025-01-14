import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, cloneDeep, flatten } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import { v4 as uuidv4 } from 'uuid';
import TreeListBuilder from './TreeListBuilder';
import HoneyBadgerClient from '../../../HoneyBadger';
import prepareTreeData from './levelCourseUtil';
import CourseVersionCompareInfoBox from './CourseVersionCompareInfoBox';
import Loader from '../../shared/Loader';
import { coursePreview } from '../../../graphql_states/contentstack';
import CourseVersionActionBox from './CourseVersionActionBox';
import CompareCourseVersionTreeList from './CompareCourseVersionTreeList';
import VibButton from '../../shared/vib_button';
import validateLevelCourse from './validator';
import { formatCollection, getMeasurementCategoryTitleOfQuestion, getMeasurementCategoryTitles } from './shared';

const TreeListView = ({
  selectedCourse,
  setcompareCourseVesrionPopupVisibility,
  compareCourseVesrionPopupVisibility,
  isComparingCourseVersion,
  selectedCourseVersions,
  setIsComparingCourseVersion,
  setSelectedCourseVersions,
}) => {
  const client = useApolloClient();
  const [courseValidateObject, setCourseValidateObject] = useState([]);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const [loadingCourseData, setLoadingCourseData] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [treeBaseData, setTreeBaseData] = useState([]);

  const courseVersionsToCompare = {};

  useEffect(() => {
    setTreeData([]);
    setLoadingCourseData(true);
    setCourseValidateObject([]);
    setValidatorLoading(false);
    setIsComparingCourseVersion(false);
    setSelectedCourseVersions([]);
  }, [selectedCourse.value]);

  if (isComparingCourseVersion && selectedCourseVersions.length === 2) {
    const [courseVersion1, courseVersion2] = selectedCourseVersions;
    const date1 = new Date(courseVersion1.createdAt);
    const date2 = new Date(courseVersion2.createdAt);
    if (date1.getTime() >= date2.getTime()) {
      courseVersionsToCompare.sourceVersion = courseVersion1;
      courseVersionsToCompare.targetVersion = courseVersion2;
    } else {
      courseVersionsToCompare.sourceVersion = courseVersion2;
      courseVersionsToCompare.targetVersion = courseVersion1;
    }
  }

  const commonAttr = (item, parent, responseData) => {
    if (item.__typename === 'Pagev4' || item.__typename === 'Question') {
      const levelTwoCollection = responseData.find((obj) => obj.id === parent.parentId);
      return ({
        canExpand: false,
        expandedCell: false,
        dataFetched: false,
        levelOneCollectionId: parent.objectId,
        levelTwoCollectionId: levelTwoCollection.objectId,
      });
    }

    const canExpand = !(item.__typename === 'AssessmentQuestion');
    return ({
      canExpand,
      expandedCell: false,
      dataFetched: false,
    });
  };

  const getTitle = (item) => {
    if (item.__typename === 'Pagev4' || item.__typename === 'Exam' || item.__typename === 'AssessmentQuestion') {
      return (item.display_title || item.title);
    }
    if (item.__typename === 'Question') {
      return item.title;
    }
    return (item.metadata.display_title || item.title);
  };

  const getQuestionConnection = (nextExamData) => flatten(nextExamData.map((item) => {
    const { questionsConnection } = item;
    return questionsConnection.map((itemQuestion) => ({
      id: uuidv4(),
      objectId: itemQuestion.system.uid,
      name: `${getTitle(itemQuestion)}`,
      type: item.type,
      parentId: item.id,
      parentCmsId: item.objectId,
      canExpand: false,
      expandedCell: false,
      expanded: false,
      dataFetched: false,
      isValid: null,
      errorMessages: [],
      typename: itemQuestion.__typename,
      activityPoints: itemQuestion.activity_points ? itemQuestion.activity_points.activity_points : null,
      measurementCategoryTitles: getMeasurementCategoryTitleOfQuestion(itemQuestion),
    }));
  }));

  const addChildCollection = (response, record, responseDataArr) => {
    let collection = null;
    let examConnection = null;
    switch (record.typename) {
      case 'Level3':
        collection = response.data.level_3.sub_topicsConnection;
        break;
      case 'Level2':
        examConnection = response.data.level_2.examConnection;

        collection = response.data.level_2.lessonsConnection;
        break;
      case 'Level1':
        collection = response.data.level_1.pagesConnection;
        break;
      case 'Exam':
        collection = response.data.exam.questionsConnection;
        break;
      case 'AssessmentExam':
        collection = response.data.assessment_exam.questionsConnection;
        break;
      default:
        throw new Error(`Sorry, we are out of ${record.typename}.`);
    }
    let nextExamData = [];
    let nextQuestionData = [];

    if (examConnection !== null) {
      const formattedExamConnection = formatCollection(examConnection);
      nextExamData = formattedExamConnection.map((item) => (
        {
          id: uuidv4(),
          objectId: item.system.uid,
          name: `${getTitle(item)}`,
          type: record.type,
          parentId: record.id,
          canExpand: true,
          expandedCell: false,
          expanded: false,
          dataFetched: true,
          isValid: null,
          errorMessages: [],
          typename: item.__typename,
          questionsConnection: formatCollection(item.questionsConnection),
          activityPoints: item.activity_points ? item.activity_points.activity_points : null,
          measurementCategoryTitles: null,
        }));

      nextQuestionData = getQuestionConnection(nextExamData);
    }
    const formattedCollections = formatCollection(collection);
    const nextData = formattedCollections.map((item) => ({
      id: uuidv4(),
      objectId: item.system.uid,
      name: getTitle(item),
      type: record.type,
      parentId: record.id,
      isValid: null,
      errorMessages: [],
      parentCmsId: record.objectId,
      parentOfParentCmsId: record.parentCmsId,
      ...commonAttr(item, record, responseDataArr),
      typename: item.__typename,
      activityPoints: item.activity_points ? item.activity_points.activity_points : null,
      measurementCategoryTitles: getMeasurementCategoryTitles(item),
    }));
    let newData = [...nextData, ...nextExamData, ...nextQuestionData];
    newData = newData.map((tdate) => {
      if (tdate.id === record.id) {
        tdate.expandedCell = true;
        tdate.dataFetched = true;
      }
      return tdate;
    });

    return (newData);
  };

  let query = null;
  switch (selectedCourse.typename) {
    case 'Level2Course':
      query = coursePreview.queries.GET_LEVEL_TWO_COURSE_DATA;
      break;
    case 'Level3Course':
      query = coursePreview.queries.GET_LEVEL_THREE_COURSE_DATA;
      break;
    default:
      throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
  }

  const asyncFetchCourseData = async () => {
    const response = await client.query({
      query,
      variables: {
        uid: selectedCourse.value,
      },
      fetchPolicy: 'network-only',
    });
    const { data } = response;
    const dataCollection = prepareTreeData(selectedCourse, data, uuidv4);


    let responseDataArr = [...dataCollection];
    const typeNames = ['Level3', 'Level2', 'Level1', 'AssessmentExam'];
    responseDataArr = responseDataArr.map((item) => {
      if (!item.expandedCell && isEmpty(item.parentId)) {
        return ({ ...item, expandedCell: true });
      }
      return (item);
    });

    for await (const typeName of typeNames) {
      const childNodes = responseDataArr.filter((item) => item.canExpand && !isEmpty(item.parentId));
      for await (const record of childNodes) {
        if (!record.dataFetched && typeName === record.typename) {
          switch (record.typename) {
            case 'Level3':
              query = coursePreview.queries.GET_LEVEL_THREE_COLLECTION;
              break;
            case 'Level2':
              query = coursePreview.queries.GET_LEVEL_TWO_COLLECTION;
              break;
            case 'Level1':
              query = coursePreview.queries.GET_LEVEL_ONE_COLLECTION;
              break;
            // case 'Exam':
            //   query = coursePreview.queries.GET_EXAM_QUESTION_ANSWERS;
            //   break;
            case 'AssessmentExam':
              query = coursePreview.queries.GET_ASSESSMENT_EXAM_DATA;
              break;
            default:
              throw new Error(`Sorry, we are out of ${record.typename}.`);
          }

          const response = await client.query({
            query,
            variables: {
              uid: record.objectId,
            },
            fetchPolicy: 'network-only',
          });
          const fdata = await addChildCollection(response, record, responseDataArr);
          responseDataArr = [...responseDataArr, ...fdata];
        }
      }
    }
    setTreeData(responseDataArr);
    setLoadingCourseData(false);
    setTreeBaseData(data);
  };

  useEffect(() => {
    asyncFetchCourseData();
  }, [selectedCourse.value]);


  const handleExceptionInTreeList = () => {
    try {
      return (
        !isEmpty(treeData) ? (
          <TreeListBuilder
            treeData={[...treeData]}
            loadAll={false}
            setLoadAll={() => {}}
            selectedCourse={selectedCourse}
            setTreeData={setTreeData}
          />
        ) : null
      );
    } catch (err) {
      HoneyBadgerClient.notify({
        error: err,
        message: `Error: ${err}, selected_course: ${JSON.stringify(selectedCourse)}`,
        component: 'course-preview-TreeListView',
        params: {
          treeData,
        },
      }, 'TreeListViewError');
    }
  };

  const showObjectErrorMessages = (errorMessages) => {
    if (isEmpty(errorMessages)) return null;

    return (
      <>
        <div className="text-danger ml-4 mt-2 pl-2">Errors: </div>
        <ul className="mt-2 ml-3">
          {
            errorMessages.map((errorMessage) => (
              <li className="text-danger text-wrap text-break">
                {errorMessage}
              </li>
            ))
          }
        </ul>
      </>
    );
  };

  const showCourseErrorMessages = () => {
    if (isEmpty(courseValidateObject)) return null;
    const courseHash = courseValidateObject.find((obj) => obj.typeName === 'course');

    if (isEmpty(courseHash)) return null;

    if (courseHash.isValid === null) return '';
    return showObjectErrorMessages(courseHash.errorMessages);
  };

  const handleCompare = () => {
    setcompareCourseVesrionPopupVisibility(true);
  };

  const handleExpand = () => {
    const newTreeData = [...treeData];
    setTreeData(newTreeData.map((obj) => ({ ...obj, expanded: true })));
  };

  const handleCollapseAll = () => {
    const newTreeData = [...treeData];
    setTreeData(newTreeData.map((obj) => ({ ...obj, expanded: undefined })));
  };

  const getUpdatedTreeData = (courseValidateResponse, courseTreeData) => {
    if (isEmpty(courseValidateResponse)) return courseTreeData;

    const newCourseTreeData = cloneDeep(courseTreeData);
    const parentNodes = newCourseTreeData.filter((treeDataHash) => treeDataHash.parentId === null);
    const childNodes = newCourseTreeData.filter((treeDataHash) => treeDataHash.parentId !== null);
    childNodes.forEach((childNode) => {
      const courseValidate = courseValidateResponse.find((res) => (
        res.objectCmsId === childNode.objectId
      ));
      if (!isEmpty(courseValidate)) {
        childNode.isValid = courseValidate.isValid;
        childNode.errorMessages = courseValidate.errorMessages;
      }
    });

    parentNodes.forEach((parentNode) => {
      const parentNodeId = parentNode.id;
      const parentChildNodes = newCourseTreeData.filter((treeDataHash) => (
        treeDataHash.parentId === parentNodeId
      ));
      const inValidNodes = parentChildNodes.filter((parentChildNode) => !parentChildNode.isValid);
      parentNode.isValid = isEmpty(inValidNodes);
    });

    return newCourseTreeData;
  };

  if (loadingCourseData) return <Loader />;

  return (
    <div className="animated fadeIn">
      <CourseVersionActionBox
        treeBaseData={treeBaseData}
        treeData={treeData}
        selectedCourse={selectedCourse}
        validatorLoading={validatorLoading}
        courseValidateObject={courseValidateObject}
        isComparingCourseVersion={isComparingCourseVersion}
        compareCourseVesrionPopupVisibility={compareCourseVesrionPopupVisibility}
        handleExpand={handleExpand}
        handleCollapseAll={handleCollapseAll}
        handleCompare={handleCompare}
        setValidatorLoading={setValidatorLoading}
        setCourseValidateObject={setCourseValidateObject}
        getUpdatedTreeData={getUpdatedTreeData}
        setTreeData={setTreeData}
      />

      {isComparingCourseVersion && selectedCourseVersions.length === 2 ? (
        <>
          <CourseVersionCompareInfoBox
            sourceCourseVersion={courseVersionsToCompare.sourceVersion}
            targetCourseVersion={courseVersionsToCompare.targetVersion}
          />

          <CompareCourseVersionTreeList
            selectedCourse={selectedCourse}
            sourceCourseVersionId={courseVersionsToCompare.sourceVersion.id}
            targetCourseVersionId={courseVersionsToCompare.targetVersion.id}
          />
        </>
      ) : (
        [
          handleExceptionInTreeList(),
          showCourseErrorMessages(),
        ]
      )}
    </div>
  );
};

TreeListView.propTypes = {
  selectedCourse: PropTypes.instanceOf(Object).isRequired,
  setcompareCourseVesrionPopupVisibility: PropTypes.func.isRequired,
  compareCourseVesrionPopupVisibility: PropTypes.bool.isRequired,
  isComparingCourseVersion: PropTypes.bool.isRequired,
  selectedCourseVersions: PropTypes.instanceOf(Array).isRequired,
};

export default TreeListView;
