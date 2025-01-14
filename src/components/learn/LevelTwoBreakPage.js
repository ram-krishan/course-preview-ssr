import React from 'react';
import {
  Card, Row, Col, Button, Container,
} from 'react-bootstrap';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styles from './learn-page.module.scss';
import VibRouteGenerator from '../shared/vib_route_generator';
import { vibGraphqlStates, flashMessageState } from '../../../graphql_states';
import useSuperScript from '../shared/hooks/useSuperScript';

const LevelTwoBreakPage = ({
  isLearnStartPage,
  jumpBackIn,
  firstLevelTwoLevelOneCollectionId,
  firstLevelOneCollection,
  assessment,
  isAllCoreContentCompleted,
  canShowAssessmentTitle,
  hasEnrichmentStarted,
  previousLevelTwoCollection,
  courseId,
  levelTwoCollectionProgressId,
}) => {
  useSuperScript();
  const history = useHistory();
  const [startCourse] = useMutation(
    vibGraphqlStates.learn.mutations.START_COURSE,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  const handleTakeABreak = () => {
    history.push('/today');
  };

  const handleStartCourse = () => {
    startCourse({
      variables: { vibCourseId: courseId },
    }).then((response) => {
      const {
        success,
        errorMessages,
        jumpBackIn: jumpBackInResponse,
      } = response.data.startCourse;

      if (success) {
        history.push({ pathname: jumpBackInResponse.jumpBackInPath });
      } else {
        updateFlashMessage({
          variables: {
            message: errorMessages,
            messageType: 'danger',
          },
        });
      }
    });
  };

  const handleStartNextTopic = () => {
    if (isLearnStartPage) {
      handleStartCourse();
    } else {
      history.push(VibRouteGenerator.getLessonPageUrl(
        courseId,
        firstLevelTwoLevelOneCollectionId,
        levelTwoCollectionProgressId,
      ));
    }
  };


  const getPreviousCompletedTitle = () => (canShowAssessmentTitle ? assessment.title : previousLevelTwoCollection.title);

  const getTranslationIdOfLastComplete = () => (canShowAssessmentTitle
    ? 'levelTwoBreakPage.message.youCompleted.assessment'
    : 'levelTwoBreakPage.message.youCompleted');

  return (
    <>
      <Container>
        <Card className={classNames(styles['level-two-break-card'])}>
          <Card className={classNames(styles['level-two-break-points'])}>
            <Card.Body className={styles['level-two-collection-details']}>
              <h3><FormattedMessage id="levelTwoBreakPage.message.greatJob" /></h3>
              <p data-testid="previous-l2-coll-title" className="mt-4">
                <FormattedMessage
                  id={getTranslationIdOfLastComplete()}
                  values={{
                    completedTitle: getPreviousCompletedTitle(),
                  }}
                />
              </p>
              <p className={classNames(styles['activity-point-text'], 'mt-5')}>
                <FormattedMessage id="levelTwoBreakPage.heading.youEarned" />
                {canShowAssessmentTitle ? assessment.activityPoints : previousLevelTwoCollection.activityPoints}
                {' '}
                { <FormattedMessage id="levelTwoBreakPage.heading.activityPoints" />}
                {' '}

              </p>
            </Card.Body>
          </Card>
          {
              !(isLearnStartPage || (isAllCoreContentCompleted && !hasEnrichmentStarted)) && previousLevelTwoCollection && previousLevelTwoCollection.outroText
                ? (
                  <>
                    <Card.Body className="w-75 mx-auto py-5 my-3">
                      <Card.Text className={classNames(styles['you-learned-text'], 'mt-4')}>
                        <span dangerouslySetInnerHTML={{ __html: previousLevelTwoCollection.outroText }} />
                      </Card.Text>
                    </Card.Body>
                  </>
                )
                : null
            }

        </Card>

        <Row>
          <Col>
            <div className={classNames(styles['to-do-next-heading'], 'pt-5 pb-4')}>
              <h5>
                <FormattedMessage id="levelTwoBreakPage.message.nextLikeMessage" />
              </h5>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className={classNames(styles['level-two-break-card'], 'h-100')}>
              <Card.Body className="text-center py-4">
                <Card.Title className={classNames(styles['to-do-next-sub-heading'])}><FormattedMessage id="levelTwoBreakPage.heading.todayPage" /></Card.Title>
                <Card.Text className={classNames(styles['to-do-next-card-text'], 'mb-5')}>
                  <FormattedMessage id="levelTwoBreakPage.message.returnTodayPage" />
                </Card.Text>
                <Button className={classNames(styles['level-two-break-button'])} onClick={() => { handleTakeABreak(); }}>
                  <FormattedMessage id="levelTwoBreakPage.button.takeABreak" />
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className={classNames(styles['level-two-break-card'], 'h-100')}>
              <Card.Body className="text-center py-4">
                <Card.Title className={classNames(styles['to-do-next-sub-heading'])}><FormattedMessage id="levelTwoBreakPage.heading.nextTopic" /></Card.Title>
                <Card.Text className={classNames(styles['to-do-next-card-text'], 'mb-5')}>
                  <span dangerouslySetInnerHTML={{ __html: jumpBackIn.levelTwoCollectionIntroText === null ? firstLevelOneCollection.title : jumpBackIn.levelTwoCollectionIntroText }} />
                </Card.Text>
                <Button className={classNames(styles['level-two-break-button'])} onClick={() => { handleStartNextTopic(); }}>
                  <FormattedMessage id="levelTwoBreakPage.button.continue" />
                </Button>
              </Card.Body>

            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

LevelTwoBreakPage.defaultProps = {
  jumpBackIn: ({
    jumpBackInPath: '',
    levelTwoCollectionIntroText: '',
    jumpBackInTitle: '',
  }),
  previousLevelTwoCollection: null,
  firstLevelOneCollection: ({
    title: '',
  }),
  assessment: ({
    title: '',
    activityPoints: '0',
  }),
};

LevelTwoBreakPage.propTypes = {
  canShowAssessmentTitle: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  firstLevelTwoLevelOneCollectionId: PropTypes.string.isRequired,
  levelTwoCollectionProgressId: PropTypes.string.isRequired,
  isLearnStartPage: PropTypes.bool.isRequired,
  isAllCoreContentCompleted: PropTypes.bool.isRequired,
  hasEnrichmentStarted: PropTypes.bool.isRequired,
  jumpBackIn: PropTypes.shape({
    jumpBackInTitle: PropTypes.string.isRequired,
    jumpBackInPath: PropTypes.string.isRequired,
    levelTwoCollectionIntroText: PropTypes.string,
  }),
  assessment: PropTypes.shape({
    title: PropTypes.string.isRequired,
    activityPoints: PropTypes.string.isRequired,
  }),
  firstLevelOneCollection: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  previousLevelTwoCollection: PropTypes.shape({
    outroText: PropTypes.string,
    title: PropTypes.string.isRequired,
    activityPoints: PropTypes.number.isRequired,
  }),
};


export default LevelTwoBreakPage;
