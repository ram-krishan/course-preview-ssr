import { isEmpty } from 'lodash';

const nodes = (item) => (
  item.edges.map((edge) => edge.node)
);

const getId = (data) => data.system.uid;

const getFormattedTopicsData = (topics) => {
  if (isEmpty(topics)) return null;

  return topics.map((topic) => ({
    id: getId(topic),
    title: topic.title,
    display_title: topic.metadata.display_title,
  }));
};

const getIndexOf = (collection, lvl2CollectionCmsId) => collection.findIndex((t) => t.id === lvl2CollectionCmsId);

const getLvl1CollectionNodes = (lvl2Collection) => nodes(lvl2Collection.lessonsConnection);

const getFirstLvl1CollectionCmsId = (lvl2Collection) => {
  const lvl1CollectionNodes = getLvl1CollectionNodes(lvl2Collection);
  if (!isEmpty(lvl1CollectionNodes[0])) {
    return lvl1CollectionNodes[0].system.uid;
  }
};

const getFirstPageCmsIdOfLvl1 = (lvl2Collection) => {
  const lvl1CollectionNodes = getLvl1CollectionNodes(lvl2Collection);
  if (!isEmpty(lvl1CollectionNodes[0])) {
    const pageNodes = nodes(lvl1CollectionNodes[0].pagesConnection);
    if (!isEmpty(pageNodes[0])) {
      return pageNodes[0].system.uid;
    }
  }
};

const isFirstCollection = (collectionUids, uid) => collectionUids.indexOf(uid) === 0;

const getL2CollectionAndUids = (level3, l3Uid) => {
  const currentL3 = level3.find((l3) => getId(l3) === l3Uid);
  const currentL2s = nodes(currentL3.sub_topicsConnection);
  const l2CollectionUids = currentL2s.map((l2) => getId(l2));
  return [currentL2s, l2CollectionUids];
};

const getPrevLevelTwoAndUidForL3AndL4Course = (allLevel2Collection, level3, level4, lvl2CollectionCmsId, l3CollectionCmsId, l4CollectionCmsId) => {
  let l3CollectionUids;
  let l2CollectionUids;
  let l4CollectionUids;
  let l2Index;
  let l3Index;
  let l4Index;
  let l2Uid = null;
  let l3Uid = l3CollectionCmsId;
  let l4Uid = l4CollectionCmsId;
  let currentL2s = null;
  if (!isEmpty(level3)) {
    l3CollectionUids = level3.map((l3) => getId(l3));
    l3Index = l3CollectionUids.indexOf(l3Uid);
    [currentL2s, l2CollectionUids] = getL2CollectionAndUids(level3, l3Uid);
    l2Index = l2CollectionUids.indexOf(lvl2CollectionCmsId);
  }
  if (!isFirstCollection(l2CollectionUids, lvl2CollectionCmsId)) {
    l2Uid = l2CollectionUids[l2Index - 1];
  } else if (!isFirstCollection(l3CollectionUids, l3Uid)) {
    l3Uid = l3CollectionUids[l3Index - 1];
    [currentL2s, l2CollectionUids] = getL2CollectionAndUids(level3, l3Uid);
    // eslint-disable-next-line prefer-destructuring
    l2Uid = l2CollectionUids.slice(-1)[0];
  } else if (!isEmpty(level4)) {
    l4CollectionUids = level4.map((l4) => getId(l4));
    if (!isFirstCollection(l4CollectionUids, l4Uid)) {
      l4Index = l4CollectionUids.indexOf(l4Uid);
      l4Uid = l4CollectionUids[l4Index - 1];
      const currentL4 = level4.find((l4) => getId(l4) === l4Uid);
      const l3Nodes = nodes(currentL4.topicsConnection);
      l3CollectionUids = l3Nodes.map((l3) => getId(l3));
      [currentL2s, l2CollectionUids] = getL2CollectionAndUids(l3Nodes, l3CollectionUids[0]);
      // eslint-disable-next-line prefer-destructuring
      l2Uid = l2CollectionUids.slice(-1)[0];
    }
  }
  return [currentL2s, l2Uid];
};

const getLastCompletedTitle = (prevL2Collections, prevL2CmsId, courseType, assessmentData) => {
  if (!isEmpty(prevL2Collections) && !isEmpty(prevL2CmsId)) {
    let formattedL2;
    const formattedTopicsData = getFormattedTopicsData(prevL2Collections);
    const index = getIndexOf(formattedTopicsData, prevL2CmsId);
    if (courseType === 'Level2Course' && index > 0) {
      formattedL2 = formattedTopicsData[index - 1];
      return formattedL2.display_title || formattedL2.title;
    }
    if (courseType !== 'Level2Course') {
      formattedL2 = formattedTopicsData[index];
      return formattedL2.display_title || formattedL2.title;
    }
  }
  if (isEmpty(assessmentData)) {
    return null;
  }
  return assessmentData[0].display_title || assessmentData[0].title;
};

const getNextTopicText = (level2CollectionData) => {
  let lvl2Obj = {};
  lvl2Obj = level2CollectionData.level_2;
  const introNode = nodes(lvl2Obj.metadata.intro_textConnection)[0];
  if (!isEmpty(introNode)) {
    return introNode.text;
  }
  const lessonNode = getLvl1CollectionNodes(lvl2Obj);
  if (!isEmpty(lessonNode[0])) {
    return lessonNode[0].metadata.display_title || lessonNode[0].title;
  }
};

const getLevelCourseData = (courseData, type) => {
  let data = [];
  switch (type) {
    case 'Level2Course':
      data = courseData.level_2_course;
      break;
    case 'Level3Course':
      data = courseData.level_3_course;
      break;
    case 'Level4Course':
      data = courseData.level_4_course;
      break;
    default:
      throw new Error(`Sorry, we are out of ${type}.`);
  }

  return data;
};

const getSubTopics = (nodeCollection) => nodeCollection.map((nc) => nc.sub_topicsConnection);

// for l4 course data
const getTopicNodesWithL3AndL4 = (chapterConnection) => {
  const chapterNodes = nodes(chapterConnection);
  let l3Collection = chapterNodes.map((lc) => lc.topicsConnection);
  l3Collection = l3Collection.map((cn) => nodes(cn)).flat();
  const subTopics = getSubTopics(l3Collection);
  return [subTopics.map((st) => nodes(st)).flat(), l3Collection, chapterNodes];
};


const getL2AndL3AndL4Collections = (lvlCourseData, courseType, contentType) => {
  let topicNodes;
  let level3;
  let level4;
  if (['Level2Course', 'Level3Course'].includes(courseType)) {
    if (contentType === 'core') {
      topicNodes = nodes(lvlCourseData.topicsConnection);
    } else {
      topicNodes = nodes(lvlCourseData.enrichment_topicsConnection);
    }
    if (courseType === 'Level3Course') {
      level3 = topicNodes;
      const subTopics = getSubTopics(topicNodes);
      topicNodes = subTopics.map((st) => nodes(st)).flat();
    }
  }

  if (courseType === 'Level4Course') {
    if (contentType === 'core') {
      [topicNodes, level3, level4] = getTopicNodesWithL3AndL4(lvlCourseData.chaptersConnection);
    } else {
      [topicNodes, level3, level4] = getTopicNodesWithL3AndL4(lvlCourseData.enrichment_chaptersConnection);
    }
  }
  return [topicNodes, level3, level4];
};

const getCourseCmsFormattedData = (courseData, level2CollectionData, courseType, contentType, lvl2CollectionCmsId, levelThreeCollectionCmsId, levelFourCollectionCmsId, courseCmsId) => {
  const lvlCourseData = getLevelCourseData(courseData, courseType);
  const [lvl2Collections, level3, level4] = getL2AndL3AndL4Collections(lvlCourseData, courseType, contentType);
  let prevL2Collections = lvl2Collections;
  let prevL2CmsId = lvl2CollectionCmsId;
  if (courseType !== 'Level2Course') {
    [prevL2Collections, prevL2CmsId] = getPrevLevelTwoAndUidForL3AndL4Course(lvl2Collections, level3, level4, lvl2CollectionCmsId, levelThreeCollectionCmsId, levelFourCollectionCmsId);
  }
  const assessmentData = nodes(lvlCourseData.metadata.assessmentConnection);
  const lvl2Collection = level2CollectionData.level_2;

  return {
    data: {
      assessmentActivityPoints:
        (assessmentData[0] && assessmentData[0].activity_points.activity_points),
      lastCompletedTitle:
        getLastCompletedTitle(prevL2Collections, prevL2CmsId, courseType, assessmentData),
      prevLvl2CollectionCmsId: prevL2CmsId,
      nextTopicText: getNextTopicText(level2CollectionData),
      courseType,
      courseCmsId,
      contentType,
      levelTwoCollectionCmsId: lvl2CollectionCmsId,
      levelOneCollectionCmsId: getFirstLvl1CollectionCmsId(lvl2Collection),
      pageCmsId: getFirstPageCmsIdOfLvl1(lvl2Collection),
    },
  };
};

export default getCourseCmsFormattedData;
