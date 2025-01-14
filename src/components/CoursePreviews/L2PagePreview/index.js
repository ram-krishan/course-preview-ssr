/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import { isEmpty } from 'lodash';
import PagePreview from '../PagePreview';
import { getCollectionUids, formatCollection } from '../Course/shared';
import Loader from '../../../components/shared/Loader';
import {
  getNextLevelCollectionCmsId,
  getLevelTwoCollection,
  getLevelTwoCollections,
  isNextL1PresentInL2,
  isLastContent,
  getIndexOf,
  isFirstLevelOne,
  isFirstPage,
  getPagesUids,
  findLevelOneCollection,
  getLevelOneCollectionUids,
} from './shared';


const getNextPageUrl = async (courseType,
  courseCmsId,
  contentType,
  levelTwoCollectionCmsId,
  levelOneCollectionCmsId,
  pageCmsId,
  client,
  locale) => {
  const levelTwoCollection = await getLevelTwoCollection(levelTwoCollectionCmsId, client, locale);
  const levelOneCollections = formatCollection(levelTwoCollection.lessonsConnection);
  const levelOneCollectionIndex = levelOneCollections.findIndex((l1) => l1.system.uid === levelOneCollectionCmsId);
  let levelOneCollection = levelOneCollections[levelOneCollectionIndex];
  let pageCmsIds = getCollectionUids(levelOneCollection.pagesConnection);
  const [examCmsId] = getCollectionUids(levelTwoCollection.examConnection);

  if (isLastContent(pageCmsIds, pageCmsId)) {
    if (isNextL1PresentInL2(levelTwoCollection, levelOneCollectionCmsId)) {
      levelOneCollection = levelOneCollections[levelOneCollectionIndex + 1];
      pageCmsIds = getCollectionUids(levelOneCollection.pagesConnection);
      return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${levelOneCollection.system.uid}/page/${pageCmsIds[0]}/preview`);
    }
    // Exam
    if (!isEmpty(examCmsId)) {
      return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/ll1/${levelOneCollectionCmsId}/lp/${pageCmsId}/exam/${examCmsId}/preview`);
    }

    const l2Course = await getLevelTwoCollections(courseCmsId, client, locale);
    const coreLevelTwoCollectionUids = getCollectionUids(l2Course.topicsConnection);
    const enrichmentLevelTwoCollectionUids = getCollectionUids(l2Course.enrichment_topicsConnection);

    const [nextContentType, nextLevelTwoCollectionUid] = getNextLevelCollectionCmsId(contentType, coreLevelTwoCollectionUids, enrichmentLevelTwoCollectionUids, levelTwoCollectionCmsId);
    // has next l2
    if (!isEmpty(nextLevelTwoCollectionUid)) {
      return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${nextContentType}/l2/${nextLevelTwoCollectionUid}/preview`);
    }
    return (null);
  }
  const pageIndex = pageCmsIds.findIndex((pid) => pid === pageCmsId);
  return (`/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${levelOneCollectionCmsId}/page/${pageCmsIds[pageIndex + 1]}/preview`);
};

const getPreviousPageUrl = async (courseType,
  courseCmsId,
  contentType,
  levelTwoCollectionCmsId,
  levelOneCollectionCmsId,
  pageCmsId,
  client,
  locale) => {
  const levelTwoCollection = await getLevelTwoCollection(levelTwoCollectionCmsId, client, locale);
  const l1Collections = formatCollection(levelTwoCollection.lessonsConnection);

  const l1CollectionUids = getLevelOneCollectionUids(levelTwoCollection);
  const currentL1 = findLevelOneCollection(l1Collections, levelOneCollectionCmsId);
  let pageUids = getPagesUids(currentL1);

  // if current l1 is first l1 of current l2 and current page is first page of l1
  if (isFirstLevelOne(l1CollectionUids, levelOneCollectionCmsId) && isFirstPage(pageUids, pageCmsId)) {
    // current l2 preview link
    return `/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/preview`;
  }

  // if current l1 is not first l1 of current l2 and current page is first page of l1
  if (!isFirstLevelOne(l1CollectionUids, levelOneCollectionCmsId) && isFirstPage(pageUids, pageCmsId)) {
    const currentL1Index = getIndexOf(l1CollectionUids, levelOneCollectionCmsId);
    const prevL1Uid = l1CollectionUids[currentL1Index - 1];
    const prevL1 = findLevelOneCollection(l1Collections, prevL1Uid);
    pageUids = getPagesUids(prevL1);
    // previous l1 page url
    return `/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${prevL1Uid}/page/${pageUids.slice(-1)[0]}/preview`;
  }

  const currentPageIndex = getIndexOf(pageUids, pageCmsId);
  // previous page url of current l1
  return `/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${levelOneCollectionCmsId}/page/${pageUids[currentPageIndex - 1]}/preview`;
};

const L2PagePreview = () => {
  const [loadingContent, setLoadingContent] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const client = useApolloClient();
  const {
    courseType,
    courseCmsId,
    contentType,
    levelTwoCollectionCmsId,
    levelOneCollectionCmsId,
    pageCmsId,
    locale,
  } = useParams();

  const asyncFetchCourseData = async () => {
    const nextUrl = await getNextPageUrl(
      courseType,
      courseCmsId,
      contentType,
      levelTwoCollectionCmsId,
      levelOneCollectionCmsId,
      pageCmsId,
      client,
      locale,
    );
    setNextPageUrl(nextUrl);
    setLoadingContent(false);
  };

  const asyncFetchPreviousData = async () => {
    const previousPageUrl = await getPreviousPageUrl(
      courseType,
      courseCmsId,
      contentType,
      levelTwoCollectionCmsId,
      levelOneCollectionCmsId,
      pageCmsId,
      client,
      locale,
    );
    setPrevPageUrl(previousPageUrl);
    setLoadingContent(false);
  };

  useEffect(() => {
    asyncFetchCourseData();
    asyncFetchPreviousData();
  }, [pageCmsId]);

  if (loadingContent) return <Loader />;

  return (
    <>
      <PagePreview
        nextPageUrl={nextPageUrl}
        previousPageUrl={prevPageUrl}
        pageCmsId={pageCmsId}
        locale={locale}
      />
    </>
  );
};

export default L2PagePreview;
