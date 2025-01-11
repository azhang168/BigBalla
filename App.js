import React ,{ useState } from "react";
const App = () =>{
    //input values for food
    const [city, setCity] = useState("placeholder"); 
    const [numPeople, setNumPeople] = useState(-1);
    const [budget, setBudget] = useState(-1);
    return(
        <form action={search}>
            <input name="city" id="city"/>
            <input name="numPeople" id="numPeople"/>
            <input name="budget" id="budget"/>
            <button type="submit">Search</button>
        </form>
    )

}