import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
// import logo from "./logo.svg";
import MemberPage from "./components/MemberPage";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./App.css";
import BishopPage from "./components/BishopPage";
import LandingPage from "./components/LandingPage";

class App extends Component {
  render () {
    return (
      <div>
        <MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/bishopric" component={BishopPage} />
            <Route path="/members" component={MemberPage} />
          </Switch>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
