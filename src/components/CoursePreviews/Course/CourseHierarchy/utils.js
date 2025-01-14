import { get, isEmpty, map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { formatCollection, getMeasurementCategoryTitles } from '../shared';
import { coursePreviewV2 } from '../../../../graphql_states/contentstack';

const contentTypeMappings = (contentType) => {
  let mapping = {};

  switch(contentType) {
    case 'assessmentConnection':
      mapping = {
        name: 'Assessments',
        nextLevelConnection: {
          name: 'examsConnection',
          parentConnectionName: 'assessments',
          query: coursePreviewV2.queries.GET_ASSESSMENT_DATA,
        }
      };
      break;
    case 'examsConnection':
      mapping = {
        name: '_',
        nextLevelConnection: {
          name: 'questionsConnection',
          parentConnectionName: 'assessment_exam',
          query: coursePreviewV2.queries.GET_ASSESSMENT_EXAM_DATA,
        }
      };
      break;
    case 'topicsConnection':
      mapping = {
        name: 'Core Content',
        nextLevelConnection: [
          {
            name: 'lessonsConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          },
          {
            name: 'examConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          }
        ]
      };
      break;
    case 'enrichment_topicsConnection':
      mapping = {
        name: 'Enrichment Content',
        nextLevelConnection: [
          {
            name: 'lessonsConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          },
          {
            name: 'examConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          }
        ]
      };
      break;
    case 'level3_topicsConnection':
      mapping = {
        name: 'Core Content',
        nextLevelConnection: {
          name: 'sub_topicsConnection',
          parentConnectionName: 'level_3',
          query: coursePreviewV2.queries.GET_LEVEL_THREE_COLLECTION_DATA,
        }
      };
      break;
    case 'level3_enrichment_topicsConnection':
      mapping = {
        name: 'Enrichment Content',
        nextLevelConnection: {
          name: 'sub_topicsConnection',
          parentConnectionName: 'level_3',
          query: coursePreviewV2.queries.GET_LEVEL_THREE_COLLECTION_DATA,
        }
      };
      break;
    case 'sub_topicsConnection':
      mapping = {
        name: '_',
        nextLevelConnection: [
          {
            name: 'lessonsConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          },
          {
            name: 'examConnection',
            parentConnectionName: 'level_2',
            query: coursePreviewV2.queries.GET_LEVEL_TWO_COLLECTION_DATA,
          }
        ]
      };
      break;
    case 'lessonsConnection':
      mapping = {
        name: '_',
        nextLevelConnection: {
          name: 'pagesConnection',
          parentConnectionName: 'level_1',
          query: coursePreviewV2.queries.GET_LEVEL_ONE_COLLECTION_DATA,
        }
      };
      break;
    case 'examConnection':
      mapping = {
        name: '_',
        nextLevelConnection: {
          name: 'questionsConnection',
          parentConnectionName: 'exam',
          query: coursePreviewV2.queries.GET_LEVEL_TWO_EXAM_DATA,
        }
      };
      break;
    case 'senior_leader_messageConnection':
      mapping = { name: 'Senior Leader Message' };
      break;
    case 'sentiment_survey1Connection':
      mapping = { name: 'Sentiment Survey (Prior to core content start)' };
      break;
    case 'sentiment_survey2Connection':
      mapping = { name: 'Sentiment Survey (After core content complete)' };
      break;
    case 'sentiment_survey3Connection':
      mapping = { name: 'Final Sentiment Survey' };
      break;
    case 'net_promoter_score_surveyConnection':
      mapping = { name: 'Net Promoter Score Survey' };
      break;
    case 'goalsConnection':
      mapping = { name: 'Goals' };
      break;
    case 'learning_resourcesConnection':
      mapping = { name: 'Apply Page - Learning Resources' };
      break;
    case 'practice_questionsConnection':
      mapping = { name: 'Practice Questions' };
      break;
    case 'quickcheck_taxonomyConnection':
      mapping = { name: 'QuickCheck Questions' };
      break;
    default:
      mapping = {};
  }

  return mapping;
}

const getTitle = (contentData) => (
  get(contentData, 'display_title') ||
  get(contentData, 'metadata.display_title') ||
  get(contentData, 'title')
);

const canExpandToNextLevel = (contentObject, contentType) => {
  const contentTypeMapping = contentTypeMappings(contentType);
  if (['Core Content', 'Enrichment Content'].includes(contentTypeMapping.name)) {
    return true;
  }

  if (!isEmpty(contentTypeMapping.nextLevelConnection)) {
    const { nextLevelConnection } = contentTypeMapping;

    if (Array.isArray(nextLevelConnection)) {
      const nextLevelConnectionNames = map(nextLevelConnection, 'name');
      const nextLevelConnectionData = nextLevelConnectionNames.find(
        (connectionName) => formatCollection(contentObject[connectionName]).length > 0
      );
      return !isEmpty(nextLevelConnectionData);
    }

    return (formatCollection(contentObject[nextLevelConnection.name]).length > 0);
  }

  return false;
};

const generateTopLevelContentData = (initialDataArr, uid, contentType) => {
  initialDataArr.push({
    id: uid,
    parentId: null,
    objectId: contentType,
    objectType: null,
    contentType: contentType,
    name: contentTypeMappings(contentType).name,
    measurementCategory: null,
    activityPoints: null,
    expanded: true,
    canExpand: true,
    dataFetched: true,
  });
};

const generateContentDataForCollection = (
  initialDataArr,
  parentId,
  contentType,
  formattedCollection
) => {
  formattedCollection.forEach((item) => {
    const opts = {}
    if(item.pagesConnection?.edges) {
      const edges = item.pagesConnection?.edges
      const lastPageNode = edges[edges.length - 1]
      opts.lastPageCmsId = lastPageNode.node.system.uid
    }
    initialDataArr.push({
      id: uuidv4(),
      parentId: parentId,
      objectId: item.system.uid,
      objectType: item.__typename,
      contentType: contentType,
      name: getTitle(item),
      measurementCategory: getMeasurementCategoryTitles(item),
      activityPoints: get(item, 'activity_points.activity_points'),
      expanded: false,
      canExpand: canExpandToNextLevel(item, contentType),
      dataFetched: false,
      opts: opts,
    });
  });
};

const generateContentData = (initialDataArr, courseContentData, contentType) => {
  const contentData = get(courseContentData, contentType);
  const formattedContentData = contentType === 'quickcheck_taxonomyConnection' ? 
  courseContentData.all_questionitem.items : 
  formatCollection(contentData);

  if (!isEmpty(formattedContentData)) {
    const uid = uuidv4();
    generateTopLevelContentData(initialDataArr, uid, contentType);
    generateContentDataForCollection(initialDataArr, uid, contentType, formattedContentData);
  }
};

const generateInitialContentDataForMetadata = (initialDataArr, metaData) => {
  generateContentData(initialDataArr, metaData, 'assessmentConnection');
  generateContentData(initialDataArr, metaData, 'sentiment_survey1Connection');
  generateContentData(initialDataArr, metaData, 'sentiment_survey2Connection');
  generateContentData(initialDataArr, metaData, 'sentiment_survey3Connection');
  generateContentData(initialDataArr, metaData, 'net_promoter_score_surveyConnection');
  generateContentData(initialDataArr, metaData, 'senior_leader_messageConnection');
  generateContentData(initialDataArr, metaData, 'goalsConnection');
  generateContentData(initialDataArr, metaData, 'learning_resourcesConnection');
};

const generateInitialContentDataForTopic = (initialDataArr, courseData, selectedCourse) => {
  if (selectedCourse.typename === 'Level3Course') {
    generateContentData(initialDataArr, courseData, 'level3_topicsConnection');
    generateContentData(initialDataArr, courseData, 'level3_enrichment_topicsConnection');
  } else {
    generateContentData(initialDataArr, courseData, 'topicsConnection');
    generateContentData(initialDataArr, courseData, 'enrichment_topicsConnection');
  }
};

const generateInitialDataForCourse = (initialDataArr, levelCourseData, quickCheckQuestionData, selectedCourse ) => {
  const { metadata: metaData } = levelCourseData;
  generateInitialContentDataForMetadata(initialDataArr, metaData);
  generateInitialContentDataForTopic(initialDataArr, levelCourseData, selectedCourse);
  generateContentData(initialDataArr, metaData, 'practice_questionsConnection');
  generateContentData(initialDataArr, quickCheckQuestionData.data, 'quickcheck_taxonomyConnection');
  return initialDataArr;
};

const prepareInitialCourseHierarchyData = (selectedCourse, data, quickCheckQuestionData ) => {
  const initialDataArr = [];
  switch (selectedCourse.typename) {
    case 'Level2Course':
      return generateInitialDataForCourse(initialDataArr, data.level_2_course, quickCheckQuestionData, selectedCourse)
    case 'Level3Course':
      return generateInitialDataForCourse(initialDataArr, data.level_3_course, quickCheckQuestionData, selectedCourse)
    default:
      throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
  }
};

const fetchContentTypeData = (dataArr, data, parentConnectionName, contentType, expandedRow) => {
  const contentTypeData = data[parentConnectionName];
  const contentData = get(contentTypeData, contentType);
  const formattedContentData = formatCollection(contentData);
  if (!isEmpty(formattedContentData)) {
    generateContentDataForCollection(dataArr, expandedRow.id, contentType, formattedContentData);
  }
};

const prepareContentTypeData = (expandedRow, data) => {
  const dataArr = [];
  const parentContentTypeMapping = contentTypeMappings(expandedRow.contentType);
  const { nextLevelConnection } = parentContentTypeMapping;

  if (Array.isArray(nextLevelConnection)) {
    nextLevelConnection.forEach((nextLevelMapping) => {
      const { name: contentType, parentConnectionName } = nextLevelMapping;
      fetchContentTypeData(dataArr, data, parentConnectionName, contentType, expandedRow);
    });
  } else {
    const { name: contentType, parentConnectionName } = nextLevelConnection;
    fetchContentTypeData(dataArr, data, parentConnectionName, contentType, expandedRow);
  }

  return dataArr;
};


const contentStackObjectNameMappings = (typename) => {
  let objectNameMapping = {};
  switch (typename) {
    case 'Level3':
      objectNameMapping = {
        name: 'level_3',
        tag: 'Collection - Level 3'
      }
      break;
    case 'Level2':
      objectNameMapping = {
        name: 'level_2',
        tag: 'Collection - Level 2'
      };
      break;
    case 'Level1':
      objectNameMapping = {
        name: 'level_1',
        tag: 'Collection - Level 1'
      };
      break;
    case 'Pagev4':
      objectNameMapping = {
        name: 'pagev4',
        tag: 'Page'
      };
      break;
    case 'Assessments':
      objectNameMapping = {
        name: 'assessments',
        tag: 'Assessment'
      };
      break;
    case 'AssessmentExam':
      objectNameMapping = {
        name: 'assessment_exam',
        tag: 'Assessment Exam'
      };
      break;
    case 'SeniorLeaderMessage':
      objectNameMapping = {
        name: 'senior_leader_message',
        tag: 'Senior Leader Message'
      };
      break;
    case 'SentimentSurvey':
      objectNameMapping = {
        name: 'sentiment_survey',
        tag: 'Sentiment Survey'
      };
      break;
    case 'NetPromoterScoreSurvey':
      objectNameMapping = {
        name: 'net_promoter_score_survey',
        tag: 'Net Promoter Score Survey'
      };
      break;
    case 'Goals':
      objectNameMapping = {
        name: 'goals',
        tag: 'Goal'
      };
      break;
    case 'LearningResource':
      objectNameMapping = {
        name: 'learning_resource',
        tag: 'Learning Resource'
      };
      break;
    case 'Exam':
      objectNameMapping = {
        name: 'exam',
        tag: 'Exam'
      };
      break;
    case 'Question':
      objectNameMapping = {
        name: 'question',
        tag: 'question'
      };
      break;
    case 'AssessmentQuestion':
      objectNameMapping = {
        name: 'assessment_question',
        tag: 'Assessment Question'
      };
      break;
    case 'PracticeQuestion':
      objectNameMapping = {
        name: 'practice_question',
        tag: 'PracticeQuestion'
      };
      break;
    case 'Level2Course':
      objectNameMapping = {
        name: 'level_2_course',
        tag: 'Course - Level 2'
      };
      break;
    case 'Level3Course':
      objectNameMapping = {
        name: 'level_3_course',
        tag: 'Course - Level 3'
      };
      break;
    case 'Questionitem':
      objectNameMapping = {
        name: 'questionitem',
        tag: 'QuestionItem'
      };
      break;
    default:
      throw new Error(`Sorry, we are out of ${typename}.`);
  }
  return objectNameMapping;
};

export {
  contentStackObjectNameMappings,
  contentTypeMappings,
  prepareContentTypeData,
  prepareInitialCourseHierarchyData,
};
