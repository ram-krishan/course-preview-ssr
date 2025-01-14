import { get } from 'lodash';

const progressStatus = (progress) => {
  let status = 'open';
  if (progress) {
    status = progress.status;
  }
  return (status);
};

const nextLevelCollectionProgress = (progress, key) => (
  progress && progress[key]
);

const findProgress = (progressCollection, id, key) => {
  let progress = null;
  if (Array.isArray(progressCollection)) {
    progress = progressCollection.find((obj) => obj[key] === id);
  }
  return (progress);
};

const getLevelOneCollection = (levelOneCollections, levelTwoCollectionProgress) => (
  levelOneCollections.map((item) => {
    const progress = findProgress(nextLevelCollectionProgress(levelTwoCollectionProgress, 'levelOneCollectionProgresses'), item.id, 'levelOneCollectionId');

    return (
      {
        id: item.id,
        title: item.title,
        status: progressStatus(progress),
        description: item.description,
        lessonPageUrl: progress && progress.lessonPageUrl,
        __typename: 'LevelOneCollection',
      }
    );
  })
);

const canShowAssessmentTitle = (previousCompletedLevelTwoCollection) => (
  get(previousCompletedLevelTwoCollection, 'title') === undefined
);

export {
  getLevelOneCollection,
  canShowAssessmentTitle,
};
