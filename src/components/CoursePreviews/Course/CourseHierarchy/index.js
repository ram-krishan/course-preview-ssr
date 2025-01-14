import React, { useState, useEffect } from 'react';
import TreeList from 'react-treelist';
import { useApolloClient } from '@apollo/react-hooks';
import {snakeCase} from 'lodash';
import { get } from 'lodash';
import { formatCollection } from '../shared';

import Loader from '../../../shared/Loader';
import treeListColummns from './treeListCoulmns';
import ActionButtonsBox from './ActionButtonsBox';
import CourseContext from "./context/courseContext";
import {
  contentTypeMappings,
  prepareContentTypeData,
  prepareInitialCourseHierarchyData,
} from './utils';
import { coursePreviewV2 } from '../../../../graphql_states/contentstack';
import './course-hierarchy-v2-style.scss';

const CourseHierarchy = ({ selectedCourse, selectedLocale, setRefetchWorkFlowStatus }) => {
  const client = useApolloClient();
  const [courseData, setCourseData] = useState([]);
  const [courseMetaData, setCourseMetaData] = useState({
    course_description: null, duration: null });
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  const [isLoadingCourseData, setIsLoadingCourseData] = useState(true);
  const [isExpandedAllLoading, setIsExpandedAllLoading] = useState(false);
  let allTaxonomyIds = [];

  const getQueryToFetchInitialDataForSelectedCourse = () => {
    let courseQuery = null;
    switch (selectedCourse.typename) {
      case 'Level2Course':
        courseQuery = coursePreviewV2.queries.GET_LEVEL_TWO_COURSE_DATA;
        break;
      case 'Level3Course':
        courseQuery = coursePreviewV2.queries.GET_LEVEL_THREE_COURSE_DATA;
        break;
      default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
    return courseQuery;
  };

  const asyncFetchInitialCourseData = async () => {
    const response = await client.query({
      query: getQueryToFetchInitialDataForSelectedCourse(),
      fetchPolicy: 'network-only',
      variables: { uid: selectedCourse.value, locale: selectedLocale.value},
    });
    
    const { data } = response;
    const uidsArray =  getQuickCheckTaxonomyConnectionUids(data, selectedCourse)
    allTaxonomyIds = [...uidsArray]
    await FetchAllTaxonomyIdsOfHierarchy(uidsArray)
    
    const quickCheckQuestionData = await client.query({
      query: coursePreviewV2.queries.GET_QUICK_CHECK_QUESTION_ITEMS,
      fetchPolicy: 'network-only',
      variables: { uid: allTaxonomyIds, locale: selectedLocale.value },
    });

    const dataCollection = prepareInitialCourseHierarchyData(selectedCourse, data, quickCheckQuestionData, selectedLocale);
    setCourseData(dataCollection);
    setIsLoadingCourseData(false);

    const levelCourse = snakeCase(selectedCourse.typename);
    const { course_description, duration } = data[levelCourse].metadata;
    setCourseMetaData({...courseMetaData, course_description, duration});
  };

  useEffect(() => {
    setIsLoadingCourseData(true);
    asyncFetchInitialCourseData();
    setIsExpandedAll(false)
    setIsExpandedAllLoading(false)
  }, [selectedCourse.value, selectedLocale.value]);
  
  const getQuickCheckTaxonomyConnectionUids = (data, selectedCourse) => {
    let levelCourseData;
    if (selectedCourse.typename === "Level3Course") {
        levelCourseData = data.level_3_course;
    } else {
        levelCourseData = data.level_2_course;
    }
    const { metadata } = levelCourseData;
    const contentData = get(metadata, 'quickcheck_taxonomyConnection');
    const formattedContentData = formatCollection(contentData);
    const uidsArray = [];
    formattedContentData.forEach((contentData) => {
        const uid = contentData.system.uid;
        uidsArray.push(uid);
    });
    return uidsArray;
  };

  const getQuickCheckTaxonomyUids = (data) => {
    const uids = []
    data.all_taxon_bottom_up.items.forEach((contentData) => {
      const uid = contentData.system.uid;
      uids.push(uid);
    });
    return uids;
  };


  const FetchChildTaxonomies = async (parentUid) => {
    const response = await client.query({
        query: coursePreviewV2.queries.GET_TAXONOMY_CHILDRENS,
        fetchPolicy: 'network-only',
        variables: { parentUid: parentUid },
    });

    const { data } = response;
    return getQuickCheckTaxonomyUids(data);
  };

  const FetchAllTaxonomyIdsOfHierarchy = async (uids, visited = new Set()) => {
      for (const uid of uids) {
          if (!visited.has(uid)) {
              visited.add(uid);
              const childUids = await FetchChildTaxonomies(uid);
              allTaxonomyIds = [...allTaxonomyIds, ...childUids];
              await FetchAllTaxonomyIdsOfHierarchy(childUids, visited);
          }
      }
  };


  const fetchNextLevelContent = async (parentRow, nextLevelConnection, returnPreparedData) => {
    return await client.query({
      query: nextLevelConnection.query,
      fetchPolicy: 'network-only',
      variables: { uid: parentRow.objectId, locale: selectedLocale.value },
    }).then((response) => {
      const nextLevelData = prepareContentTypeData(parentRow, response.data);

      if (returnPreparedData) {
        return nextLevelData;
      } else {
        // Update the state
        const dupCourseData = [...courseData];
        const targetRow = dupCourseData.find((data) => data.id === parentRow.id);
        targetRow.dataFetched = true;
        targetRow.isLoadingData = false;
        dupCourseData.push(...nextLevelData);
        setCourseData(dupCourseData);
      }
    });
  }

  const asyncFetchNextLevelContentData = async (parentRow, returnPreparedData=false) => {
    const contentTypeMapping = contentTypeMappings(parentRow.contentType);
    const { nextLevelConnection } = contentTypeMapping;

    if (Array.isArray(nextLevelConnection)) {
      return fetchNextLevelContent(parentRow, nextLevelConnection[0], returnPreparedData);
    } else {
      return fetchNextLevelContent(parentRow, nextLevelConnection, returnPreparedData)
    }
  };

  const handleContentExpand = (contentRowId, expanded) => {
    const newCourseData = [...courseData];
    const row = newCourseData.find((data) => data.id === contentRowId);
    row.expanded = expanded;

    if (!row.dataFetched && expanded === true) {
      row.isLoadingData = true;
    }

    setCourseData(newCourseData);

    if (row.parentId !== null && row.canExpand && !row.dataFetched) {
      asyncFetchNextLevelContentData(row);
    }
  };

  const canExpandAll = () => {
    const collapsedRows = courseData.filter((object) => object.canExpand && !object.expanded);
    return (collapsedRows.length > 0);
  };

  const canCollapseAll = () => {
    const expandedRows = courseData.filter((object) => object.canExpand && object.expanded);
    return (expandedRows.length > 0);
  };

  const getExpandableRows = (dataArr) => {
    return dataArr.filter((object) => (
      object.parentId !== null &&
      object.canExpand &&
      !object.expanded
    ));
  };

  const handleExpandAll = () => {
    const dupCourseData = [...courseData];
    setIsExpandedAllLoading(true)
    asyncExpandAllRows(dupCourseData, dupCourseData)
    // );
  };

  const asyncExpandAllRows = async (totalRows, initialCourseData) => {
    if(isExpandedAll) {
      const newCourseData = initialCourseData.map((obj) => ({ ...obj, expanded: true }));
      setCourseData(newCourseData);
      setIsExpandedAllLoading(false)
      return
    }

    const expandableRows = getExpandableRows(initialCourseData);
    const nextLevelRows = [];
    for await (const expandableRow of expandableRows) {
      await asyncFetchNextLevelContentData(expandableRow, true).then((response) => {
        nextLevelRows.push(...response);
        expandableRow.dataFetched = true;
        expandableRow.expanded = true;
      });
    }

    const nextLevelExpandableRows = getExpandableRows(nextLevelRows);
    totalRows.push(...nextLevelRows);
    if (nextLevelExpandableRows.length > 0) {
      asyncExpandAllRows(totalRows, nextLevelExpandableRows);
    } else {
      totalRows = totalRows.map((obj) => ({ ...obj, expanded: true }))
      setCourseData(totalRows);
      setIsExpandedAll(true)
      setIsExpandedAllLoading(false)
    }
  };

  const handleCollapseAll = () => {
    const newCourseData = courseData.map((obj) => ({ ...obj, expanded: undefined }));
    setCourseData(newCourseData);
  };

  if (isLoadingCourseData) {
    return <Loader />;
  }

  return (
    <CourseContext.Provider value={{selectedCourse, courseData, selectedLocale }}>
      <ActionButtonsBox
        selectedCourse={selectedCourse}
        canExpandAll={canExpandAll()}
        handleExpandAll={handleExpandAll}
        canCollapseAll={canCollapseAll()}
        handleCollapseAll={handleCollapseAll}
        isExpandedAllLoading={isExpandedAllLoading}
        locale={selectedLocale.value}
        setRefetchWorkFlowStatus={setRefetchWorkFlowStatus}
        courseMetaData={courseMetaData}
      />

      <div className="initial-course-preview-table">
        <TreeList
          data={courseData}
          columns={treeListColummns(selectedLocale)}
          options={{}}
          id={'id'}
          parentId={'parentId'}
          onExpand={handleContentExpand}
        />
      </div>
    </CourseContext.Provider>
  );
};

export default CourseHierarchy;
