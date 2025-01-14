import {
  Row,
  Col,
} from 'react-bootstrap';

// export const getContries = (async () => {

//   const client = createApolloClient();

//   // const [getCardDetails, { data: cardData, error: cardError, loading: cardLoading }] = useLazyQuery(pagePreview.queries.GET_CARD_DETAILS);

//   const {
//     loading,
//     mainContentData,
//     mainContentResCardData,
//     secondaryContentData,
//     otherMainContentData,
//     otherSecondaryContentData,
//     pageConnectiveTissueBasicInfoData,
//     isTopConnectiveTissue,
//     isBottomConnectiveTissue,
//     topConnectiveTissueData,
//     bottomConnectiveTissueData,
//     secondaryContentVideoData,
//     secondaryContentImageData,
//     mainContentImageData,
//     mainContentVideoData,
//     otherSecondaryContentVideoData,
//     otherSecondaryContentImageData,
//     otherMainContentImageData,
//     otherMainContentVideoData,

//     cardVideoAssociatedContentData,
//     otherCardVideoAssociatedContentData,
//     cardImageAssociatedContentData,
//     otherCardImageAssociatedContentData,

//     videoAssociatedContentData,
//     otherVideoAssociatedContentData,
//     imageAssociatedContentData,
//     otherImageAssociatedContentData,
//     error,
//   } = getPageData('blt61c55c1b2a5c3042', 'en-us', client);


//   return {loading,
//     mainContentData,
//     mainContentResCardData,
//     secondaryContentData,
//     otherMainContentData,
//     otherSecondaryContentData,
//     pageConnectiveTissueBasicInfoData,
//     isTopConnectiveTissue,
//     isBottomConnectiveTissue,
//     topConnectiveTissueData,
//     bottomConnectiveTissueData,
//     secondaryContentVideoData,
//     secondaryContentImageData,
//     mainContentImageData,
//     mainContentVideoData,
//     otherSecondaryContentVideoData,
//     otherSecondaryContentImageData,
//     otherMainContentImageData,
//     otherMainContentVideoData,

//     cardVideoAssociatedContentData,
//     otherCardVideoAssociatedContentData,
//     cardImageAssociatedContentData,
//     otherCardImageAssociatedContentData,

//     videoAssociatedContentData,
//     otherVideoAssociatedContentData,
//     imageAssociatedContentData,
//     otherImageAssociatedContentData,
//     error
//   }
// })

export default async function Home() {
  // const data = await getContries();

  return (
    <Row className="mx-0" style={{ backgroundColor: '#cbd5e0', minHeight: '100vh' }}>
      <Col className="px-0">
        <div id="custom-prompt" />
        {/* <Layout> */}
          <h1> Hello</h1>
          {/* {JSON.stringify(data, undefined, 2)} */}
        {/* </Layout> */}
      </Col>
    </Row>
  );
}
