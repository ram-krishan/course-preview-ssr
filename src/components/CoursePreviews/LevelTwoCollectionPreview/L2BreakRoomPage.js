import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import {
  Card, Row, Col, Button, Container,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';

import AlertMessage from '../../shared/AlertMessage';
import Loader from '../../shared/Loader';
import styles from '../../learn/learn-page.module.scss';
import { levelTwoCollectionPreview } from '../../../graphql_states/contentstack';
// import useSuperScript from '../../shared/hooks/useSuperScript';

const L2BreakRoomPage = ({
  courseData,
  l3CollectionCmsId,
  l4CollectionCmsId,
  locale }) => {
  // useSuperScript();
  const history = useHistory();
  const {
    lastCompletedTitle,
    prevLvl2CollectionCmsId,
    nextTopicText,
    assessmentActivityPoints,
    courseCmsId,
    courseType,
    levelTwoCollectionCmsId,
    levelOneCollectionCmsId,
    contentType,
    pageCmsId,
  } = courseData;

  const { data, error, loading } = useQuery(levelTwoCollectionPreview.queries.GET_LEVEL_TWO_COLLECTION_OUTRO_TEXT,
    {
      variables: { levelTwoCollectionCmsId: prevLvl2CollectionCmsId, locale: locale },
      fetchPolicy: 'network-only',
      skip: isEmpty(prevLvl2CollectionCmsId),
    });

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

  const nodes = (item) => (
    item.edges.map((edge) => edge.node)
  );

  let level2 = null;
  if (!isEmpty(data)) {
    level2 = data.level_2;
  }

  const getOutroText = () => {
    if (isEmpty(level2)) {
      return null;
    }
    const outroTextNode = nodes(level2.metadata.outro_textConnection)[0];
    if (!isEmpty(outroTextNode)) {
      return outroTextNode.text;
    }
    return null;
  };

  const getActivityPoints = () => {
    let points;
    if (isEmpty(prevLvl2CollectionCmsId)) {
      points = assessmentActivityPoints;
    } else {
      points = level2.activity_points.activity_points;
    }
    if (points == null || isNaN(points)) {
      return 0;
    }
    return points;
  };

  const handleNextLvl1Request = () => {
    if (isEmpty(levelOneCollectionCmsId)) {
      alert(`You cannot continue because L1Collections are not available for L2Collection cms_id ${levelTwoCollectionCmsId}, please check this on content-stack and ensure its published.`)
      return;
    }

    if (isEmpty(pageCmsId)) {
      alert(`You cannot continue because Pages are not available for L1Collection cms_id ${levelOneCollectionCmsId}, please check this on content-stack and ensure its published.`)
      return;
    }

    let pageUrl;
    switch (courseType) {
      case 'Level2Course':
        pageUrl = `/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l2/${levelTwoCollectionCmsId}/l1/${levelOneCollectionCmsId}/page/${pageCmsId}/preview`;
        break;
      case 'Level3Course':
        pageUrl = `/course-preview/${locale}/${courseType}/${courseCmsId}/${contentType}/l3/${l3CollectionCmsId}/l2/${levelTwoCollectionCmsId}/l1/${levelOneCollectionCmsId}/page/${pageCmsId}/preview`;
        break;
      default:
        throw new Error(`Sorry, we are out of ${courseType}.`);
    }
    if (!isEmpty(pageUrl)) {
      history.push(pageUrl);
    }
  };

  return (
    <Container>
      <Card className={classNames(styles['level-two-break-card'])}>
        <Card className={classNames(styles['level-two-break-points'])}>
          <Card.Body className={styles['level-two-collection-details']}>
            <h3><h1 id="levelTwoBreakPage.message.greatJob" /></h3>
            <p data-testid="previous-l2-coll-title" className="mt-4">
              <h1
                id="levelTwoBreakPage.message.youCompleted"
                values={{
                  completedTitle: <span dangerouslySetInnerHTML={{ __html: lastCompletedTitle }} />,
                }}
              />
            </p>
            <p className={classNames(styles['activity-point-text'], 'mt-5')}>
              <h1 id="levelTwoBreakPage.heading.youEarned" />
              {getActivityPoints()}
              {' '}
              { <h1 id="levelTwoBreakPage.heading.activityPoints" />}
              {' '}

            </p>
          </Card.Body>
        </Card>
        { !isEmpty(getOutroText())
          ? (
            <Card.Body className="w-75 mx-auto py-5 my-3">
              <Card.Text className={classNames(styles['you-learned-text'], 'mt-4')}>
                <div dangerouslySetInnerHTML={{ __html: getOutroText() }} />
              </Card.Text>
            </Card.Body>
          )
          : null}
      </Card>

      <Row>
        <Col>
          <div className={classNames(styles['to-do-next-heading'], 'pt-5 pb-4')}>
            <h5>
              <h1 id="levelTwoBreakPage.message.nextLikeMessage" />
            </h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className={classNames(styles['level-two-break-card'], 'h-100')}>
            <Card.Body className="text-center py-4">
              <Card.Title className={classNames(styles['to-do-next-sub-heading'])}><h1 id="levelTwoBreakPage.heading.todayPage" /></Card.Title>
              <Card.Text className={classNames(styles['to-do-next-card-text'], 'mb-5')}>
                <h1 id="levelTwoBreakPage.message.returnTodayPage" />
              </Card.Text>
              <Button className={classNames(styles['level-two-break-button'])} onClick={() => {}}>
                <h1 id="levelTwoBreakPage.button.takeABreak" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className={classNames(styles['level-two-break-card'], 'h-100')}>
            <Card.Body className="text-center py-4">
              <Card.Title className={classNames(styles['to-do-next-sub-heading'])}><h1 id="levelTwoBreakPage.heading.nextTopic" /></Card.Title>
              <Card.Text className={classNames(styles['to-do-next-card-text'], 'mb-5')}>
                <div dangerouslySetInnerHTML={{ __html: nextTopicText }} />
              </Card.Text>
              <Button className={classNames(styles['level-two-break-button'])} onClick={() => { handleNextLvl1Request(); }}>
                <h1 id="levelTwoBreakPage.button.continue" />
              </Button>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

L2BreakRoomPage.propTypes = {
  courseData: PropTypes.shape({
    lastCompletedTitle: PropTypes.string.isRequired,
    prevLvl2CollectionCmsId: PropTypes.string.isRequired,
    nextTopicText: PropTypes.string.isRequired,
    assessmentActivityPoints: PropTypes.string.isRequired,
    courseCmsId: PropTypes.string.isRequired,
    courseType: PropTypes.string.isRequired,
    contentType: PropTypes.string.isRequired,
    levelTwoCollectionCmsId: PropTypes.string.isRequired,
    levelOneCollectionCmsId: PropTypes.string.isRequired,
    pageCmsId: PropTypes.string.isRequired,
  }).isRequired,
  l3CollectionCmsId: PropTypes.string.isRequired,
  l4CollectionCmsId: PropTypes.string.isRequired,
};

export default L2BreakRoomPage;
