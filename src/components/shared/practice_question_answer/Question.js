// Un-used component
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Question = ({ questionText, questionsStyle }) => (
  <>
    <p className={classNames(questionsStyle, 'h4 font-weight-bold text-center mb-3')}>
      { questionText }
    </p>
  </>
);

Question.propTypes = {
  questionText: PropTypes.string.isRequired,
  questionsStyle: PropTypes.string,
};

Question.defaultProps = {
  questionsStyle: '',
};

export default Question;
