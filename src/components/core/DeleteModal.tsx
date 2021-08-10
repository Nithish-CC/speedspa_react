import React from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalFooter from 'react-bootstrap/ModalFooter'
import ModalTitle from 'react-bootstrap/ModalTitle'

const DeleteModal = (props: any) => {
    const { title, modalPopup, closeModal, handleDelete } = props
    return (
        <React.Fragment>
            <Modal show={modalPopup.deleteModal} animation={false}>
                <ModalHeader>
                    <ModalTitle>Delete {title}</ModalTitle>
                </ModalHeader>
                <ModalBody>Are you sure you want to delete {title} {modalPopup.name}?</ModalBody>
                <ModalFooter>
                    <button className='btn btn-secondary' onClick={() => closeModal()}>Cancel</button>{' '}
                    <button className='btn btn-danger' onClick={() => handleDelete()}>Delete</button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

export default DeleteModal;
