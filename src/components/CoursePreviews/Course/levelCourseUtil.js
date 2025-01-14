/* eslint-disable prefer-destructuring */
import {
  isEmpty,
} from 'lodash';

import { formatCollection, getMeasurementCategoryTitles } from './shared';

const getContentTypeName = (contentType) => {
  let name = null;
  switch (contentType) {
    case 'examsConnection':
      name = 'Assessment Exams';
      break;
    case 'assessmentConnection':
      name = 'Assessments';
      break;
    case 'sentimentSurvey1Connection':
      name = 'Sentiment Survey (Prior to core content start)';
      break;
    case 'sentimentSurvey2Connection':
      name = 'Sentiment Survey (After core content complete)';
      break;
    case 'sentimentSurvey3Connection':
      name = 'Final Sentiment Survey';
      break;
    case 'netPromoterScoreSurveyConnection':
      name = 'Net Promoter Score Survey';
      break;
    case 'coreContent':
      name = 'Core Content';
      break;
    case 'enrichmentContent':
      name = 'Enrichment Content';
      break;
    case 'goalsContent':
      name = 'Goals';
      break;
    case 'practice_questionsConnection':
      name = 'Practice Questions';
      break;
    default:
      throw new Error(`Sorry, we are out of ${contentType}.`);
  }
  return (name);
};

const metadata = ['Goals', 'SentimentSurvey', 'NetPromoterScoreSurvey', 'PracticeQuestion'];
const assessmentTypes = ['Assessments', 'AssessmentExam'];
const getTitle = (item) => {
  if (metadata.includes(item.__typename) || assessmentTypes.includes(item.__typename)) {
    return (item.display_title || item.title);
  }
  return (item.metadata.display_title || item.title);
};

const generateLevelCourseData = (collection, dataArr, contentType, uuidv4) => {
  const uid = uuidv4();
  if (!isEmpty(collection)) {
    dataArr.push({
      id: uid,
      objectId: contentType,
      name: getContentTypeName(contentType),
      parentId: null,
      canExpand: true,
      expandedCell: true,
      expanded: true,
      dataFetched: true,
      isValid: null,
      errorMessage: [],
      type: contentType === 'coreContent' ? 'core' : 'enrichment',
      typename: contentType,
      activityPoints: null,
      measurementCategoryTitles: null,
    });

    collection.forEach((item) => {
      dataArr.push({
        id: uuidv4(),
        objectId: item.system.uid,
        name: getTitle(item),
        parentId: uid,
        childrenExists: true,
        canExpand: !metadata.includes(item.__typename) || assessmentTypes.includes(item.__typename),
        expandedCell: assessmentTypes.includes(item.__typename),
        expanded: false,
        dataFetched: assessmentTypes.includes(item.__typename),
        isValid: null,
        errorMessage: [],
        type: contentType === 'coreContent' ? 'core' : 'enrichment',
        typename: item.__typename,
        activityPoints: item.activity_points ? item.activity_points.activity_points : null,
        measurementCategoryTitles: getMeasurementCategoryTitles(item),
      });
    });

    if (contentType === 'assessmentConnection') {
      const assExams = collection[0].examsConnection;
      if (!isEmpty(assExams)) {
        const assessmentExams = formatCollection(assExams);
        const parentId = dataArr[dataArr.length - 1].id;
        assessmentExams.forEach((item) => {
          dataArr.push({
            id: uuidv4(),
            objectId: item.system.uid,
            name: getTitle(item),
            parentId,
            parentCmsId: collection[0].system.uid,
            childrenExists: true,
            canExpand: assessmentTypes.includes(item.__typename),
            expandedCell: false,
            expanded: false,
            dataFetched: false,
            isValid: null,
            errorMessage: [],
            type: contentType,
            typename: item.__typename,
            activityPoints: item.activity_points ? item.activity_points.activity_points : null,
            measurementCategoryTitles: null,
          });
        });
      }
    }
  }
};

const generateLevelCourseMetadata = (metadata, dataArr, uuidv4) => {
  const {
    assessmentConnection,
    sentiment_survey1Connection,
    sentiment_survey2Connection,
    sentiment_survey3Connection,
    net_promoter_score_surveyConnection,
    goalsConnection,
  } = metadata;
  generateLevelCourseData(formatCollection(assessmentConnection), dataArr, 'assessmentConnection', uuidv4);
  generateLevelCourseData(formatCollection(sentiment_survey1Connection), dataArr, 'sentimentSurvey1Connection', uuidv4);
  generateLevelCourseData(formatCollection(sentiment_survey2Connection), dataArr, 'sentimentSurvey2Connection', uuidv4);
  generateLevelCourseData(formatCollection(sentiment_survey3Connection), dataArr, 'sentimentSurvey3Connection', uuidv4);
  generateLevelCourseData(formatCollection(net_promoter_score_surveyConnection), dataArr, 'netPromoterScoreSurveyConnection', uuidv4);
  generateLevelCourseData(formatCollection(goalsConnection), dataArr, 'goalsContent', uuidv4);
};

const generateTreeDataForLevel2Course = (dataArr, data, uuidv4) => {
  const coreCollection = formatCollection(data.level_2_course.topicsConnection);
  const enrichmentCollection = formatCollection(data.level_2_course.enrichment_topicsConnection);
  const { practice_questionsConnection }= data.level_2_course.metadata;
  generateLevelCourseMetadata(data.level_2_course.metadata, dataArr, uuidv4);
  generateLevelCourseData(coreCollection, dataArr, 'coreContent', uuidv4);
  generateLevelCourseData(enrichmentCollection, dataArr, 'enrichmentContent', uuidv4);
  generateLevelCourseData(formatCollection(practice_questionsConnection), dataArr, 'practice_questionsConnection', uuidv4);
  return (dataArr);
};

const generateTreeDataForLevel3Course = (dataArr, data, uuidv4) => {
  const coreCollection = formatCollection(data.level_3_course.topicsConnection);
  const enrichmentCollection = formatCollection(data.level_3_course.enrichment_topicsConnection);
  const { practice_questionsConnection: practiceQuestionsConnection } = data.level_3_course.metadata;
  generateLevelCourseMetadata(data.level_3_course.metadata, dataArr, uuidv4);
  generateLevelCourseData(coreCollection, dataArr, 'coreContent', uuidv4);
  generateLevelCourseData(enrichmentCollection, dataArr, 'enrichmentContent', uuidv4);
  generateLevelCourseData(formatCollection(practiceQuestionsConnection), dataArr, 'practice_questionsConnection', uuidv4);
  return (dataArr);
};

const prepareTreeData = (selectedCourse, data, uuidv4) => {
  const dataArr = [];
  switch (selectedCourse.typename) {
    case 'Level2Course':
      return (generateTreeDataForLevel2Course(dataArr, data, uuidv4));
    case 'Level3Course':
      return (generateTreeDataForLevel3Course(dataArr, data, uuidv4));
    default:
      throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
  }
};

export default prepareTreeData;
