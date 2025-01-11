import logo from './logo.svg';
import React ,{ useState } from "react";
import './App.css';
const Header = () =>{
  return(
    <header id='mainHeader' height = '50px'>
      <img id = "profilePic" src = "/DefaultProfilePicture.png" height = "auto" width = "100px" />
    </header>
  )
}
const App = () =>{
    //input values for food
    const [city, setCity] = useState("placeholder"); 
    const [numPeople, setNumPeople] = useState(-1);
    const [budget, setBudget] = useState(-1);
    function search(formData) {
      const city = formData.get("city");
      const numPeople = formData.get("numPeople");
      const budget = formData.get("budget");
      alert(`city: '${city}' numPeople: '${numPeople}' budget: '${budget}'`);
    }
    
    return(
        <div>
          <Header />
          <h1 style={{ textAlign: 'center' }}> FOOD FINDER </h1>
          <form action={search} id='searchFood'>
              <label style={{ textAlign: 'left' }}>City</label>
              <input name="city" id="city"/>
              <label style={{ textAlign: 'left' }}>Number of People</label>
              <input name="numPeople" id="numPeople"/>
              <label style={{ textAlign: 'left' }}>Budget</label>
              <input name="budget" id="budget"/>
              <button type="submit">Search</button>
          </form>
        </div>
    )
}

export default App;
