import React, { Component } from 'react';
import AppBar from "material-ui/AppBar";
import BigCalendar from "react-big-calendar";
import Button from '@material-ui/core/Button';
import TextField from "material-ui/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import { dialogs } from '../constants';
import { slotRange } from '../lib/util';
import conn from '../lib/conn';

const localizer = BigCalendar.momentLocalizer(moment);
const styles = {
  pageContainer: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    margin: 10,
  },
  takenSlot: {
    padding: '2px 5px',
    backgroundColor: 'lightgrey',
    borderRadius: '5px',
    color: 'black',
    cursor: 'default',
    pointerEvents: 'none',
  },
}
const DEFAULT_VIEW = 'week';
const BISHOP_PHONE = '8323144134';

class BishopPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allSlots: [],
      apptDuration: 15, //in minutes
      view: DEFAULT_VIEW,
      dialogOpen: null,
      selectedSlot: null,
      apptTitle: null,
      apptName: null,
      apptPhone: null,
      validPhone: true,
      toastText: null,
    };
  }

  componentDidMount () {
    conn.getSlots((data) => this.setState({ allSlots: data }));
  }

  onSelectEvent (slot) {
    if (!slot.appointment) {
      this.setState({ dialogOpen: dialogs.ADD_APPT, selectedSlot: slot });
    }
  }

  eventStyleGetter (slot) {
    let style = JSON.parse(JSON.stringify(styles.takenSlot));

    if (!slot.appointment) {
      style.color = '#fff';
      style.backgroundColor = "#3174ad";
      style.borderColor = '#224f77';
      style.borderLeft = '6px solid #224f77';
      style.cursor = 'pointer';
      style.pointerEvents = 'auto';
    }

    return {
      className: "",
      style: style
    };
  }

  handleApptInputChange = (name) => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addAppt () {
    const update = {
      title: this.state.apptTitle,
      appointment: {
        name: this.state.apptName,
        phone: this.state.apptPhone,
      }
    };
    // Prepare texts
    const time = this.state.selectedSlot.start;
    const date = moment(time).format("dddd[,] MMMM Do");
    const startTime = moment(time).format("h:mm a");
    const body = {
      to: BISHOP_PHONE,
      msg: `Bishop, ${update.appointment.name} just signed up to meet with you on ${date} at ${startTime}. The purpose they stated for the appointment is "${update.title}" \n -- <3 Your favorite executive secretary`,
    }
    const member_body = { // if we want to send text to member that they scheduled an appointment
      to: update.appointment.phone,
      msg: `${update.appointment.name.split(' ')[0]}, this is a reminder of your appointment with Bishop on ${date} at ${startTime} for "${update.title}".`,
    }

    conn.updateSlot(this.state.selectedSlot._id, update, (slots) => {
      this.setState({ allSlots: slots })
      conn.sendText(body, (success) => this.setState({ toastText: success ? 'Text notification sent to Bishop!' : 'Text notification failed to send' }));
      conn.sendText(member_body);
    });
    this.setState({ dialogOpen: null, apptName: null, apptPhone: null, apptTitle: null, validPhone: true})
  }

  renderAddApptDialog () {
    if(this.state.dialogOpen === dialogs.ADD_APPT) return (
      <Dialog
        open
        keepMounted
        onClose={() => this.setState({ dialogOpen: null })}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Schedule Appointment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {slotRange(this.state.selectedSlot)}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Full Name"
            fullWidth
            name="Full Name"
            hintText="First Name"
            floatingLabelText="First Name"
            onChange={this.handleApptInputChange('apptName')}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone Number"
            fullWidth  
            name="Phone Number"
            hintText="5555555555"
            floatingLabelText="Phone Number"
            onChange={(evt, newValue) =>
              this.validatePhone(newValue)
            }
            errorText={
              this.state.validPhone ? null : "Enter a valid phone number"
            }
          />
          <TextField
            margin="dense"
            id="title"
            label="Purpose"
            fullWidth
            name="Purpose"
            hintText='"Temple Recommend Interview"'
            floatingLabelText="Purpose"
            onChange={this.handleApptInputChange('apptTitle')}
            onKeyDown={(evt) =>
              this.keyPress(evt, this.state)} //submits appointment form when ENTER is pressed
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={(this.state.apptName && this.state.apptTitle && this.state.apptPhone && this.state.validPhone)? false : true} onClick={() => this.addAppt()} color="primary">
            Schedule
          </Button>
          <Button onClick={() => this.setState({ dialogOpen: null })} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  validatePhone(phoneNumber) {
    const newPhone = phoneNumber.replace(/\D/g,''); //removes any non-digits in the string
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phoneNumber)
      ? this.setState({ apptPhone: newPhone, validPhone: true })
      : this.setState({ apptPhone: newPhone, validPhone: false });
  }

  keyPress(e, data){
    if(e.keyCode === 13){
      console.log("enter pressed");
      if(data.apptName && data.apptTitle && data.apptPhone && data.validPhone){
        console.log("adding appt");
        this.addAppt();
      }
    }
  }

  renderSmsToast () {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.toastText}
        autoHideDuration={3000}
        onClose={() => this.setState({ toastText: null })}
        message={<span id="message-id">{this.state.toastText}</span>}
      >
      </Snackbar>
    )
  }

  render () {
    return (
      <div style={styles.pageContainer}>
        <AppBar
          titleStyle={{ lineHeight: 'normal' }}
          title={
            <div>
              <div style={{ marginTop: 10 }}>Your Bishop's Schedule</div>
              <div style={{ fontSize: 'small', fontWeight: 300 }}>Click on a slot to reserve an appointment time.</div>
            </div>
          }
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={false}
        />
        <div style={styles.calendarContainer}>
          <BigCalendar
            views={['day', 'week', 'month', 'agenda']}
            localizer={localizer}
            step={this.state.apptDuration}
            defaultDate={new Date()}
            defaultView={DEFAULT_VIEW}
            events={this.state.allSlots}
            titleAccessor={(slot) => ((slot.appointment) ? 'Slot Taken' : 'Available')}
            style={{ height: "100vh" }}
            selectable={false}
            onView={(view) => this.setState({ view: view })}
            onSelectEvent={(event) => this.onSelectEvent(event)}
            eventPropGetter={this.eventStyleGetter}
            min={moment("8:00 AM", "H:mm a")._d}
            max={moment("6:00 PM", "H:mm a")._d}
          />
        </div>
        {this.renderAddApptDialog()}
        {this.renderSmsToast()}
      </div>
    );
  }
}

export default BishopPage;