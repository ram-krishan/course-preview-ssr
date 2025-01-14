// un-used file
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';



import OutcomeBlock from './OutcomeBlock';
import VibButton from '../shared/vib_button';
import styles from './lesson-page.module.scss';

const SideContent = ({
  lessonPageContent,
  sideContent,
  handleLessonComplete,
  continueBntLoading,
  status,
}) => {
  const getLessonPageContentTextEditorClass = () => (
    lessonPageContent.richTextEditor === '<p><br></p>' ? 'mt-0' : 'mt-5'
  );

  return (
    <>
      {
        lessonPageContent && lessonPageContent.richTextEditor
          ? (
            <div
              className={
                classNames(
                  styles['lesson-page-content-text-editor'],
                  `pt-5 ${getLessonPageContentTextEditorClass()}`,
                )
              }
              dangerouslySetInnerHTML={{ __html: lessonPageContent.richTextEditor }}
            />
          )
          : null
      }
      {
        sideContent && sideContent.type === 'LessonPageSideContentModularBlocksOutcome'
          ? <OutcomeBlock outcome={sideContent} />
          : null
      }
      <div className="d-flex justify-content-end align-items-center w-100 pt-4 mt-3">
        <span className="mr-5">
          <strong>Up Next:</strong>
          {' '}
          Model
        </span>
        <VibButton
          handleSubmit={() => handleLessonComplete(status)}
          isLoading={continueBntLoading}
        >
          <h1 id="button.continue" />
        </VibButton>
      </div>
    </>
  );
};


SideContent.propTypes = {
  lessonPageContent: PropTypes.shape({
    richTextEditor: PropTypes.string.isRequired,
  }).isRequired,
  sideContent: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  continueBntLoading: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  handleLessonComplete: PropTypes.func.isRequired,
};

export default SideContent;
