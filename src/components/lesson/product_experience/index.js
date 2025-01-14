import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import AlertMessage from '../../shared/AlertMessage';
import {
  vibGraphqlStates,
  flashMessageState,
} from '../../../../graphql_states';
import Loader from '../../../../components/shared/Loader';
import ProductExperienceSurveyModal from './ProductExperienceSurveyModal';

const ProductExperienceSurvey = ({ topicLessonId, forceModalPopup }) => {
  const [selectedQuestionFeedback, setSelectedQuestionFeedback] = useState([]);
  const {
    data, error, loading, refetch,
  } = useQuery(
    vibGraphqlStates.survey.productExperienceSurvey.queries.PRODUCT_EXPERIENCE_SURVEY_PROGRESS,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [updateProductExperienceSurveyProgress] = useMutation(
    vibGraphqlStates
      .survey
      .productExperienceSurvey
      .mutations
      .UPDATE_PRODUCT_EXPERIENCE_SURVEY_PROGRESS,
  );

  const [createProductExperienceSurveyQuestionAnswer] = useMutation(
    vibGraphqlStates
      .survey
      .productExperienceSurvey
      .mutations
      .CREATE_PRODUCT_EXPERIENCE_SURVEY_QUESTION_ANSWER,
  );

  const [updateFlashMessage] = useMutation(
    flashMessageState.mutations.UPDATE_FLASH_MESSAGE,
  );

  useEffect(
    () => {
      refetch();
    },
    [topicLessonId],
  );

  const handleAnswerSelect = (event) => {
    const { name: questionId, value: answerId } = event.target;
    const dataHash = {
      questionId,
      answerId,
    };

    const existingData = selectedQuestionFeedback
      .find((dataObj) => dataObj.questionId === dataHash.questionId);
    if (existingData) {
      selectedQuestionFeedback.map((quesAnsHash) => {
        if (quesAnsHash.questionId === dataHash.questionId) {
          quesAnsHash.answerId = dataHash.answerId;
          return quesAnsHash;
        }
        return quesAnsHash;
      });
    } else {
      setSelectedQuestionFeedback([...selectedQuestionFeedback, dataHash]);
    }
  };

  const handleSubmit = () => {
    createProductExperienceSurveyQuestionAnswer({
      variables: {
        productExperienceSurveyAttributes: selectedQuestionFeedback,
      },
    }).then((response) => {
      if (!response.data.createProductExperienceSurveyQuestionAnswer.success) {
        updateFlashMessage({ variables: { message: response.data.createProductExperienceSurveyQuestionAnswer.errorMessages, messageType: 'danger' } });
      } else { window.location.reload(); }
    });
  };

  const handleRemindMe = (productExperienceSurveyProgressId) => {
    updateProductExperienceSurveyProgress(
      {
        variables: {
          status: 'remindMeLater',
          productExperienceSurveyProgressId,
        },
      },
    ).then((response) => {
      if (!response.data.updateProductExperienceSurveyProgress.success) {
        updateFlashMessage({ variables: { message: response.data.remindMe.errorMessages, messageType: 'danger' } });
      } else { window.location.reload(); }
    });
  };

  const handleModalShow = (productExperienceSurveyProgress) => {
    const { status } = productExperienceSurveyProgress;
    if (status === 'open') {
      return true;
    } if (status !== 'remindMeLater') {
      return false;
    } if (forceModalPopup) {
      return true;
    }
    const remindMeAt = new Date(productExperienceSurveyProgress.remindMeAt);
    const currentDate = new Date();
    return (currentDate >= remindMeAt);
  };

  const shouldRenderPESModal = (productExperienceSurveyProgress) => (
    !isEmpty(productExperienceSurveyProgress) &&
    productExperienceSurveyProgress.isProductExperienceEnabled
  );

  if (loading) return <Loader />;
  if (error) {
    const errorObject = error;
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={errorObject && errorObject.graphQLErrors}
      />
    );
  }

  return (
    <>
      {
        shouldRenderPESModal(data.productExperienceSurveyProgress)
          ? (
            <ProductExperienceSurveyModal
              productExperienceSurvey={data.productExperienceSurveyProgress.productExperienceSurvey}
              productExperienceSurveyProgressId={data.productExperienceSurveyProgress.id}
              modalShow={handleModalShow(data.productExperienceSurveyProgress)}
              handleRemindMe={handleRemindMe}
              shouldForceUserToTakeSurvey={data.productExperienceSurveyProgress.shouldForceUserToTakeSurvey}
              selectedQuestionFeedback={selectedQuestionFeedback}
              handleSubmit={handleSubmit}
              handleAnswerSelect={handleAnswerSelect}
            />
          ) : null
      }
    </>
  );
};

ProductExperienceSurvey.defaultProps = {
  topicLessonId: null,
  forceModalPopup: false,
};

ProductExperienceSurvey.propTypes = {
  topicLessonId: PropTypes.string,
  forceModalPopup: PropTypes.bool,
};

export default ProductExperienceSurvey;
