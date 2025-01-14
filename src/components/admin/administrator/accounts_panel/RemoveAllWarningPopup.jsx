import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal } from 'react-bootstrap';

const RemoveAllWarningPopup = ({
  showModal,
  toggleModal,
  removeSelectedAccounts,
}) => (
  <Modal show={showModal}>
    <Modal.Header closeButton={toggleModal}>
      <h1 id="admin.userCollections.removeAllPopup.heading" />
    </Modal.Header>

    <Modal.Body><h1 id={`admin.users.removeAllPopup.body`} /></Modal.Body>

    <Modal.Footer>
      <Button onClick={toggleModal}>
        <h1 id="admin.userCollections.removeAllPopup.cancel" />
      </Button>
      <Button color="primary" onClick={() => removeSelectedAccounts(true)}>
        <h1 id="admin.userCollections.removeAllPopup.ok" />
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
