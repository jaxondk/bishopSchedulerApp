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
          // bg="background: #dbe8f9;
          // background: -moz-linear-gradient(top, #dbe8f9 41%, #b3cee5 64%, #87a0d3 98%, #829be0 100%);
          // background: -webkit-linear-gradient(top, #dbe8f9 41%,#b3cee5 64%,#87a0d3 98%,#829be0 100%);
          // background: linear-gradient(to bottom, #dbe8f9 41%,#b3cee5 64%,#87a0d3 98%,#829be0 100%);
          // filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#dbe8f9', endColorstr='#829be0',GradientType=0 );"
          // backgroundImage="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwYNCAgIBwcHBgcNBw0ICAYHBw8ICRANFREiFhURFRUYHSggGBolGxUfITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDi0ZHxkrKzcrKysrKysrKysrKysrLSsrKysrKysrKysrKysrKysrKysrKystNysrKysrKysrK//AABEIAM0A9gMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAABAgAGB//EABUQAQEAAAAAAAAAAAAAAAAAAAAB/8QAGQEBAQEBAQEAAAAAAAAAAAAAAQIABQQG/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/APTWZnSfJMGorEUGpqiBSmlmTTQoipNBIorClhRWCiKKakkUGiqIqaQYwqTQoiilNJFFKapgKUkswrEuoZmrlvIE0ikgVqCRQalRFFKaWFFKVFqmmgkUNRSworCqIFNSS1TSKoippFUwTVVJIqaaCRQU1TCszEupFNS5TytUmgsKKwqiKKwJFFNSoig1NLCilNUWTTU0lkmiqIorUUxmTTUqLVJopIqSKphU0ikhNVUqIIrFnU0UprlPKKKUktU00KIqTRSworCkgU1NUQDU0sKDU1RZNIpIDUVTChhSQKamqLJpqSWqTRVMKk0UkMzEupqaaHKeQUGpqiKKU0lk01NUzJNFJFSaKSBSmqIFNSWapNTVQsmmiqIDUFhQ1FJFDUVRApTSWSaFMKwrEuqqaRXKeUCmppYA1NURQamkgUpqmZNNBIqTQSKKwqiAQphUmikiisKohNIpYBqFEUNRSRRSmkhmZTOqSaK5TyipNFJArClgKalRFBqSRRSmqIFILCppoVCKKU0kClKmapNBIqTRVEUVhSQKwUwopqSRWYEuqFKa5TyMmmhRFSaCRRWFLCisFEUU1JIoNFURU0gsKk0KIopTSRRSmqYClJLVNNCiKGFJFFYVTBmoJdVQ1DlPKKKU0sKKUqLVNNBIoailhRWFUQKaklqmkVRFTSKpgmqqSRU00EigpqmFFKaSyaalRapNFJFYVizqqmkOU8oopqVEUGppYUUpqiyaaklkmikiisKqMyaalRapNFJFSRVMKmkUkJqqlRFBqaWFBqaSyaU1RZhWJdVUmiuU8gorCkgU1NUQDU0sKDU1RZNIpIDUVTChhSQKamqLJpqSWqTRVMKk0UkClNUQDUkig1JZmZiXUppqa5byMk0UkVJopIFKaogU1JZqk1NVCyaaKogNQWFDUUkUNRVEClNJANCmFSaKSKKwqiAzEszMzOnoNTXLeUClNUzJpoJFSaCRRSmqIBCmFSaKSKmkVRCaRSwDUKIoNSSKKU0kCkKYVNNBIZmJZmZmf//Z"
          backgroundImage="https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/J9H9WF0/blue-turquoise-gradient-polygon-shaped-background-zoomed-in-and-zoomed-out-in-one-motion_nj5dnqsrl__F0000.png"
        >
          <Heading>Secretariat</Heading>
          <br/>
          <img src={require('./calendar3.png')} width="10%"/>
          {/* <Heading>Secretariat</Heading> */}
          <br/><br/>
          <Subhead>Manage a Bishop's schedule with ease</Subhead>
          <p>Keep schedules up to date with automated text reminders</p>
          <Button variant="contained" size="large" color="primary" href="/bishopric">
          Get started
        </Button>
        </Hero>
      </Provider>
    );
  }
}


export default LandingPage;