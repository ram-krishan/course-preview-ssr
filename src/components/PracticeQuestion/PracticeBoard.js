import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Row, Col } from 'react-bootstrap';

import styles from './practice-page.module.scss';
import CardWrapper from '../shared/card_wrapper';

const PracticeBoard = ({ vibUserCoursePractice, coursePracticeSessionId }) => {
  const showActivityPoints = () => (
    coursePracticeSessionId === null
      ? vibUserCoursePractice.totalActivityPointsForCompleteSessions
      : vibUserCoursePractice.totalActivityPoints
  );

  return (
    <Row>
      <Col sm={12} className="d-flex justify-content-center flex-wrap col-sm-12 mt-4">
        <div className={styles['wrapper-main-body']}>
          <CardWrapper
            boxShadow="0 2px 37px 8px #EDE9E7"
            borderRadius="19px"
            borderColor="#21154A;"
          >
            <CardWrapper.Body>
              <div className="px-2 pb-2 pt-4">
                <p data-testid="point-heading" className={styles['wrapper-label']}>
                  <h1 id="practicePage.activities.heading.points" />
                </p>
                <p data-testid="point-value" className={styles['wrapper-text-no']}>
                  {
                    vibUserCoursePractice.user
                      ? showActivityPoints()
                      : 0
                  }
                </p>
              </div>
            </CardWrapper.Body>
          </CardWrapper>
        </div>
        <div className={classNames(styles['wrapper-main-body'], 'ml-3')}>
          <CardWrapper
            boxShadow="0 2px 37px 8px #EDE9E7"
            borderRadius="19px"
            borderColor="#21154A;"
          >
            <CardWrapper.Body>
              <div className="px-2 pb-2 pt-4">
                <p data-testid="streak-heading" className={styles['wrapper-label']}>
                  <h1 id="practicePage.activities.heading.streak" />
                </p>
                <p data-testid="streak-count" className={styles['wrapper-text-no']}>
                  {
                    vibUserCoursePractice
                      ? vibUserCoursePractice.streakCount
                      : 0
                  }
                </p>
              </div>
            </CardWrapper.Body>
          </CardWrapper>
        </div>
      </Col>
    </Row>
  );
};

PracticeBoard.defaultProps = {
  coursePracticeSessionId: '',
};

PracticeBoard.propTypes = {
  coursePracticeSessionId: PropTypes.string,
  vibUserCoursePractice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    streakCount: PropTypes.number.isRequired,
    totalActivityPointsForCompleteSessions: PropTypes.number.isRequired,
    totalActivityPoints: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
export default PracticeBoard;
