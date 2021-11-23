import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecipeCard2 from '../RecipeCard/RecipeCard2';
import { Tabs, Tab, Container, Nav } from "react-bootstrap";
import IngredientList from "../IngredientList/IngredientList";

// this gathers the ingredients for the recipe display
function makeGroceryList(recipes) {
    let totalIngredients = {};
    // sorts ingredients by aisle, only lists each ingredient once
    for (let recipe of recipes) {
        for (let ingredient of recipe.extendedIngredients) {
                if (totalIngredients[ingredient.aisle] === undefined) {
                    totalIngredients[ingredient.aisle] = new Set();
                    totalIngredients[ingredient.aisle].add(ingredient.name)
                } else {
                    totalIngredients[ingredient.aisle].add(ingredient.name)
                }
            }
        }
    return totalIngredients
}

function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cartReducer);
    // on load: get all favorites for the user
    useEffect(() => {
        dispatch({
            type: 'FETCH_CART',
            payload: []
        })
    }, [])

    // display the list of recipe cards in return
    return (
        <Container>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="Recipes">
                    <center>
                    {cart.map(recipe => {
                        return <div><RecipeCard2 key={recipe.id} recipe={recipe}/><br></br></div>
                    })}
                    </center>
                </Tab>
                <Tab eventKey="profile" title="Grocery List">
                    <IngredientList ingredients={makeGroceryList(cart)}/>
                </Tab>
                <Tab disabled title="Nutrition">
                    <center>
                    <h1>
                        Under Development
                    </h1>
                    </center>
                </Tab>
            </Tabs>        
        </Container>
    );
}

export default Cart;