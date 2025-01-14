
import {
  findIndex, truncate, isEmpty,
} from 'lodash';

const truncateText = (text) => truncate(text, { length: 60, omission: ' ...' });

const getCurrentIndex = (collection, item) => (
  findIndex(collection, (
    obj,
  ) => obj.cmsId === item.cmsId)
);

const getL1CurrentIndex = (collection, item) => (
  findIndex(collection, (
    obj,
  ) => obj.levelOneCollection.cmsId === item.cmsId)
);

const nextLinkText = (levelTwoCollection, levelOneCollection, page, hasExam, intl) => {
  const { levelTwoLevelOneCollections } = levelTwoCollection;
  const isLastLevelOneCollection = levelTwoLevelOneCollections[levelTwoLevelOneCollections.length - 1].levelOneCollection.cmsId === levelOneCollection.cmsId;
  const { pages } = levelOneCollection;
  const currentPageIndex = getCurrentIndex(pages, page);
  const currentLevelOneCollectionIndex = getL1CurrentIndex(levelTwoLevelOneCollections, levelOneCollection);
  const currentLevelTwoLevelOneCollection = levelTwoLevelOneCollections[currentLevelOneCollectionIndex + 1];
  const isLastPage = ((pages.length - 1) === currentPageIndex);

  if (isLastLevelOneCollection && isLastPage) {
    if (hasExam) return truncateText(levelTwoCollection.exam.title);
    const { levelTwoCollectionProgress: { nextLevelTwoCollection } } = levelTwoCollection;
    if (nextLevelTwoCollection) return truncateText(nextLevelTwoCollection.title);
    return intl.formatMessage({ id: 'page.button.continueToToday' });
  } if (currentLevelTwoLevelOneCollection !== undefined && isLastPage) {
    return truncateText(currentLevelTwoLevelOneCollection.levelOneCollection.title);
  }
  return truncateText('');
};

const previousLinkText = (levelTwoCollection, levelOneCollection, page, previousLevelTwoCollection, intl) => {
  const { levelTwoLevelOneCollections } = levelTwoCollection;
  const isFirstLevelOneCollection = levelTwoLevelOneCollections[0].levelOneCollection.cmsId === levelOneCollection.cmsId;
  const currentPageIndex = getCurrentIndex(levelOneCollection.pages, page);
  const currentLevelOneCollectionIndex = getL1CurrentIndex(levelTwoLevelOneCollections, levelOneCollection);
  const isFirstPage = currentPageIndex === 0;
  if (isFirstPage) {
    if (previousLevelTwoCollection) {
      if (currentLevelOneCollectionIndex === 0) {
        return truncateText(levelTwoCollection.title);
      }
    }
    if (isFirstLevelOneCollection) {
      return truncateText(levelTwoCollection.title);
    }else{
      return truncateText(levelTwoLevelOneCollections[currentLevelOneCollectionIndex - 1].levelOneCollection.title);
    }
  }
  return truncateText('');
};

export { nextLinkText, previousLinkText };
