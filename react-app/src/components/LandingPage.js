import React, {Component} from 'react';
import { Provider, Heading, Subhead } from 'rebass'
// import { Heading } from 'rebass'
import {
  Hero, CallToAction, RaisedButton
} from 'react-landing-page'

const markdownStyles = {
  // paragraph: {
  //   fontSize: 14,
  //   marginBottom: 10,
  //   lineHeight: 21,
  // },
  // color: 'white'
  
}


class LandingPage extends Component {
  render() {
    return (
      <Provider>
        <Hero
          color="black"
          bg="#F0FFFF"
          // backgroundImage="https://source.unsplash.com/jxaj-UrzQbc/1600x900"
          // backgroundImage="https://amppob.com/wp-content/uploads/2018/06/iStock-916563360-810x405.jpg"
        >
          <img src={require('./calendar.png')} width="20%"/>
          <Heading style={markdownStyles}>Secretariat</Heading>
          <br/>
          <Subhead style={markdownStyles}>Manage a Bishop's schedule with ease</Subhead>
          <p style={markdownStyles}>Keep schedules up to date with automated text reminders</p>
          <CallToAction href="/getting-started" mt={3}>Get Started</CallToAction>
          {/* make CallToAction into a Rounded button */}
        </Hero>
      </Provider>
    );
  }
}

export default LandingPage;