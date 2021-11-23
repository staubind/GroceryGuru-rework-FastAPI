import IngredientSection from "../IngredientSection/IngredientSection";

function IngredientList({ingredients}) {
    return (
        <>
        {/* // for each aisle: 
            make a list of ingredientSection components, which are themselves lists of ingredients*/}
        {Object.keys(ingredients).sort().map(aisle => {
            return (
                <>
                    <br></br>
                    <h2>{aisle}</h2>
                    <br></br>
                    <IngredientSection aisleIngredients={Array.from(ingredients[aisle]).sort()}/>
                </>
            );
        })}  
        </>      
    );
};

export default IngredientList;