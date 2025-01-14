import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
} from 'react-bootstrap';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import QuestionAnswerBlock from './QuestionAnswerBlock';
import VibButton from '../../shared/vib_button';
import styles from '../../my_courses/course-page.module.scss';

const ProductExperienceSurveyModal = ({
  selectedQuestionFeedback,
  productExperienceSurvey,
  modalShow,
  handleRemindMe,
  shouldForceUserToTakeSurvey,
  handleSubmit,
  handleAnswerSelect,
  productExperienceSurveyProgressId,
}) => (
  <Modal
    show={modalShow}
    size="lg"
    centered
  >
    <Modal.Body data-testid="prod-exp-survey-modal" className={styles['product-exp-survey-modal']}>
      <h5 className={styles['modal-heading']}><FormattedMessage id="productExperienceSurvey.heading" /></h5>
      <div className={styles['modal-contents']}>
        <QuestionAnswerBlock
          productExperienceSurvey={productExperienceSurvey}
          handleAnswerSelect={handleAnswerSelect}
        />
        <div className="d-flex flex-wrap justify-content-end">
          <VibButton
            handleSubmit={() => handleRemindMe(productExperienceSurveyProgressId)}
            variant="outline-secondary"
            classes={styles['remind-btn']}
            isDisabled={shouldForceUserToTakeSurvey}
          >
            <FormattedMessage id="productExperienceSurvey.button.remindMeTomorrow" />
          </VibButton>
          <VibButton
            handleSubmit={handleSubmit}
            variant="secondary"
            classes={classNames(styles['submit-btn'], 'ml-3')}
            isDisabled={productExperienceSurvey.surveyQuestions.length !== selectedQuestionFeedback.length}
          >
            <FormattedMessage id="productExperienceSurvey.button.submit" />
          </VibButton>
        </div>
      </div>
    </Modal.Body>
  </Modal>
);

ProductExperienceSurveyModal.propTypes = {
  productExperienceSurvey: PropTypes.shape({
    surveyQuestions: PropTypes.instanceOf(Array).isRequired,
  }).isRequired,
  productExperienceSurveyProgressId: PropTypes.string.isRequired,
  modalShow: PropTypes.bool.isRequired,
  handleRemindMe: PropTypes.func.isRequired,
  shouldForceUserToTakeSurvey: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleAnswerSelect: PropTypes.func.isRequired,
  selectedQuestionFeedback: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default ProductExperienceSurveyModal;
