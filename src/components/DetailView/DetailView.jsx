import { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function DetailView() {
    const recipe = useSelector(state => state.detailReducer)
    return (
        <>
        <img src={recipe.image} />
        <h2>{recipe.name}</h2>
        <h4>Ready in: {recipe.readyInMinutes}</h4>
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Instructions</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        {/* Display the recipe instructions */}
                        {recipe.analyzedInstructions.map((majorStep, i) => {
                            return (
                                <li>
                                    <h1>Part {i+1}</h1>
                                    <ol>
                                        {majorStep.steps.map(step => <li>{step.step}</li>)}
                                    </ol>
                                </li>
                            );
                        })}
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Ingredients</Accordion.Header>
                <Accordion.Body>
                    <ul>
                        {/* Display recipe ingredients */}
                        {recipe.extendedIngredients.map(ingredient => <li>{ingredient.name}</li>)}
                    </ul>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
       
        </>
    );
};

export default DetailView;