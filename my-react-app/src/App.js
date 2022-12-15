import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import View from "./pages/view";
import Add from "./pages/add";
import "./App.css";
import "./styles/login.css";
import "./styles/home.css";
import "./styles/header.css";

class App extends Component {
  render() {
    return (
      <Router>
          <Routes>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/home" element={<Home />}></Route>
            <Route exact path="/edit" element={<View />}></Route>
            <Route exact path="/add" element={<Add/>}></Route>
          </Routes>
      </Router>
    );
  }
}

export default App;
