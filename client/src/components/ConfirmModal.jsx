import React, { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = ({ setShowModal, id, deleteProject }) => {
  const [show, setShow] = useState(true);

  const closeModal = () => {
    setShow(false);
    setShowModal(false);
  };

  const handleDelete = (pickedId) => {
    deleteProject(pickedId);
    closeModal();
  };

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;
