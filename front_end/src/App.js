import logo from './logo.svg';
import React ,{ useState, useEffect } from "react";
import './App.css';
import Axios from "axios";

const Profile = () =>{
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [showSignupPopup, setShowSignupPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  const [loginInfo, setLoginInfo] = useState ({
    email: '',
    password: '',
  });

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const toggleDropdown = () => {
    setDropdownVisible((prev)=>!prev);
  };

  const handleSignup = () => {
    setShowSignupPopup(true);
    setDropdownVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const handleSignupSubmit = async (event) => {
    const email = loginInfo.email;
    const password = loginInfo.password;
    closeSignupPopup();
    event.preventDefault(); // Prevent the default form submission
    await Axios.post('http://localhost:8000/api/recommendations/signup/', {
      email,
      password,
      email,
    })
    .then(res => console.log(res))
    .catch(error => alert(error))
    closeSignupPopup();
    setLoginInfo({
      email: '',
      password: '',
    });
  };

  const handleLogin = () => {
    setShowLoginPopup(true)
    setDropdownVisible(false)
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = loginInfo.email;
    const password = loginInfo.password;
    try {
      const response = await Axios.post('http://localhost:8000/api/recommendations/login/', {
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      //setFirstName(response.data.get('first_name'))
      //setLastName(response.date.get('last_name'))
      setIsLoggedIn(true)
      closeLoginPopup();
    } catch (error){
      alert(error.response.data.error)
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    await Axios.post('http://localhost:8000/api/recommendations/logout/', {
      refresh_token: localStorage.getItem('refresh_token')
    })
    .then(response => console.log(response.data.message))
    .catch(error => console.log(error))
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsLoggedIn(false)
    setLoginInfo({
      email: '',
      password: '',
    });
  }

  const handleEditProfile = () => {
    setShowProfilePopup(true);
  }

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token")
    if (!token) {
      alert("You must be logged in first")
      return
    }
    const response = await Axios.post('http://localhost:8000/api/recommendations/edit-profile/', {
      first_name: firstName,
      last_name: lastName,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => console.log(response.data.message))
    .catch(error => console.log(error))
    setShowProfilePopup(false)
  }

  const closeSignupPopup = () => {
    setShowSignupPopup(false);
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  }

  const handleMyRecommendations = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert("You need to be logged in first!");
      return;
    }
    await Axios.get('http://localhost:8000/api/recommendations/my-recommendations/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => console.log(response.data.message))
    .catch(error => console.log(error))
    setDropdownVisible(false);
  }

  const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    const token = localStorage.getItem("access_token");
    await Axios.post("http://localhost:8000/media/profile_pics/", formData, {
      headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(reponse => console.log(reponse.data))
    .catch(error => console.log(error))
  }
  
  return(
    <header id='mainHeader' height = '50px'>
      {isLoggedIn ? (
        <img 
        id = "profilePic" src = 
        "/DefaultProfilePicture.png" 
        height = "auto" 
        width = "80px" 
        onClick={toggleDropdown}
        style={{cursor: "pointer"}}
      />
      ) : (
        <img 
        id = "profilePic" src = 
        "/DefaultProfilePicture.png" 
        height = "auto" 
        width = "80px" 
        onClick={toggleDropdown}
        style={{cursor: "pointer"}}
      />
      )}
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
          {isLoggedIn ? (
            <div>
              <button
              onClick={handleEditProfile}
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
              Edit Profile
            </button>
              <button
              onClick={handleMyRecommendations}
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
              My Recommendations
            </button>
            <button
            onClick={handleLogout}
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
            Logout
          </button>
          </div>
          ) : (       
          <div>
              <button
                onClick={handleLogin}
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
          )}
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
                name = "email"
                onChange={handleChange}
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
                name = "password"
                onChange={handleChange}
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
              Sign Up
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
        {showLoginPopup && (
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
          <h3>Log In</h3>
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: "10px", marginRight: "10px" }}>
              <label>Email:</label>
              <input
                id="email"
                type="email"
                name = "email"
                onChange={handleChange}
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
                name = "password"
                onChange={handleChange}
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
              Login
            </button>
            <button
              type="button"
              onClick={closeLoginPopup}
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
        {showProfilePopup && (
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
            <h3>Edit Profile</h3>
            <img 
              id = "profilePic" src = 
              "/DefaultProfilePicture.png"  
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "auto",
              }}
            />
            <form onSubmit={handleEditProfileSubmit}>
              <div style={{ marginBottom: "10px", marginRight: "10px" }}>
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                Confirm
              </button>
              <button
              type="button"
              onClick={() => setShowProfilePopup(false)}
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
    const [hover, setHoverRating] = useState(0);
    const [results, setResults] = useState(null);

    
    const handleSearch = async (e) => {
      e.preventDefault();
      alert(`city: '${city}' numPeople: '${numPeople}' budget: '${budget}', rating: '${rating}'`);
      try{
        const response = await Axios.post('http://localhost:8000/api/recommendations/get-recommendation/', {
          city,
          budget,
          rating,
          num_people: numPeople
        });
        setResults(response.data)
      } catch (error){
        console.error(error);
      }
    }

    const handleRatingClick = (rating) => {
      setRating(rating); 
      console.log("Selected Rating:", rating);
    };
    const handleMouseEnter = (star) => {
      setHoverRating(star); // Set hoverRating on mouse hover
    };
    
    const handleMouseLeave = () => {
      setHoverRating(0); // Reset hoverRating on mouse leave
    };
    return(
        <div>
          <Profile />
          <h1 style={{ textAlign: 'center' }}> FOOD FINDER </h1>
          <form action={handleSearch} id='searchFood'>
              <label style={{ textAlign: 'left' }}>City</label>
              <input name="city" id="city" onChange = {(e) => setCity(e.target.value)}/>
              <label style={{ textAlign: 'left' }}>Number of People</label>
              <input type="number" name="numPeople" id="numPeople" onChange = {(e) => setNumPeople(e.target.value)}/>
              <label style={{ textAlign: 'left' }}>Budget</label>
              <input type="number" name="budget" id="budget" onChange = {(e) => setBudget(e.target.value)}/>
              <label style={{textAlign: 'left'}}>Rating</label>
              <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)} // Highlight stars on hover
                    onMouseLeave={handleMouseLeave} // Reset hover effect
                    style={{
                      color: star <= (hover || rating) ? 'gold' : 'gray',
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
