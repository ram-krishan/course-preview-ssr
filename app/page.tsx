import Image from "next/image";
import styles from "./page.module.css";

import { gql } from "@apollo/client";
import createApolloClient from "../apollo_client";
import  Layout from '../src/layout';
import  LessagePage from '../src/lesson_page';


import {
  Row,
  Col,
} from 'react-bootstrap';

export const getContries = (async () => {

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


  return [{name: 'india'}]
})

export default async function Home() {
  const countries = await getContries();

  return (
    <Row className="mx-0" style={{ backgroundColor: '#cbd5e0', minHeight: '100vh' }}>
          <Col className="px-0">
            <div id="custom-prompt" />
            <Layout>
              <LessagePage />
            </Layout>
          </Col>
        </Row>
  );
}
