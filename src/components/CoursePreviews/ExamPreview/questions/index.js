import React from 'react';
import classNames from 'classnames';
import Heading from './Heading';
import QuestionBody from './QuestionBody';
import LessonSection from '../../../lesson/shared/LessonSection';
import styles from '../../../lesson/lesson-page.module.scss';

const Questions = ({
  lastLessonPath,
  levelTwoCollectionTitle,
  contentType,
  exam,
  associatedContent,
  nextL2,
  questionCmsId,
  locale,
}) => (
  <div data-testid="question-wrapper">
    <LessonSection>
      <div className={classNames(styles['lesson-container'])}>
        <Heading
          lastLessonPath={lastLessonPath}
          levelTwoCollectionTitle={levelTwoCollectionTitle}
          contentType={contentType}
        />
        <QuestionBody
          lastLessonPath={lastLessonPath}
          exam={exam}
          associatedContent={associatedContent}
          nextL2={nextL2}
          questionCmsId={questionCmsId}
          locale={locale}
        />
      </div>
    </LessonSection>
  </div>
);

export default Questions;
