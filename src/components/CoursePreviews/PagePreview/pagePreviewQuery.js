import { isEmpty, uniq, findIndex } from 'lodash';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { pagePreview } from '../../../graphql_states/contentstack';

const imageVideoAssociatedRecords = {
  imageIds: [],
  videoIds: [],
};

const findReference = (components, type) => (
  components.filter((obj) => obj.__typename === type)
);

const findCardReference = (components) => (
  components.filter((obj) => obj.__typename === 'PageComponentsComponentsCardReference' && !isEmpty(obj.card_reference))
);

const findImageReference = (components) => (
  components.filter((obj) => obj.__typename === 'PageComponentsComponentsImageReference' && !isEmpty(obj.image_reference))
);

const findVideoReference = (components) => (
  components.filter((obj) => obj.__typename === 'PageComponentsComponentsVideoReference' && !isEmpty(obj.video_reference))
);

const getCardComponents = (data, contentType) => {
  let componentRef = null;
  let result = [];
  switch (contentType) {
    case 'mainContent':
      componentRef = findCardReference(data.data.pagev4.main_content.components);
      break;
    case 'secondaryContent':
      componentRef = findCardReference(data.data.pagev4.secondary_content.components);
      break;
    case 'topConnectiveTissue':
      componentRef = findCardReference(data.connective_tissue.connective_tissue.components);
      break;
    case 'bottomConnectiveTissue':
      componentRef = findCardReference(data.connective_tissue.connective_tissue.components);
      break;

    default:
  }

  if (!isEmpty(componentRef)) {
    result = componentRef.map((obj) => (
      obj.card_reference.cardConnection.edges[0].node
    ));
  }
  return result;
};

const getComponents = (data, contentType) => {
  let result = [];
  switch (contentType) {
    case 'mainContent':
      result = data.data.pagev4.main_content.components;
      break;
    case 'secondaryContent':
      result = data.data.pagev4.secondary_content.components;
      break;
    case 'topConnectiveTissue':
      result = data.connective_tissue.connective_tissue.components;
      break;
    case 'bottomConnectiveTissue':
      result = data.connective_tissue.connective_tissue.components;
      break;
    default:
  }
  return result;
};


const updateCardAssociatedContentIds = (data, contentType) => {
  const cardConnections = getCardComponents(data, contentType);

  if (isEmpty(cardConnections)) return;

  cardConnections.forEach((cardConnection) => {
    let imageCardRefs = [];
    if (!isEmpty(cardConnection) && !isEmpty(cardConnection.components)) {
      const cardImageRefs1 = findImageReference(cardConnection.components.components);
      imageCardRefs = [...imageCardRefs, ...cardImageRefs1];
    }

    if (!isEmpty(cardConnection) && !isEmpty(cardConnection.secondary_content)) {
      const cardImageRefs2 = findImageReference(cardConnection.secondary_content.components);
      imageCardRefs = [...imageCardRefs, ...cardImageRefs2];
    }

    const imageCmsIds = imageCardRefs.map((obj) => (
      obj.image_reference.imageConnection.edges[0].node.system.uid
    ));

    if (!isEmpty(imageCmsIds)) {
      imageVideoAssociatedRecords.imageIds = [
        ...imageVideoAssociatedRecords.imageIds,
        ...imageCmsIds,
      ];
    }

    let videoCardRefs = [];
    if (!isEmpty(cardConnection) && !isEmpty(cardConnection.components)) {
      const cardVideoRefs1 = findVideoReference(cardConnection.components.components);
      videoCardRefs = [...videoCardRefs, ...cardVideoRefs1];
    }
    if (!isEmpty(cardConnection) && !isEmpty(cardConnection.secondary_content)) {
      const cardVideoRefs2 = findVideoReference(cardConnection.secondary_content.components);
      videoCardRefs = [...videoCardRefs, ...cardVideoRefs2];
    }

    const videoCmsIds = videoCardRefs.map((obj) => (
      obj.video_reference.videoConnection.edges[0].node.system.uid
    ));

    if (!isEmpty(videoCmsIds)) {
      imageVideoAssociatedRecords.videoIds = [
        ...imageVideoAssociatedRecords.videoIds,
        ...videoCmsIds,
      ];
    }
  });
};

const updateAssociatedContentOtherThanCardIds = (data, contentType) => {
  const components = getComponents(data, contentType);

  if (isEmpty(components)) return;
  const imagesReferences = findImageReference(components);

  if (!isEmpty(imagesReferences)) {
    const imagesReferenceCmsIds = imagesReferences.map((imagesReference) => imagesReference.image_reference.imageConnection.edges[0].node.system.uid);

    if (!isEmpty(imagesReferenceCmsIds)) {
      imageVideoAssociatedRecords.imageIds = [
        ...imageVideoAssociatedRecords.imageIds,
        ...imagesReferenceCmsIds,
      ];
    }
  }

  const videoReferences = findVideoReference(components);
  if (!isEmpty(videoReferences)) {
    if (!isEmpty(videoReferences)) {
      const videosReferenceCmsIds = videoReferences.map((videosReference) => videosReference.video_reference.videoConnection.edges[0].node.system.uid);

      if (!isEmpty(videosReferenceCmsIds)) {
        imageVideoAssociatedRecords.videoIds = [
          ...imageVideoAssociatedRecords.videoIds,
          ...videosReferenceCmsIds,
        ];
      }
    }
  }
};

const updateAssociatedContentIds = (data, contentType) => {
  updateCardAssociatedContentIds(data, contentType);
  updateAssociatedContentOtherThanCardIds(data, contentType);
};

const usePageQuery = (pageCmsId, locale) => {
  const mainContentResCard = useQuery(
    pagePreview.queries.GET_PAGE_PREVIEW_WITH_MAIN_CONTENT_CARD,
    { variables: { pageCmsId, locale: locale}, fetchPolicy: 'network-only' },
  );

  let mainContentRes = useQuery(
    pagePreview.queries.GET_PAGE_PREVIEW_WITH_MAIN_CONTENT,
    { variables: { pageCmsId, locale: locale}, fetchPolicy: 'network-only' },
  );

  const secondaryContentRes = useQuery(
    pagePreview.queries.GET_PAGE_PREVIEW_SECONDARY_CONTENT,
    { variables: { pageCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const otherMainContentRes = useQuery(
    pagePreview.queries.GET_PAGE_PREVIEW_OTHER_CONTENT_FOR_MAIN_CONTENT,
    { variables: { pageCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const otherSecondaryContentRes = useQuery(
    pagePreview.queries.GET_PAGE_PREVIEW_OTHER_CONTENT_FOR_SECONDARY_CONTENT,
    { variables: { pageCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const pageConnectiveTissueBasicInfo = useQuery(
    pagePreview.queries.GET_PAGE_CONNECTIVE_TISSUE_BASIC_INFO,
    { variables: { pageCmsId, locale }, fetchPolicy: 'network-only' },
  );

  // image: page main content
  const [mainContentImageQuery, {
    data: mainContentImageData,
    error: mainContentImageError,
    loading: mainContentImageLoading,
  }] = useLazyQuery(pagePreview.queries.GET_IMAGE_DATA);

  const [otherMainContentImageQuery, {
    data: otherMainContentImageData,
    error: otherMainContentImageError,
    loading: otherMainContentImageLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_IMAGE_DATA);
  // End image: page main content

  // image: page secondary content
  const [secondaryContentImageQuery, {
    data: secondaryContentImageData,
    error: secondaryContentImageError,
    loading: secondaryContentImageLoading,
  }] = useLazyQuery(pagePreview.queries.GET_IMAGE_DATA);

  const [otherSecondaryContentImageQuery, {
    data: otherSecondaryContentImageData,
    error: otherSecondaryContentImageError,
    loading: otherSecondaryContentImageLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_IMAGE_DATA);
  // End image: page secondary content

  // video: page main content
  const [mainContentVideoQuery, {
    data: mainContentVideoData,
    error: mainContentVideoError,
    loading: mainContentVideoLoading,
  }] = useLazyQuery(pagePreview.queries.GET_VIDEO_DATA);

  const [otherMainContentVideoQuery, {
    data: otherMainContentVideoData,
    error: otherMainContentVideoError,
    loading: otherMainContentVideoLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_VIDEO_DATA);
  // video: page main content

  // video: page secondary content
  const [secondaryContentVideoQuery, {
    data: secondaryContentVideoData,
    error: secondaryContentVideoError,
    loading: secondaryContentVideoLoading,
  }] = useLazyQuery(pagePreview.queries.GET_VIDEO_DATA);

  const [otherSecondaryContentVideoQuery, {
    data: otherSecondaryContentVideoData,
    error: otherSecondaryContentVideoError,
    loading: otherSecondaryContentVideoLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_VIDEO_DATA);
  // End video: page secondary content

// -----------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
  const [cardVideoAssociatedContentQuery, {
    data: cardVideoAssociatedContentData,
    error: cardVideoAssociatedContentError,
    loading: cardVideoAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_VIDEO_DATA);

  const [otherCardVideoAssociatedContentQuery, {
    data: otherCardVideoAssociatedContentData,
    error: otherCardVideoAssociatedContentError,
    loading: otherCardVideoAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_VIDEO_DATA);

  const [cardImageAssociatedContentQuery, {
    data: cardImageAssociatedContentData,
    error: cardImageAssociatedContentError,
    loading: cardImageAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_IMAGE_DATA);

  const [otherCardImageAssociatedContentQuery, {
    data: otherCardImageAssociatedContentData,
    error: otherCardImageAssociatedContentError,
    loading: otherCardImageAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_IMAGE_DATA);


  const [videoAssociatedContentQuery, {
    data: videoAssociatedContentData,
    error: videoAssociatedContentError,
    loading: videoAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_VIDEO_DATA);

  const [otherVideoAssociatedContentQuery, {
    data: otherVideoAssociatedContentData,
    error: otherVideoAssociatedContentError,
    loading: otherVideoAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_VIDEO_DATA);

  const [imageAssociatedContentQuery, {
    data: imageAssociatedContentData,
    error: imageAssociatedContentError,
    loading: imageAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_IMAGE_DATA);

  const [otherImageAssociatedContentQuery, {
    data: otherImageAssociatedContentData,
    error: otherImageAssociatedContentError,
    loading: otherImageAssociatedContentLoading,
  }] = useLazyQuery(pagePreview.queries.GET_OTHER_CONTENT_FOR_IMAGE_DATA);
  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------



  // ----------------------------------------------------------------------------

  // top connective tissue
  const [topConnectiveTissueQuery, {
    data: topConnectiveTissueData,
    error: topConnectiveTissueError,
    loading: topConnectiveTissueLoading,
  }] = useLazyQuery(pagePreview.queries.GET_CONNECTIVE_TISSUE);

  // bottom connective tissue
  const [bottomConnectiveTissueQuery, {
    data: bottomConnectiveTissueData,
    error: bottomConnectiveTissueError,
    loading: bottomConnectiveTissueLoading,
  }] = useLazyQuery(pagePreview.queries.GET_CONNECTIVE_TISSUE);

  // --------------------------------------------------------------------
  const isContentLoading = () => (
    mainContentRes.loading
    || mainContentResCard.loading
    || secondaryContentRes.loading
    || otherMainContentRes.loading
    || otherSecondaryContentRes.loading
    || pageConnectiveTissueBasicInfo.loading
    || topConnectiveTissueLoading
    || bottomConnectiveTissueLoading

    || cardVideoAssociatedContentLoading
    || otherCardVideoAssociatedContentLoading
    || cardImageAssociatedContentLoading
    || otherCardImageAssociatedContentLoading

    || videoAssociatedContentLoading
    || otherVideoAssociatedContentLoading
    || imageAssociatedContentLoading
    || otherImageAssociatedContentLoading
  );

  const getErrorInContent = () => (
    mainContentRes.error
    || mainContentResCard.error
    || secondaryContentRes.error
    || otherMainContentRes.error
    || otherSecondaryContentRes.error
    || pageConnectiveTissueBasicInfo.error
    || bottomConnectiveTissueError
    || topConnectiveTissueError

    || cardVideoAssociatedContentError
    || otherCardVideoAssociatedContentError
    || cardImageAssociatedContentError
    || otherCardImageAssociatedContentError

    || videoAssociatedContentError
    || otherVideoAssociatedContentError
    || imageAssociatedContentError
    || otherImageAssociatedContentError
  );


  if (!mainContentRes.loading && isEmpty(mainContentRes.error) && !isEmpty(mainContentRes.data)) {
    updateAssociatedContentIds(mainContentRes, 'mainContent');
  }

  if (!mainContentResCard.loading && isEmpty(mainContentResCard.error) && !isEmpty(mainContentResCard.data)) {
    updateAssociatedContentIds(mainContentResCard, 'mainContent');
  }

  if (!secondaryContentRes.loading && isEmpty(secondaryContentRes.error) && !isEmpty(secondaryContentRes.data)) {
    updateAssociatedContentIds(secondaryContentRes, 'secondaryContent');
  }

  const isMainContentResSuccess = !mainContentRes.loading && isEmpty(mainContentRes.error) && !isEmpty(mainContentRes.data)

  const mainContentResCardSuccess = !mainContentResCard.loading && isEmpty(mainContentResCard.error) && !isEmpty(mainContentResCard.data)

  if (isMainContentResSuccess && mainContentResCardSuccess) {
    const videosReference = findVideoReference(mainContentRes.data.pagev4.main_content.components);

    const videosReferenceCard = findVideoReference(mainContentResCard.data.pagev4.main_content.components);

    const videosReferenceCmsIds = videosReference.map((obj) => obj.video_reference.videoConnection.edges[0].node.system.uid);

    const videosReferenceCardCmsIds = videosReferenceCard.map((obj) => obj.video_reference.videoConnection.edges[0].node.system.uid);

    if (!mainContentVideoLoading && !mainContentVideoError && !mainContentVideoData) {
      mainContentVideoQuery({ variables: { videosReferenceCmsIds: [...videosReferenceCmsIds, ...videosReferenceCardCmsIds], locale } });
    }
    if (!otherMainContentVideoLoading && !otherMainContentVideoError && !otherMainContentVideoData) {
      otherMainContentVideoQuery({ variables: { videosReferenceCmsIds: [...videosReferenceCmsIds, ...videosReferenceCardCmsIds], locale } });
    }
  }

  if (!secondaryContentRes.loading && isEmpty(secondaryContentRes.error) && !isEmpty(secondaryContentRes.data)) {
    const videosReference = findVideoReference(secondaryContentRes.data.pagev4.secondary_content.components);
    const videosReferenceCmsIds = videosReference.map((obj) => obj.video_reference.videoConnection.edges[0].node.system.uid);
    if (!secondaryContentVideoLoading && !secondaryContentVideoError && !secondaryContentVideoData) {
      secondaryContentVideoQuery({ variables: { videosReferenceCmsIds, locale } });
    }
    if (!otherSecondaryContentVideoLoading && !otherSecondaryContentVideoError && !otherSecondaryContentVideoData) {
      otherSecondaryContentVideoQuery({ variables: { videosReferenceCmsIds, locale } });
    }
  }

  if (!pageConnectiveTissueBasicInfo.loading && isEmpty(pageConnectiveTissueBasicInfo.error)) {
    const topConnectiveTissueConnection = pageConnectiveTissueBasicInfo.data.pagev4.top_connective_tissueConnection.edges;
    if (!isEmpty(topConnectiveTissueConnection) && !topConnectiveTissueLoading && !topConnectiveTissueError && !topConnectiveTissueData) {
      const topConnectiveTissueCmsId = topConnectiveTissueConnection[0].node.system.uid;
      topConnectiveTissueQuery({ variables: { connectiveTissueCmsId: topConnectiveTissueCmsId, locale } });
    }

    if (topConnectiveTissueData) {
      updateAssociatedContentIds(topConnectiveTissueData, 'topConnectiveTissue');
    }

    const bottomConnectiveTissueConnection = pageConnectiveTissueBasicInfo.data.pagev4.bottom_connective_tissueConnection.edges;

    if (!isEmpty(bottomConnectiveTissueConnection) && !bottomConnectiveTissueLoading && !bottomConnectiveTissueError && !bottomConnectiveTissueData) {
      const bottomConnectiveTissueCmsId = bottomConnectiveTissueConnection[0].node.system.uid;
      bottomConnectiveTissueQuery({ variables: { connectiveTissueCmsId: bottomConnectiveTissueCmsId, locale } });
    }
    if (bottomConnectiveTissueData) {
      updateAssociatedContentIds(bottomConnectiveTissueData, 'bottomConnectiveTissue');
    }

  }


  if (!isContentLoading() && !getErrorInContent()) {
    if (!cardVideoAssociatedContentLoading && !cardVideoAssociatedContentError && !cardVideoAssociatedContentData) {
      cardVideoAssociatedContentQuery({ variables: { videosReferenceCmsIds: uniq(imageVideoAssociatedRecords.videoIds), locale } });
    }

    if (!otherCardVideoAssociatedContentLoading && !otherCardVideoAssociatedContentError && !otherCardVideoAssociatedContentData) {
      otherCardVideoAssociatedContentQuery({ variables: { videosReferenceCmsIds: uniq(imageVideoAssociatedRecords.videoIds), locale } });
    }

    if (!cardImageAssociatedContentLoading && !cardImageAssociatedContentError && !cardImageAssociatedContentData) {
      cardImageAssociatedContentQuery({ variables: { imagesReferenceCmsIds: uniq(imageVideoAssociatedRecords.imageIds), locale } });
    }

    if (!otherCardImageAssociatedContentLoading && !otherCardImageAssociatedContentError && !otherCardImageAssociatedContentData) {
      otherCardImageAssociatedContentQuery({ variables: { imagesReferenceCmsIds: uniq(imageVideoAssociatedRecords.imageIds), locale } });
    }
// ----------------------------------------------------
    if (!videoAssociatedContentLoading && !videoAssociatedContentError && !videoAssociatedContentData) {
      videoAssociatedContentQuery({ variables: { videosReferenceCmsIds: uniq(imageVideoAssociatedRecords.videoIds), locale } });
    }

    if (!otherVideoAssociatedContentLoading && !otherVideoAssociatedContentError && !otherVideoAssociatedContentData) {
      otherVideoAssociatedContentQuery({ variables: { videosReferenceCmsIds: uniq(imageVideoAssociatedRecords.videoIds), locale } });
    }

    if (!imageAssociatedContentLoading && !imageAssociatedContentError && !imageAssociatedContentData) {
      imageAssociatedContentQuery({ variables: { imagesReferenceCmsIds: uniq(imageVideoAssociatedRecords.imageIds), locale } });
    }

    if (!otherImageAssociatedContentLoading && !otherImageAssociatedContentError && !otherImageAssociatedContentData) {
      otherImageAssociatedContentQuery({ variables: { imagesReferenceCmsIds: uniq(imageVideoAssociatedRecords.imageIds), locale } });
    }
  }

  return {
    loading: false,
    mainContentData: mainContentRes.data,
    mainContentResCardData: mainContentResCard.data,
    secondaryContentData: secondaryContentRes.data,
    otherMainContentData: otherMainContentRes.data,
    otherSecondaryContentData: otherSecondaryContentRes.data,
    pageConnectiveTissueBasicInfoData: pageConnectiveTissueBasicInfo.data,
    isTopConnectiveTissue: (
      pageConnectiveTissueBasicInfo.data
      && !isEmpty(pageConnectiveTissueBasicInfo.data.pagev4.top_connective_tissueConnection.edges)
    ),
    isBottomConnectiveTissue: (
      pageConnectiveTissueBasicInfo.data
      && !isEmpty(
        pageConnectiveTissueBasicInfo.data.pagev4.bottom_connective_tissueConnection.edges,
      )
    ),
    topConnectiveTissueData,
    bottomConnectiveTissueData,
    secondaryContentVideoData,
    secondaryContentImageData,
    mainContentImageData,
    mainContentVideoData,
    otherSecondaryContentVideoData,
    otherSecondaryContentImageData,

    otherMainContentImageData,
    otherMainContentVideoData,

    cardVideoAssociatedContentData,
    otherCardVideoAssociatedContentData,
    cardImageAssociatedContentData,
    otherCardImageAssociatedContentData,

    imageVideoAssociatedRecords,

    videoAssociatedContentData,
    otherVideoAssociatedContentData,
    imageAssociatedContentData,
    otherImageAssociatedContentData,
    error: getErrorInContent(),
  };
};

const getCourseQuery = (courseType) => {
  let query = null;
  switch (courseType) {
    case 'l2':
      query = pagePreview.queries.GET_LEVEL_TWO_COURSE_WITH_BASIC_INFO;
      break;
    case 'l3':
      query = pagePreview.queries.GET_LEVEL_THREE_COURSE_WITH_BASIC_INFO;
      break;
    default:
  }

  return query;
};

const useCourseQueries = (
  courseType,
  courseCmsId,
  levelTwoCollectionCmsId,
  levelOneCollectionCmsId,
  locale,
) => {
  const courseRes = useQuery(
    getCourseQuery(courseType),
    { variables: { courseCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const levelTwoCollectionRes = useQuery(
    pagePreview.queries.GET_LEVEL_TWO_COLLECTION_WITH_BASIC_INFO,
    { variables: { levelTwoCollectionCmsId, locale }, fetchPolicy: 'network-only' },
  );

  const levelOneCollectionRes = useQuery(
    pagePreview.queries.GET_LEVEL_ONE_COLLECTION_WITH_BASIC_INFO,
    { variables: { levelOneCollectionCmsId, locale }, fetchPolicy: 'network-only' },
  );

  return {
    loading: courseRes.loading || levelTwoCollectionRes.loading || levelOneCollectionRes.loading,
    courseData: courseRes.data,
    levelTwoCollectionData: levelTwoCollectionRes.data,
    levelOneCollectionData: levelOneCollectionRes.data,
    error: courseRes.error || levelTwoCollectionRes.error || levelOneCollectionRes.error,
  };
};

export {
  usePageQuery,
  useCourseQueries,
};
