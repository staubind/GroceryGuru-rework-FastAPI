import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
// adapted from Bootstrap-react's modal.
function ServingsModal(props) {
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
          <h4>Number of Servings:</h4>
          {/* Drop down menu */}
          <Form.Select aria-label="Default select example" onChange={(event) => {props.setservings(event.target.value)}}> 
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
          </Form.Select>
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

export default ServingsModal;