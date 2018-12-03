import React, { Component } from "react";
import logo from "./logo.svg";
import AppointmentApp from "./components/AppointmentApp.js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./App.css";
import CalendarPage from "./components/CalendarPage";

class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <CalendarPage />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
