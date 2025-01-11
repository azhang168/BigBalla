import logo from './logo.svg';
import React ,{ useState } from "react";
import './App.css';
import axios from 'axios'

const Header = () =>{
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [showSignupPopup, setShowSignupPopup] = useState(false)

  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });

  const toggleDropdown = () => {
    setDropdownVisible((prev)=>!prev);
  };
  const handleSignup = () => {
    setShowSignupPopup(true);
    setDropdownVisible(false);
  };
  const handleSignupSubmit = async (e) => {
    try{
      e.preventDefault()
      const response = await axios.post('http://localhost:8000/api/user/', formData);
    } catch (error){
      console.error('Error saving user:', error);
    }
    closeSignupPopup();
  };
  const closeSignupPopup = () => {
    setShowSignupPopup(false);
  };
  
  return(
    <header id='mainHeader' height = '50px'>
      <img 
        id = "profilePic" src = 
        "/DefaultProfilePicture.png" 
        height = "auto" 
        width = "80px" 
        onClick={toggleDropdown}
        style={{cursor: "pointer"}}
      />
      {dropdownVisible && (
        <div
        style={{
          position: "absolute",
          right: 0,
          marginTop: "100px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          width: "150px",
        }}
        >
        <div>
            <button
              //onClick={handleLogin}
              style={{
                padding: "10px",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              style={{
                padding: "10px",
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
              }}
              >
                Sign Up
              </button>
          </div>
        </div>
      )}
      {showSignupPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 2000,
          }}
        >
          <h3>Sign Up</h3>
          <form onSubmit={handleSignupSubmit}>
            <div style={{ marginBottom: "10px", marginRight: "10px" }}>
              <label>Email:</label>
              <input
                id="email"
                type="email"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px", marginRight: "10px" }}>
              <label>Password:</label>
              <input
                id="password"
                type="password"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={closeSignupPopup}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </form>
        </div>
        )}
    </header>
  )
}
const App = () =>{
    //input values for food
    const [city, setCity] = useState("placeholder"); 
    const [numPeople, setNumPeople] = useState(0);
    const [budget, setBudget] = useState(0);
    const [rating, setRating] = useState(0);
    function search(formData) {
      const city = formData.get("city");
      const numPeople = formData.get("numPeople");
      const budget = formData.get("budget");
      alert(`city: '${city}' numPeople: '${numPeople}' budget: '${budget}', rating: '${rating}'`);
    }

    const handleRatingClick = (rating) => {
      setRating({
        rating: rating,
      });
      console.log("Selected Rating:", rating);
    };
    
    return(
        <div>
          <Header />
          <h1 style={{ textAlign: 'center' }}> FOOD FINDER </h1>
          <form action={search} id='searchFood'>
              <label style={{ textAlign: 'left' }}>City</label>
              <input name="city" id="city"/>
              <label style={{ textAlign: 'left' }}>Number of People</label>
              <input type="number" name="numPeople" id="numPeople"/>
              <label style={{ textAlign: 'left' }}>Budget</label>
              <input type="number" name="budget" id="budget"/>
              <label style={{textAlign: 'left'}}>Rating</label>
              <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    style={{
                      color: star <= rating ? 'gold' : 'gray',
                      fontSize: '24px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button type="submit">Search</button>
          </form>
        </div>
    )
}

export default App;
