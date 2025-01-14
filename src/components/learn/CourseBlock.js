import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import Lesson from './Lesson';
import Resource from './Resource';
import ListItemComponent from './ListItemComponent';
import { CourseImg } from '../shared/vib_images';

import styles from './learn-page.module.scss';
import { getLevelTwoCollectionExamData } from '../course_syllabus/util';

const CourseBlock = ({
  mappedCurrentLevelOneCollections,
  currentLevelTwoCollection,
  image,
  courseId,
  currentTopicTitle,
  jumpBackIn,
  isLearnStartPage,
  lvl2CollectionProgress,
  canStartCourse,
  isCourseEnabled,
}) => {
  const examHash = getLevelTwoCollectionExamData(currentLevelTwoCollection, lvl2CollectionProgress);

  return (
    <>
      <div className={styles['course-block']}>
        <Row className="mt-4">
          <Col lg={7}>
            <img
              className={styles['course-img']}
              src={image ? image.url : CourseImg}
              alt="course-img"
            />
          </Col>

          <Col className={styles['content-part']} lg={5}>
            <Lesson
              courseId={courseId}
              currentTopicTitle={currentTopicTitle}
              jumpBackIn={jumpBackIn}
              isLearnStartPage={isLearnStartPage}
              canStartCourse={canStartCourse}
              isCourseEnabled={isCourseEnabled}
            />
            <div className={classNames('my-2', styles['learn-list-item'])}>
              <ul className={`pl-0 list-unstyled ${classNames(styles['lessons-list'])}`}>
                {
                mappedCurrentLevelOneCollections.map((innerItem, index) => (
                  <ListItemComponent
                    key={innerItem.id}
                    targetObject={innerItem}
                    wrapperObject={currentLevelTwoCollection}
                    targetTitleUrl={innerItem.lessonPageUrl}
                    jumpBackInUrl={jumpBackIn.jumpBackInPath}
                    listIndex={index}
                    showLinkOnTitle
                  />
                ))
              }
                {
                  currentLevelTwoCollection.exam
                    ? (
                      <ListItemComponent
                        targetObject={examHash.exam}
                        wrapperObject={examHash}
                        jumpBackInUrl={examHash.exam.examUrl}
                        targetTitleUrl={examHash.exam.examUrl}
                        showLinkOnTitle
                      />
                    )
                    : null
                }
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

CourseBlock.defaultProps = {
  image: null,
  jumpBackIn: ({
    jumpBackInPath: '',
  }),
};

CourseBlock.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  courseId: PropTypes.string.isRequired,
  currentTopicTitle: PropTypes.string.isRequired,
  jumpBackIn: PropTypes.shape({
    courseTitle: PropTypes.string.isRequired,
    levelTwoCollectionTitle: PropTypes.string.isRequired,
    jumpBackInTitle: PropTypes.string.isRequired,
    jumpBackInDesc: PropTypes.string,
    jumpBackInPath: PropTypes.string,
    levelOneCollectionCount: PropTypes.number.isRequired,
    completedLevelOneCollectionCount: PropTypes.number.isRequired,
  }),
  isLearnStartPage: PropTypes.bool.isRequired,
  canStartCourse: PropTypes.bool.isRequired,
  isCourseEnabled: PropTypes.bool.isRequired,
};

export default CourseBlock;
