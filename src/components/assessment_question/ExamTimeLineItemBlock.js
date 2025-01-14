import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import classnames from 'classnames';
import style from './assessment-question.module.scss';
import { getItemSvgSrc, getItemClassName } from '../shared/ProgressUtility';

const ExamTimeLineItemBlock = ({ item, currentItem }) => {
  const renderTooltip = (item) => (
    item.status !== 'open' ? <Tooltip data-testid="tooltip-title">{ item.title }</Tooltip> : <Tooltip className="d-none" />
  );

  return (
    <div
      className={classnames(style['item-btn'], style[getItemClassName(item)], 'p-0')}
      variant="default"
    >
      <OverlayTrigger
        key={item.id}
        overlay={renderTooltip(item)}
      >
        <span>
          <p data-testid="current-title" className={classnames(style['course-title'], currentItem.id === item.id ? style['current-item-title'] : '')}>
            {item.title}
          </p>
          {
            getItemSvgSrc({
              itemData: item,
              classes: '',
              circularProgressBar: true,
              circularProgressBarPercentage: currentItem.id === item.id ? currentItem.percentageOfQuestionCompleted : null,
            })
          }
        </span>
      </OverlayTrigger>
    </div>
  );
};

ExamTimeLineItemBlock.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  currentItem: PropTypes.shape({
    id: PropTypes.string.isRequired,
    percentageOfQuestionCompleted: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ExamTimeLineItemBlock;
