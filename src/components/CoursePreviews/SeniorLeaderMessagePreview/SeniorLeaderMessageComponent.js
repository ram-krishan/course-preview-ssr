/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { isEmpty } from 'lodash';

import classNames from 'classnames';

import TitleBlock from '../../shared/pageTitle';
import SeniorLeaderMessageCmsDataFormatter from './SeniorLeaderMessageCmsDataFormatter';
import SeniorLeaderMessageBlock from './SeniorLeaderMessageBlock'
import styles from './senior-leader-message-page.module.scss';
import GoalBlock from './GoalBlock';

const SeniorLeaderMessageComponent = ({
  seniorLeaderMessageGoalsData, seniorLeaderMessageData, courseType,
}) =>{

  let formattedData = {};

  if (seniorLeaderMessageGoalsData && seniorLeaderMessageData) {
    formattedData = SeniorLeaderMessageCmsDataFormatter(
      seniorLeaderMessageData,
      courseType,
      seniorLeaderMessageGoalsData
    );
  }

  let rich_text, video_block, goals, contentstackCourse;
  if (!isEmpty(formattedData)) {
    rich_text = formattedData.seniorLeaderMessageContents[0].rich_text
    video_block = formattedData.seniorLeaderMessageContents[0].video_block
    contentstackCourse = formattedData.contentStackCourse
    goals = contentstackCourse.goals
  }

  const isSlmContentEmpty = () => isEmpty(video_block) && isEmpty(rich_text);

  const isGoalsEmpty = () => isEmpty(goals);
  return (
    <>
      <div className={classNames(styles.app)}>
        <div className={classNames(styles['heading-container'], 'mt-4')}>
          <TitleBlock
            label=""
            pageTitle={<h1 id="goals.heading.pageTitle" />}
            courseTitle={contentstackCourse.title}
            topTxtClassNames={styles['ready-text']}
            bottomTxtClassNames={styles['sub-heading-text']}
          />
        </div>
        <div className={classNames(styles['training-goals-container'])}>
          <Row>
            {
              isSlmContentEmpty()
                ? null
                : (
                  <SeniorLeaderMessageBlock
                    textBlock={rich_text}
                    videoBlockContent={video_block}
                    isGoalsEmpty={isGoalsEmpty()}
                  />
                )
            }
            {
              isGoalsEmpty()
                ? null
                : (
                  <Col lg={isSlmContentEmpty() ? 12 : 5}>
                    <GoalBlock
                      goals={goals}
                      isSlmContentEmpty={isSlmContentEmpty()}
                    />
                  </Col>
                )
            }
          </Row>
        </div>
      </div>
    </>
  );
};

export default SeniorLeaderMessageComponent;
