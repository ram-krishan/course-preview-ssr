import React, { useContext } from 'react';
import { AccordionContext, useAccordionToggle } from 'react-bootstrap';
import classNames from 'classnames';
import PropsTypes from 'prop-types';

const ToggleContext = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <button
      type="button"
      onClick={decoratedOnClick}
      className={classNames('border-0 bg-transparent justify-content-between d-flex align-items-center px-4 mx-1 card-header text-left', isCurrentEventKey ? 'collapse-open' : 'collapse-close')}
    >
      {children}
    </button>
  );
};

ToggleContext.propTypes = {
  callback: PropsTypes.func,
  children: PropsTypes.node.isRequired,
  eventKey: PropsTypes.string.isRequired,
};
ToggleContext.defaultProps = {
  callback: null,
};

export default ToggleContext;
