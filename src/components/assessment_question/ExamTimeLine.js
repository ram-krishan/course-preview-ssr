import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ExamTimeLineItem from './ExamTimeLineItem';
import styles from './assessment-question.module.scss';

function ExamTimeLine({ exams, currentItem }) {
  return (
    <div data-testid="timeline-wp" className="position-relative mt-5 px-3 pr-3">
      <div className={classNames(styles['timeline-item-wrapper'], 'd-flex justify-content-between position-relative')}>
        {
          exams.map((item) => (
            <ExamTimeLineItem
              key={item.id}
              item={item}
              currentItem={currentItem}
            />
          ))
        }
      </div>
    </div>
  );
}

ExamTimeLine.propTypes = {
  exams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
  currentItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};
export default ExamTimeLine;
