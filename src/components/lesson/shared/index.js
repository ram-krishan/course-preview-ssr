// un-used file
import React from 'react';

import AlertMessage from '../../../../components/shared/AlertMessage';
import VibRouteGenerator from '../../shared/vib_route_generator';

const showAlertMessage = (errorMessages) => (
  <AlertMessage
    alertType="danger"
    customClass="mt-3"
    message={errorMessages}
  />
);

const isNetPromoterScoreSurveyInProgress = (status) => status === 'netPromoterScoreSurveyInProgress';

const updateTopicStatusAndRedirect = (
  courseId,
  topicId,
  history,
  completeTopic,
  updateFlashMessage,
) => {
  let redirectUrl = '';
  completeTopic({
    variables: {
      vibCourseId: courseId,
      vibTopicId: topicId,
    },
  }).then((response) => {
    if (response.data.completeTopic.success) {
      const { nextTopicLessonId, courseProgressStatus } = response.data.completeTopic;
      if (nextTopicLessonId) {
        redirectUrl = VibRouteGenerator.getLessonPageUrl(courseId, nextTopicLessonId);
      } else if (isNetPromoterScoreSurveyInProgress(courseProgressStatus)) {
        redirectUrl = VibRouteGenerator.getLearnPageUrl(courseId, topicId);
      } else {
        redirectUrl = VibRouteGenerator.getSyllabusPageUrl(courseId);
      }
    } else {
      updateFlashMessage({ variables: { message: response.data.completeTopic.errorMessages, messageType: 'danger' } });
    }
    if (redirectUrl !== null) {
      history.push(redirectUrl);
    }
  });
};

export {
  updateTopicStatusAndRedirect,
  showAlertMessage,
};
