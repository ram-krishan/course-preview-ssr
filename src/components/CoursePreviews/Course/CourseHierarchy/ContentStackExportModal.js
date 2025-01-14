import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './course-hierarchy-v2-style.scss';
import Form from 'react-bootstrap/Form';
import SuccessAlertIcon from "../../../assets/images/success-img.svg";
import ErrorAlertIcon from "../../../assets/images/error-alert.png";
import Loader from '../../../shared/Loader';

const ContentStackExportModal = ({ loading, showModal, setShowModal, startContentStackExport, errorMessage, setErrorMessage, successMessage, setSuccessMessage }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Setting up default state when we again open the modal pop
    if(showModal) {
      setEmailAddress('')
      setErrorMessage('')
      setValidated(false)
    }
  }, [showModal])

  const handleChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    setErrorMessage('');
    event.preventDefault();
    if (form.checkValidity() === false) {
      setValidated(true);
      event.stopPropagation();
    }
    else {
      startContentStackExport(emailAddress)
      setEmailAddress('');
      setValidated(false);
    }
  }

  const handleClose = () => {
    setEmailAddress("")
    setShowModal(false)
  }

  return (
    <Modal
      show={showModal}
      size="lg"
      onHide={() => handleClose()}
    >
      <>
        <div className={styles['modal-header-border']}></div>
        <Modal.Header closeButton
          bsPrefix={styles['modal-header-style']}
        ></Modal.Header >
        <Modal.Body>
          { loading ? < Loader /> : null }
          <Row>
            <Col md={12} className="d-flex flex-wrap align-items-center justify-content-center">
              <div className="display-5 mb-2 w-100">
                {errorMessage.length > 0 && (
                  <Alert
                    autoHide
                    className="error-alert-banner-style"
                    variant="danger"
                    onClose={() => setErrorMessage("")}
                    dismissible
                  >
                    <img
                      alt="ErrorAlertIcon"
                      className="error-alert-icon-style"
                      src={ErrorAlertIcon}
                    />
                    {errorMessage}
                  </Alert>
                )}
                {successMessage.length > 0 && (
                  <Alert
                    autoHide
                    className="success-alert-banner-style"
                    variant="success"
                    onClose={() => setSuccessMessage("")}
                    dismissible
                  >
                    <img
                      alt="SuccessAlertIcon"
                      className="success-alert-icon-style"
                      src={SuccessAlertIcon}
                    />
                    {successMessage}
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
          <p className={classNames(styles['modal-content-text'], 'inner-txt')}><h1 id="contentstackExportModal.message" /></p>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  required
                  autoFocus
                  value={emailAddress}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email
                </Form.Control.Feedback>
              </Form.Group>
              <Button className="px-3 workflowStage-btn button-custom-mb" type="submit" disabled={loading}><h1 id="contentstackExportModal.button.confirm" /></ Button>
              <Button onClick={() => handleClose()} className="ml-3 px-3  workflowStage-btn button-custom-mb" type="button"><h1 id="contentstackExportModal.button.cancel" /></Button>
            </Form>
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </>
    </Modal>
  );
};

ContentStackExportModal.defaultProps = {
  successMessage: '',
  errorMessage: ''
}

ContentStackExportModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  setModalShow: PropTypes.func.isRequired,
  startContentStackExport: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  showModal: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  setSuccessMessage: PropTypes.func.isRequired
};

export default ContentStackExportModal;
