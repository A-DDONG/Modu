// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Header from "./Header";
import WriteForm from "./WriteForm";
import Login from "./Login";
import SignUp from "./SignUp";
import MainPage from "./MainPage";
import PostDetail from "./PostDetail";
import "./css/reset.css";
import "./css/layout.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // 구독 해제
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div id="wrapper">
      <Router>
        <Header user={currentUser} />
        <Routes>
          <Route path="/write" element={<WriteForm user={currentUser} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/edit/:postId" element={<WriteForm />} />
          <Route path="/write" element={<WriteForm />} />
          <Route
            path="/"
            element={<MainPage user={currentUser} onLogout={handleLogout} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
