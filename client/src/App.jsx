import  "./App.css"
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route , Link} from "react-router-dom";
import Homepage from './components/Homepage/Homepage'
import { LeftPanel } from './components/Leftpanel/LeftPanel';
import { RightPanel } from './components/Rightpanel/RightPanel';
import Explorepage from './components/Explorepage/Explorepage';
import Login from './components/Login Signup/Login';
import Signup from './components/Login Signup/Signup';
import UserState from './contexts/UserState'
import ProfilePage from "./components/Profilepage/ProfilePage";
import CreatePost from "./components/Createpost/CreatePost";
import SearchPage from "./components/Searchpage/SearchPage";


function App() {
  
  return (
    <>
    <UserState>
      <Router>
      <RightPanel/>
      <LeftPanel/>
        <Routes>
          <Route exact path="/" element={ <Homepage/> }/>
          <Route exact path="/index.html" element={ <Homepage/> }/>
          <Route exact path="/homefeed" element={<Homepage/>}/>
          <Route exact path="/login" element={ <Login/> }/>
          <Route exact path="/signup" element={ <Signup/> }/>
          <Route exact path="/explorepage" element={ <Explorepage/> }/>
          <Route exact path="/userprofile/:userId" element={ <ProfilePage/> }/>
          {/* <Route exact path="/editprofile" element={ <EditProfile/> }/> feature not available yet  */}
          <Route exact path="/createpost" element={ <CreatePost/> }/>
          <Route exact path="/searchuser" element={ <SearchPage/> }/>
          <Route exact path="/savedposts" element={<h1>savedposts</h1>}/>
          <Route exact path="/*" element={<h1>Page not Found</h1>}/>
        </Routes>
      </Router>
    </UserState>
    </>
  )
}

export default App
