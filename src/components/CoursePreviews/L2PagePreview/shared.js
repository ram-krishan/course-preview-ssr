import { isEmpty } from 'lodash';
import { pagePreview } from '../../../graphql_states/contentstack';
import { getCollectionUids } from '../Course/shared';

const getNextLevelCollectionCmsId = (contentType, coreLevelCollectionUids, enrichmentLevelCollectionUids, objId) => {
  let index = null;
  let id = null;
  if (contentType === 'core') {
    index = coreLevelCollectionUids.indexOf(objId);
    id = coreLevelCollectionUids[index + 1];
    if (isEmpty(id) && !isEmpty(enrichmentLevelCollectionUids)) {
      [id] = enrichmentLevelCollectionUids;
      return (['enrichment', id]);
    }
    return ([contentType, id]);
  }
  index = enrichmentLevelCollectionUids.indexOf(objId);
  id = enrichmentLevelCollectionUids[index + 1];
  return (['enrichment', id]);
};

const getLevelTwoCollection = async (levelTwoCollectionCmsId, client, locale) => {
  const levelTwoCollection = await client.query({
    query: pagePreview.queries.GET_LEVEL_TWO_COLLECTION_WITH_PAGES,
    variables: {
      levelTwoCollectionCmsId,
      locale,
    },
    fetchPolicy: 'network-only',
  });
  return (levelTwoCollection.data.level_2);
};

const getLevelTwoCollections = async (courseCmsId, client, locale) => {
  const l2Course = await client.query({
    query: pagePreview.queries.GET_LEVEL_TWO_COURSE_WITH_TWO,
    variables: {
      courseCmsId,
      locale,
    },
    fetchPolicy: 'network-only',
  });
  return (l2Course.data.level_2_course);
};

const isNextL1PresentInL2 = (levelTwoCollection, levelOneCollectionCmsId) => {
  const levelOneCollectionIds = getCollectionUids(levelTwoCollection.lessonsConnection);
  return (!(levelOneCollectionIds.slice(-1)[0] === levelOneCollectionCmsId));
};

const isLastContent = (collectionsIds, elementId) => (collectionsIds.slice(-1)[0] === elementId);

const getL3CourseWithTwo = async (courseCmsId, client, locale) => {
  const l3Course = await client.query({
    query: pagePreview.queries.GET_LEVEL_THREE_COURSE_WITH_THREE,
    variables: {
      courseCmsId,
      locale
    },
    fetchPolicy: 'network-only',
  });
  return (l3Course.data.level_3_course);
};

const getLevelThreeCollection = async (levelThreeCollectionCmsId, client, locale) => {
  const levelThreeCollection = await client.query({
    query: pagePreview.queries.GET_LEVEL_THREE_COLLECTION_WITH_TWO,
    variables: {
      levelThreeCollectionCmsId,
      locale
    },
    fetchPolicy: 'network-only',
  });
  return (levelThreeCollection.data.level_3);
};

const getIndexOf = (uids, uid) => uids.indexOf(uid);
const isFirstLevelOne = (levelOneCollectionUids, levelOneCollectionCmsId) => {
  const l1Index = getIndexOf(levelOneCollectionUids, levelOneCollectionCmsId);
  return l1Index === 0;
};

const isFirstPage = (pageUids, pageCmsId) => {
  const pageIndex = getIndexOf(pageUids, pageCmsId);
  return pageIndex === 0;
};

const getPagesUids = (levelOneCollection) => getCollectionUids(levelOneCollection.pagesConnection);

const findLevelOneCollection = (levelOneCollections, l1Uid) => levelOneCollections.find((l1) => l1.system.uid === l1Uid);

const getLevelOneCollectionUids = (levelTwoCollection) => getCollectionUids(levelTwoCollection.lessonsConnection);

export {
  getNextLevelCollectionCmsId,
  getLevelTwoCollection,
  getLevelTwoCollections,
  isNextL1PresentInL2,
  isLastContent,
  getL3CourseWithTwo,
  getLevelThreeCollection,
  getIndexOf,
  isFirstLevelOne,
  isFirstPage,
  getPagesUids,
  findLevelOneCollection,
  getLevelOneCollectionUids,
};
