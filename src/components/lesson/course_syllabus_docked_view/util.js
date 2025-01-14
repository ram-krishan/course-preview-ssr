import { get } from 'lodash';

const getCurrentTopicAndLessonDetails = (topics) => {
  let inprogressTopic = topics.find((topic) => topic.status === 'inProgress');

  if (!inprogressTopic) {
    inprogressTopic = topics.find((topic) => topic.status === 'open');
  }

  if (!inprogressTopic) {
    inprogressTopic = topics[0];
  }

  const topicId = inprogressTopic.id;

  let inprogressLesson = inprogressTopic.topicLessons.find((lesson) => lesson.lessonContent.status === 'inProgress');

  if (!inprogressLesson) {
    inprogressLesson = inprogressTopic.topicLessons.find((lesson) => lesson.lessonContent.status === 'open');
  }

  if (!inprogressLesson) {
    inprogressLesson = inprogressTopic.topicLessons[0];
  }

  const lessonTitle = (inprogressLesson !== null && inprogressLesson !== undefined) ? inprogressLesson.lessonContent.title : '';
  return { topicId, lessonTitle };
};


const getLevelTwoCollectionExamData = (levelTwoCollection, levelTwoCollectionProgress) => {
  const { exam } = levelTwoCollection;
  if (exam == null) return {};

  let examUrl = get(levelTwoCollectionProgress, 'levelTwoCollectionExamUserProgress.examUrl');
  if (!examUrl) examUrl = '';

  let examStatus = get(levelTwoCollectionProgress, 'levelTwoCollectionExamUserProgress.status');
  if (!examStatus) examStatus = 'open';

  return { exam: { ...exam, examUrl, status: examStatus } };
};

export { getCurrentTopicAndLessonDetails, getLevelTwoCollectionExamData };
