import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

// adapted from Bootstrap-react's modal.
function FavoritesModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to remove this recipe from your favorites?</h4>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onHide}>Close</Button>
        <Button variant="primary" onClick={() => {
            props.confirm() 
            props.onHide()
        }}>Confirm
        </Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default FavoritesModal;