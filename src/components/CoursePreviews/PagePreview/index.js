import React from 'react';
import classNames from 'classnames';
import { isEmpty, uniq, findIndex } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';

import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../shared/AlertMessage';
import pagePreviewStyles from '../../lesson/lesson-page.module.scss';
import TimeLine from '../../time_line';
import Page from './Page';
import { getPageFormattedData } from './pageCmsDataFormatter';
import { usePageQuery } from './pagePreviewQuery';
import { pagePreview } from '../../../graphql_states/contentstack';

const sampleItems = [
  {
    id: '1',
    title: 'LevelOneCollection-101',
    status: 'completed',
    position: 1,
    __typename: 'LevelOneCollection',
  },
  {
    id: '2',
    title: 'LevelOneCollection-202',
    status: 'inProgress',
    position: 2,
    __typename: 'LevelOneCollection',
  },
  {
    id: '3',
    title: 'LevelOneCollection-303',
    status: 'open',
    position: 3,
    __typename: 'LevelOneCollection',
  },
  {
    id: '4',
    title: 'LevelOneCollection-404',
    status: 'open',
    position: 4,
    __typename: 'LevelOneCollection',
  },
  {
    id: '5',
    title: 'LevelOneCollection-505',
    status: 'open',
    position: 5,
    __typename: 'LevelOneCollection',
  },
];

const isConnectiveTissueLoaded = (isConnectiveTissue, connectiveTissueData) => (
  isConnectiveTissue ? isConnectiveTissue && connectiveTissueData : true
);

const getCardReferences = (components) => components.filter((c) => c.__typename === 'PageComponentsComponentsCardReference' && !isEmpty(c.card_reference));

const getUids = (nodes) => nodes.map(({ system }) => system.uid);

const mergeTwoArrays = (data, oldComponents, type) => {
  if (!isEmpty(data)) {
    switch (type) {
      case 'main_content':
        return oldComponents.concat(data.pagev4.main_content.components);
      case 'secondary_content':
        return oldComponents.concat(data.pagev4.secondary_content.components);
      case 'connective_tissue':
        return oldComponents.concat(data.connective_tissue.connective_tissue.components);
      default:
        console.log('type not matched');
    }
  }

  return oldComponents;
};

const getUidOfCardReferenceFrom = (mainContentData, secondaryContentData, otherMainContentData, otherSecondaryContentData, bottomConnectiveTissueData, topConnectiveTissueData) => {
  let componentsData = mergeTwoArrays(mainContentData, [], 'main_content');
  componentsData = mergeTwoArrays(secondaryContentData, componentsData, 'secondary_content');
  componentsData = mergeTwoArrays(otherMainContentData, componentsData, 'main_content');
  componentsData = mergeTwoArrays(otherSecondaryContentData, componentsData, 'secondary_content');
  componentsData = mergeTwoArrays(bottomConnectiveTissueData, componentsData, 'connective_tissue');
  componentsData = mergeTwoArrays(topConnectiveTissueData, componentsData, 'connective_tissue');
  componentsData = getCardReferences(componentsData);

  const cardConnections = componentsData.map(({ card_reference }) => card_reference.cardConnection);
  const cardEdges = cardConnections.map(({ edges }) => edges).flat();
  const cardNodes = cardEdges.map(({ node }) => node);
  return uniq(getUids(cardNodes));
};

const PagePreview = ({
  pageCmsId,
  nextPageUrl,
  previousPageUrl,
  locale,
}) => {
  let formattedData = {};

  const [getCardDetails, { data: cardData, error: cardError, loading: cardLoading }] = useLazyQuery(pagePreview.queries.GET_CARD_DETAILS);

  const {
    loading,
    mainContentData,
    mainContentResCardData,
    secondaryContentData,
    otherMainContentData,
    otherSecondaryContentData,
    pageConnectiveTissueBasicInfoData,
    isTopConnectiveTissue,
    isBottomConnectiveTissue,
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

    videoAssociatedContentData,
    otherVideoAssociatedContentData,
    imageAssociatedContentData,
    otherImageAssociatedContentData,
    error,
  } = usePageQuery(pageCmsId, locale);

  if (
    mainContentData
    && mainContentResCardData
    && secondaryContentData
    && otherMainContentData
    && otherSecondaryContentData
    && pageConnectiveTissueBasicInfoData
    // && secondaryContentImageData
    // && secondaryContentVideoData
    && mainContentVideoData
    // && otherSecondaryContentImageData
    // && otherSecondaryContentVideoData
    && otherMainContentVideoData
    && isConnectiveTissueLoaded(isTopConnectiveTissue, topConnectiveTissueData)
    && isConnectiveTissueLoaded(isBottomConnectiveTissue, bottomConnectiveTissueData)
  ) {


    let mainContentResData = Object.assign({}, mainContentData)
    const components = mainContentData.pagev4.main_content.components;
    const mainContentDataComponents = components.map((component, index) => {
      if(component.__typename === 'PageComponentsComponentsCardReference' && isEmpty(component.card_reference)){
        return(mainContentResCardData.pagev4.main_content.components[index])
      }else{
        return(component)
      }
    })

    let {main_content} = mainContentResData.pagev4;
    main_content = {...main_content, ...{components: mainContentDataComponents}}
    let pagev4 = {...mainContentResData.pagev4, ...{main_content: main_content}}
    mainContentResData = {pagev4: pagev4}

    const uids = getUidOfCardReferenceFrom(mainContentResData, secondaryContentData, otherMainContentData, otherSecondaryContentData, bottomConnectiveTissueData, topConnectiveTissueData);

    if (!cardLoading && !cardError && !cardData) {
      getCardDetails({ variables: { cardCmsIds: uids, locale } });
    }

    if (cardData) {
      formattedData = getPageFormattedData(mainContentResData, secondaryContentData, otherMainContentData, otherSecondaryContentData, pageConnectiveTissueBasicInfoData, bottomConnectiveTissueData, topConnectiveTissueData, mainContentImageData, secondaryContentImageData, secondaryContentVideoData, mainContentVideoData, otherMainContentImageData, otherSecondaryContentImageData, otherSecondaryContentVideoData, otherMainContentVideoData, cardData.all_card.items, cardVideoAssociatedContentData, otherCardVideoAssociatedContentData, cardImageAssociatedContentData, otherCardImageAssociatedContentData, videoAssociatedContentData, otherVideoAssociatedContentData, imageAssociatedContentData, otherImageAssociatedContentData);
    }
  }

  if (loading) return <Loader />;

  if (error) {
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={!isEmpty(error) && error.graphQLErrors}
      />
    );
  }

  return (
    !isEmpty(formattedData)
      ? (
        <div className={classNames(pagePreviewStyles['lesson-container'], 'pb-5')}>
          <TimeLine
            items={sampleItems}
            currentItem={sampleItems[0]}
            nextItemTitle="Next title"
            onTimeLineItemChange={() => {}}
          >
            <Page
              pageData={formattedData.page}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          </TimeLine>
        </div>
      )
      : null
  );
};

export default PagePreview;
