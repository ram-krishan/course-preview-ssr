import React from 'react';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import classNames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';


import Loader from '../../../components/shared/Loader';
import AlertMessage from '../../../components/shared/AlertMessage';
import { vibGraphqlStates } from '../../../graphql_states';
import styles from './assessment-question.module.scss';
import TitleBlock from '../shared/pageTitle';
import QuestionAnswerBlock from './QuestionAnswerBlock';
import ExamTimeLine from './ExamTimeLine';
import PageNotFound from '../shared/PageNotFound';
import VibRouteGenerator from '../shared/vib_route_generator';
import { isEmpty } from 'lodash';

const AssessmentQuestion = () => {
  const {
    vib_course_id: vibCourseId,
    vib_assessment_attempt_id: vibAssessmentAttemptId,
    locale,
  } = useParams();

  const history = useHistory();

  const { data, error, loading } = useQuery(
    vibGraphqlStates.assessment.exam.queries.GET_COURSE_USER_ASSESSMENT_EXAM_PROGRESS,
    {
      variables: {
        vibCourseId,
        vibAssessmentAttemptId,
        locale
      },
      fetchPolicy: 'network-only',
    },
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

  if (data.courseAssessmentAttempt.status === 'completed') {
    const redirectUrl = VibRouteGenerator.getAssessmentPageUrl(
      vibCourseId, data.courseAssessmentAttempt.assessmentType,
    );
    return history.push(redirectUrl);
  }

  const { courseAssessment, totalCompletedQuestions, totalNoOfQuestions } = data.courseAssessmentAttempt;
  const { assessment, course } = courseAssessment;
  const { assessmentCurrentExam, assessmentAssessmentExams, title } = assessment;

  const validExams = assessmentAssessmentExams.reduce((assessmentExams, assessmentAssessmentExam) => (
    assessmentAssessmentExam.assessmentExam.isValid ? [...assessmentExams, assessmentAssessmentExam.assessmentExam] : assessmentExams
  ), []);

  if (!assessment.isUserAllowedToTakeAssessment || isEmpty(assessmentCurrentExam)) {
    return <PageNotFound />;
  }

  return (
    <Container className="p-0" data-testid="assessment-question-container">
      <Row className="min-height-75vh pb-5 mb-4">
        <Col sm={12} className="pl-0">
          <Col md={12}>
            <div className={classNames(styles['content-container'], 'pb-4')}>
              <div className="w-100">
                <TitleBlock
                  label={assessmentCurrentExam.title}
                  pageTitle={title}
                  topTxtClassNames={styles['top-small-heading']}
                  bottomTxtClassNames={styles['bottom-title-txt']}
                />
              </div>

              <div data-testid="question-count" className={classNames(styles['questions-count-panel'], 'w-100')}>
                <h1
                  id="assessment.numberOfQuestionsComplete"
                  values={{
                    completedQuestions: parseInt(totalCompletedQuestions) + 1,
                    totalQuestions: totalNoOfQuestions,
                  }}
                />
              </div>

              <ExamTimeLine exams={validExams} currentItem={assessmentCurrentExam} />
              <QuestionAnswerBlock
                vibAssessmentAttemptId={vibAssessmentAttemptId}
                vibExamId={assessmentCurrentExam.id}
                vibCourseId={vibCourseId}
                locale={locale}
              />
            </div>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default AssessmentQuestion;
