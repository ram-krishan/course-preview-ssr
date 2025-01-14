import React from 'react';
import { Container, Row } from 'react-bootstrap';

import PracticeQuestionWrapper from './PracticeQuestionWrapper';
import { CurrentUserConsumer } from '../../../currentUserContext';
import usePreventReload from '../shared/hooks/UsePreventReload';

const PracticeQuestion = () => {
  usePreventReload(true);
  return (
    <CurrentUserConsumer>
      {({ currentUser }) => (
        <Container data-testid="practice-question-index" className="px-0">
          <Row className="mx-0 mt-5 pb-5">
            <PracticeQuestionWrapper currentUser={currentUser} />
          </Row>
        </Container>
      )}
    </CurrentUserConsumer>
  );
};

export default PracticeQuestion;
