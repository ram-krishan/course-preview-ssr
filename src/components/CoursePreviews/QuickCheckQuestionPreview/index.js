import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useQuery } from '@apollo/react-hooks';
import { formatCollection } from '../Course/shared';
import { useApolloClient } from '@apollo/react-hooks';
import { get } from 'lodash';
import Loader from '../../shared/Loader';
import AlertMessage from '../../shared/AlertMessage';
import { quickCheckQuestionItemPreview } from '../../../graphql_states/contentstack';
import { isEmpty } from 'lodash';
import getQuickCheckQuestionItemFormattedData from './QuickCheckQuestionItemFormatter';
import QuestionItemsPreviewPage from './QuestionItemsPreviewPage';
import { coursePreviewV2 } from '../../../graphql_states/contentstack';

const QuickCheckQuestionPreview = () =>{
  const {
    courseCmsId,
    courseType,
    locale,
  } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [allQuickCheckQuestionData, setAllQuickCheckQuestionData] = useState(null);
  let formattedData = {};
  const client = useApolloClient();
  let allTaxonomyIds = [];

  useEffect(()=>{
    FetctQuickCheckQuestionAsync();
  },[courseCmsId, courseType, locale])
  

  const FetctQuickCheckQuestionAsync = async() => {
    const response = await client.query({
      query: getCourseQuery(courseType),
      variables: { courseCmsId, locale }, 
      fetchPolicy: 'network-only'
    });
    
    let uidsArray;
    if (response.data) {
      uidsArray = getQuickCheckTaxonomyConnectionUids(response.data, courseType);
      allTaxonomyIds = [...uidsArray]
      await FetchAllTaxonomyIdsOfHierarchy(uidsArray);
    }

    const allQuickCheckQuestion = await client.query({
      query: quickCheckQuestionItemPreview.queries.GET_ALL_QUICK_CHECK_QUESTION_ITEM_DATA,
      variables: { quickCheckQuestioItemIds: allTaxonomyIds, locale: locale },
      fetchPolicy: 'network-only' 
    });

    setAllQuickCheckQuestionData(allQuickCheckQuestion);
    setIsLoading(false);
  }

  const getCourseQuery = (courseType) => {
    let query = null;
    switch (courseType) {
      case 'Level2Course':
        query = quickCheckQuestionItemPreview.queries.GET_LEVEL_TWO_COURSE_TAXONOMY_CONNECTION_DATA;
        break;
      case 'Level3Course':
        query = quickCheckQuestionItemPreview.queries.GET_LEVEL_THREE_COURSE_TAXONOMY_CONNECTION_DATA;
        break;
      default:
        throw new Error(`Sorry, we are out of ${courseType}.`);
    }
    return query;
  };
  
  const getQuickCheckTaxonomyConnectionUids = (data, courseType) => {
    let levelCourseData;
    if (courseType === "Level3Course") {
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
  

  if (isLoading) return <Loader />;

  if (allQuickCheckQuestionData.data.all_questionitem) {
    formattedData = getQuickCheckQuestionItemFormattedData(allQuickCheckQuestionData.data);
  };

  return (
    <Container className="p-0">
      <QuestionItemsPreviewPage formattedData={formattedData.questionItemData} />        
    </Container>
  );
};

export default QuickCheckQuestionPreview;
