import { Form } from 'react-bootstrap'

function IngredientSection({aisleIngredients}) {
    return (
        <Form>
        {/* // for each section: list ingredients*/}
        {aisleIngredients.map(ingredient => <Form.Check label={ingredient} />)}
        </Form>
    );
};

export default IngredientSection;