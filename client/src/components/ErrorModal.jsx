import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ErrorModal = ({ setShowModal, message }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setShowModal(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose} className="text-center">
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-center">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ErrorModal;
