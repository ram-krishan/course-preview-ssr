import { isEmpty, get } from 'lodash';

const formatCollection = (collection) => {
  if (!isEmpty(get(collection, 'edges'))) {
    return collection.edges.map((item) => item.node)
  }
  return [];
};

const getMeasurementCategoryTitleOfQuestion = (question) => {
  const { measurement_categoryConnection: measurementCategoryConnection } = question;
  const formattedCategory = formatCollection(measurementCategoryConnection);
  if (!isEmpty(formattedCategory)) {
    return formattedCategory[0].display_title || formattedCategory[0].title;
  }
  return null;
};

const getMeasurementCategoryTitlesOfCollection = (metadata) => {
  const { measurement_categoriesConnection: measurementCategoriesConnection } = metadata;

  const formattedCategories = formatCollection(measurementCategoriesConnection);
  if (!isEmpty(formattedCategories)) {
    const titles = formattedCategories.map((el) => el.display_title || el.title);
    return titles.join(', ');
  }
  return null;
};

const getMeasurementCategoryTitles = (collection) => {
  let titles = null;
  switch (collection.__typename) {
    case 'Level3':
      titles = getMeasurementCategoryTitlesOfCollection(collection.metadata);
      break;
    case 'Level2':
      titles = getMeasurementCategoryTitlesOfCollection(collection.metadata);
      break;
    case 'Level1':
      titles = getMeasurementCategoryTitlesOfCollection(collection.metadata);
      break;
    case 'AssessmentQuestion':
      titles = getMeasurementCategoryTitleOfQuestion(collection);
      break;
    default:
      return null;
  }
  return titles;
};

const getEntryName = (typename) => {
  let name = null;
  switch (typename) {
    case 'Level3':
      name = 'level_3';
      break;
    case 'Level2':
      name = 'level_2';
      break;
    case 'Level1':
      name = 'level_1';
      break;
    case 'Pagev4':
      name = 'pagev4';
      break;
    case 'Assessments':
      name = 'assessments';
      break;
    case 'AssessmentExam':
      name = 'assessment_exam';
      break;
    case 'SentimentSurvey':
      name = 'sentiment_survey';
      break;
    case 'NetPromoterScoreSurvey':
      name = 'net_promoter_score_survey';
      break;
    case 'Goals':
      name = 'goals';
      break;
    case 'Exam':
      name = 'exam';
      break;
    case 'Question':
      name = 'question';
      break;
    case 'AssessmentQuestion':
      name = 'assessment_question';
      break;
    case 'PracticeQuestion':
      name = 'practice_question';
      break;
    default:
      throw new Error(`Sorry, we are out of ${typename}.`);
  }
  return (name);
};

const getContentType = (typename) => {
  let name = null;
  switch (typename) {
    case 'Level3':
      name = 'Collection - Level 3';
      break;
    case 'Level2':
      name = 'Collection - Level 2';
      break;
    case 'Level1':
      name = 'Collection - Level 1';
      break;
    case 'Pagev4':
      name = 'Page';
      break;
    case 'Assessments':
      name = 'Assessment';
      break;
    case 'AssessmentExam':
      name = 'Assessment Exam';
      break;
    case 'AssessmentQuestion':
      name = 'Assessment Question';
      break;
    case 'SentimentSurvey':
      name = 'Sentiment Survey';
      break;
    case 'NetPromoterScoreSurvey':
      name = 'Net Promoter Score Survey';
      break;
    case 'Goals':
      name = 'Goal';
      break;
    case 'Exam':
      name = 'Exam';
      break;
    case 'Question':
      name = 'question';
      break;
    default:
      name = typename;
      break;
  }
  return (name);
};

const getCollectionUids = (collection) => (
  formatCollection(collection).map((item) => item.system.uid)
);

export {
  formatCollection,
  getMeasurementCategoryTitleOfQuestion,
  getMeasurementCategoryTitles,
  getEntryName,
  getContentType,
  getCollectionUids,
};
