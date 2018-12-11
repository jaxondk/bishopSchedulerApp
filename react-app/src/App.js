import React, { Component } from "react";
// import logo from "./logo.svg";
import AppointmentApp from "./components/AppointmentApp.js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./App.css";
import CalendarPage from "./components/CalendarPage";
import LandingPage from "./components/LandingPage";

class App extends Component {
  render () {
    return (
      <div>
        <MuiThemeProvider>
          <LandingPage />
          {/* <CalendarPage /> */}
          {/* <AppointmentApp /> */}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
