import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'react-bootstrap';

const RemoveAllWarningPopup = ({
  showModal,
  toggleModal,
  removeSelectedUsers,
  userGroupType,
}) => (
  <Modal show={showModal} onHide={toggleModal}>
    <Modal.Header closeButton>
      <FormattedMessage id="admin.userCollections.removeAllPopup.heading" />
    </Modal.Header>

    <Modal.Body><FormattedMessage id={`admin.${userGroupType}.removeAllPopup.body`} /></Modal.Body>

    <Modal.Footer>
      <Button onClick={toggleModal}>
        <FormattedMessage id="admin.userCollections.removeAllPopup.cancel" />
      </Button>
      <Button color="primary" onClick={() => removeSelectedUsers(true)}>
        <FormattedMessage id="admin.userCollections.removeAllPopup.ok" />
      </Button>
    </Modal.Footer>
  </Modal>
);

RemoveAllWarningPopup.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  removeSelectedUsers: PropTypes.func.isRequired,
  userGroupType: PropTypes.string.isRequired,
};

export default RemoveAllWarningPopup;
