import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import { pagePreview } from '../../../graphql_states/contentstack';
import { getCollectionUids, formatCollection } from '../Course/shared';
import Loader from '../../shared/Loader';
import Questions from './questions';
import {
  getNextLevelCollectionCmsId,
} from '../L2PagePreview/shared';

const ExamPreview = ({ location }) => {
  const [loadingContent, setLoadingContent] = useState(true);
  const [exam, setExam] = useState(null);
  const [associatedContent, setAssociatedContent] = useState(null);
  const [nextBreakRoomUrl, setNextBreakRoomUrl] = useState(null);
  const [l2Collection, setL2Collection] = useState(null);

  const params = new URLSearchParams(location.search);
  const questionCmsId = params.get('question');

  const client = useApolloClient();
  const {
    courseType,
    courseCmsId,
    levelTwoCollectionCmsId,
    levelThreeCollectionCmsId,
    examCmsId,
    contentType,
    lastL1CmsId,
    lastPageCmsId,
    locale,
  } = useParams();

  const lessonPage = () => {
    switch (courseType) {
      case 'Level2Course':
        return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${lastL1CmsId}/page/${lastPageCmsId}/preview`);
      case 'Level3Course':
        return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l3/${levelThreeCollectionCmsId}/l2/${levelTwoCollectionCmsId}/l1/${lastL1CmsId}/page/${lastPageCmsId}/preview`);
      default:
        throw new Error('Sorry.');
    }
  };

  const getCurrentL2 = (connection) => (
    connection.find((con) => con.system.uid === levelTwoCollectionCmsId)
  );

  const asyncFetchCourseData = async () => {
    let nextLevelUid = null;
    let nextContentType = null;
    switch (courseType) {
      case 'Level2Course': {
        const l2Course = await client.query({
          query: pagePreview.queries.GET_LEVEL_TWO_COURSE_WITH_TWO,
          variables: {
            courseCmsId,
            locale,
          },
          fetchPolicy: 'network-only',
        });
        const coreLevelTwoCollectionUids = getCollectionUids(l2Course.data.level_2_course.topicsConnection);
        const enrichmentLevelTwoCollectionUids = getCollectionUids(l2Course.data.level_2_course.enrichment_topicsConnection);

        const topicsConnection = formatCollection(l2Course.data.level_2_course.topicsConnection);
        const enrichmentTopicsConnection = formatCollection(l2Course.data.level_2_course.enrichment_topicsConnection);

        if (contentType === 'core') {
          setL2Collection(getCurrentL2(topicsConnection));
        } else {
          setL2Collection(getCurrentL2(enrichmentTopicsConnection));
        }
        [nextContentType, nextLevelUid] = getNextLevelCollectionCmsId(contentType, coreLevelTwoCollectionUids, enrichmentLevelTwoCollectionUids, levelTwoCollectionCmsId);
        if (!isEmpty(nextLevelUid)) {
          setNextBreakRoomUrl(`/course-preview/${locale}/${courseType}/${courseCmsId}/${nextContentType}/l2/${nextLevelUid}/preview`);
        }
        break;
      }
      case 'Level3Course': {
        let levelThreeCollection = await client.query({
          query: pagePreview.queries.GET_LEVEL_THREE_COLLECTION_WITH_TWO,
          variables: {
            levelThreeCollectionCmsId,
            locale,
          },
          fetchPolicy: 'network-only',
        });

        let topics = formatCollection(levelThreeCollection.data.level_3.sub_topicsConnection);
        let l2Index = topics.findIndex((con) => con.system.uid === levelTwoCollectionCmsId);
        if (topics[l2Index].system.uid === topics.slice(-1)[0].system.uid) {
          const l3Course = await client.query({
            query: pagePreview.queries.GET_LEVEL_THREE_COURSE_WITH_THREE,
            variables: {
              courseCmsId,
              locale,
            },
            fetchPolicy: 'network-only',
          });
          const coreLevelThreeCollectionUids = getCollectionUids(l3Course.data.level_3_course.topicsConnection);
          const enrichmentLevelThreeCollectionUids = getCollectionUids(l3Course.data.level_3_course.enrichment_topicsConnection);
          let l3CmsId = null;
          [nextContentType, l3CmsId] = getNextLevelCollectionCmsId(contentType, coreLevelThreeCollectionUids, enrichmentLevelThreeCollectionUids, levelThreeCollectionCmsId);
          if (!isEmpty(l3CmsId)) {
            levelThreeCollection = await client.query({
              query: pagePreview.queries.GET_LEVEL_THREE_COLLECTION_WITH_TWO,
              variables: {
                levelThreeCollectionCmsId: l3CmsId,
                locale,
              },
              fetchPolicy: 'network-only',
            });
            topics = formatCollection(levelThreeCollection.data.level_3.sub_topicsConnection);
            l2Index = 0;
            setNextBreakRoomUrl(`/course-preview/${locale}/${courseType}/${courseCmsId}/${nextContentType}/l3/${l3CmsId}/l2/${topics[0].system.uid}/preview`);
          }
        } else {
          setNextBreakRoomUrl(`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l3/${levelThreeCollectionCmsId}/l2/${topics[l2Index + 1].system.uid}/preview`);
        }
        setL2Collection(topics[l2Index]);
        break;
      }
      default: {
        throw new Error('Sorry.'); }
    }

    const examData = await client.query({
      query: pagePreview.queries.GET_EXAM_DATA,
      variables: {
        examCmsId,
        locale,
      },
      fetchPolicy: 'network-only',
    });
    if (!examData.loading && examData.data) {
      setExam(examData.data.exam);
      const imageData = formatCollection(examData.data.exam.imageConnection)[0];

      if (imageData && imageData.show_associated_content_) {
        const imageUid = imageData.system.uid;

        const image = await client.query({
          query: pagePreview.queries.GET_IMAGE,
          variables: {
            imagesReferenceCmsId: imageUid,
            locale,
          },
          fetchPolicy: 'network-only',
        });
        if (!image.loading) {
          setAssociatedContent(image.data.image);
        }
      }
    }
    setLoadingContent(false);
  };

  useEffect(() => {
    asyncFetchCourseData();
  }, [examCmsId]);

  if (loadingContent) return <Loader />;

  return (
    <Questions
      lastLessonPath={lessonPage()}
      levelTwoCollectionTitle={l2Collection.metadata.display_title || l2Collection.title}
      contentType={contentType}
      exam={exam}
      associatedContent={associatedContent}
      nextL2={nextBreakRoomUrl}
      questionCmsId={questionCmsId}
      locale={locale}
    />
  );
};

ExamPreview.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExamPreview;
