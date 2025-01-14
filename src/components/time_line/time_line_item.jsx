import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import style from './style.module.scss';
import { getItemSvgSrc } from '../shared/ProgressUtility';

const TimeLineItem = ({
  intl, item, isCurrentItem, onTimeLineItemChange,
}) => {
  const getTooltipContainerClass = (item) => (
    classnames(
      style['item-tooltip-container'],
      isCurrentItem ? 'position-relative' : '',
      ['inProgress', 'open', 'locked'].includes(item.status) ? style['locked-item'] : style['unlocked-item'],
    )
  );

  const renderTooltip = (item) => (
    !(['open', 'locked'].includes(item.status)) ? <Tooltip data-testid="tool-tip-title"> { item.title } </Tooltip> : <Tooltip className="d-none" />
  );

  return (
    <div
      className={getTooltipContainerClass(item)}
      key={item.id}
      id={`item-tooltip-${item.id}`}
    >
      <OverlayTrigger
        key={item.id}
        placement="bottom"
        overlay={renderTooltip(item)}
      >
        <Button
          data-testid={item.id}
          onClick={onTimeLineItemChange != null ? () => item.status !== 'open' && onTimeLineItemChange(item) : null}
          className={classnames(style['item-btn'], 'p-0', item.status === 'open' ? style['locked-item-link'] : '', isCurrentItem ? style['current-item-pointer-btn'] : '', !onTimeLineItemChange ? style['static-button'] : null)}
          variant="default"
          data-text={intl.formatMessage({ id: "label.youAreHere"})}
        >
          {
            getItemSvgSrc({
              itemData: item,
              classes: '',
              iconHeight: '20px',
              iconWidth: '20px',
            })
          }
        </Button>
      </OverlayTrigger>
    </div>
  );
};

TimeLineItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onTimeLineItemChange: PropTypes.func,
  isCurrentItem: PropTypes.bool.isRequired,
};

TimeLineItem.defaultProps = {
  onTimeLineItemChange: null,
};

export default (injectIntl(TimeLineItem));
