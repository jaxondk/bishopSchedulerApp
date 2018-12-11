import React, {Component} from 'react';
import { Provider, Heading, Subhead } from 'rebass'
// import { Heading } from 'rebass'
import {
  Hero, CallToAction
} from 'react-landing-page'
import Button from '@material-ui/core/Button';

class LandingPage extends Component {
  render() {
    return (
      <Provider>
        <Hero
          color="black"
          bg="background: #dbe8f9;
          background: -moz-linear-gradient(top, #dbe8f9 41%, #b3cee5 64%, #87a0d3 98%, #829be0 100%);
          background: -webkit-linear-gradient(top, #dbe8f9 41%,#b3cee5 64%,#87a0d3 98%,#829be0 100%);
          background: linear-gradient(to bottom, #dbe8f9 41%,#b3cee5 64%,#87a0d3 98%,#829be0 100%);
          filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#dbe8f9', endColorstr='#829be0',GradientType=0 );"
          // backgroundImage="https://source.unsplash.com/jxaj-UrzQbc/1600x900"
          // backgroundImage="https://amppob.com/wp-content/uploads/2018/06/iStock-916563360-810x405.jpg"
        >
          <img src={require('./calendar2.png')} width="25%"/>
          <Heading>Secretariat</Heading>
          <br/>
          <Subhead>Manage a Bishop's schedule with ease</Subhead>
          <p>Keep schedules up to date with automated text reminders</p>
          {/* <CallToAction href="/getting-started" mt={3}>Get Started</CallToAction> */}
          {/* make CallToAction into a Rounded button */}
          <Button variant="contained" size="large" color="primary" href="/bishopric">
          Get started
        </Button>
        </Hero>
      </Provider>
    );
  }
}


export default LandingPage;