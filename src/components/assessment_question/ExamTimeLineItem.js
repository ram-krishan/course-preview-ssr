import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './assessment-question.module.scss';
import ExamTimeLineItemBlock from './ExamTimeLineItemBlock';

const ExamTimeLineItem = ({ item, currentItem }) => {
  const getTooltipContainerClass = (itemData) => (
    classnames(
      style['item-tooltip-container'],
      itemData.id === currentItem.id ? 'position-relative' : '',
      (itemData.status === 'open' || itemData.status === 'inProgress') ? style['locked-item'] : style['unlocked-item'],
    )
  );
  return (
    <div
      className={getTooltipContainerClass(item)}
      key={item.id}
      id={`item-tooltip-${item.id}`}
    >
      <ExamTimeLineItemBlock
        item={item}
        currentItem={currentItem}
      />
      {
        item.id === currentItem.id
          ? (
            <p className={classnames(style['current-item-pointer'], 'mb-0 text-decoration-none', item.id === currentItem.id ? '' : 'd-none')}>
              <h1 id="assessment.label.youAreHere" />
            </p>
          )
          : null
      }
    </div>
  );
};

ExamTimeLineItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isCurrent: PropTypes.bool,
  }).isRequired,
  currentItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

export default ExamTimeLineItem;
