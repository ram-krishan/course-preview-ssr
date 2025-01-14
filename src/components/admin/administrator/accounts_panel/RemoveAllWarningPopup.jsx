import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'react-bootstrap';

const RemoveAllWarningPopup = ({
  showModal,
  toggleModal,
  removeSelectedAccounts,
}) => (
  <Modal show={showModal}>
    <Modal.Header closeButton={toggleModal}>
      <FormattedMessage id="admin.userCollections.removeAllPopup.heading" />
    </Modal.Header>

    <Modal.Body><FormattedMessage id={`admin.users.removeAllPopup.body`} /></Modal.Body>

    <Modal.Footer>
      <Button onClick={toggleModal}>
        <FormattedMessage id="admin.userCollections.removeAllPopup.cancel" />
      </Button>
      <Button color="primary" onClick={() => removeSelectedAccounts(true)}>
        <FormattedMessage id="admin.userCollections.removeAllPopup.ok" />
      </Button>
    </Modal.Footer>
  </Modal>
);

RemoveAllWarningPopup.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  removeSelectedAccounts: PropTypes.func.isRequired,
};

export default RemoveAllWarningPopup;
