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
import Slide from '@material-ui/core/Slide';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { dialogs } from '../constants';
import conn from '../lib/conn';
import { slotRange } from '../lib/util';

import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

const moment = extendMoment(Moment);
const localizer = BigCalendar.momentLocalizer(moment);
const styles = {
  pageContainer: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    margin: 10,
  },
  emptySlot: {
    padding: '2px 5px',
    backgroundColor: 'lightgrey',
    borderRadius: '5px',
    color: 'black',
    cursor: 'pointer',
  },
}
const DEFAULT_VIEW = 'week';

class BishopPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allSlots: [],
      apptDuration: 15, //in minutes
      view: DEFAULT_VIEW,
      toastText: false,
      dialogOpen: null,
      selectedSlot: null,
      selectedRange: null,
      apptTitle: null,
      apptName: null,
      apptPhone: null,
      validPhone: true
    };
  }

  componentDidMount () {
    conn.getSlots((data) => this.setState({ allSlots: data }));
  }

  onSelectEvent (slot) {
    this.setState({ dialogOpen: dialogs.SLOT_DETAIL, selectedSlot: slot });
  }

  removeAppt (slot) {
    // Prepare cancelation text
    const firstName = slot.appointment.name.split(' ')[0];
    const time = this.state.selectedSlot.start;
    const date = moment(time).format("dddd[,] MMMM Do");
    const startTime = moment(time).format("h:mm a");
    const body = {
      to: slot.appointment.phone,
      msg: `Hey ${firstName}, Bishop had to cancel his upcoming appointment with you on ${date} at ${startTime}. Please go back to our scheduling site and schedule a new appointment. Thanks! \n -- <3 Your favorite executive secretary`,
    }
    
    // remove appt from db.
    const update = {
      title: 'Available',
      appointment: null
    };
    conn.updateSlot(slot._id, update, (slots) => {
      this.setState({ allSlots: slots, dialogOpen: null })
      conn.sendText(body, (success) => this.setState({toastText: success ? `Text notification sent to ${firstName}!` : 'Text notification failed to send'}));
    });
  }

  removeSlot (slot) {
    conn.deleteSlot(slot._id, (slots) => this.setState({ allSlots: slots }));
    this.setState({ dialogOpen: null });
  }

  handleSelectCell = ({ start, end }) => {
    this.setState({ dialogOpen: dialogs.ADD_SLOT, selectedRange: { start, end } });
  }

  addSlots ({ start, end }) {
    const length = moment(start).add("minutes", this.state.apptDuration);
    if(end < length){
      end = length;
    }
    const range = moment.range(start, end);
    var times = Array.from(range.by('minutes', { step: this.state.apptDuration }));
    times.forEach((start_moment, i) => {
      if (i !== times.length - 1) {
        const new_slot = {
          start: start_moment._d,
          end: times[i + 1]._d,
          title: 'Available',
        };
        conn.createSlot(new_slot, (new_slot) => this.setState({ allSlots: [...this.state.allSlots, new_slot] }));
      }
    });
    this.setState({ dialogOpen: null, apptDuration: 15});
  }

  eventStyleGetter (slot) {
    let style = JSON.parse(JSON.stringify(styles.emptySlot));

    if (slot.appointment) {
      style.backgroundColor = "lightgreen";
      style.borderColor = 'green';
      style.borderLeft = '6px solid green';
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
    conn.updateSlot(this.state.selectedSlot._id, update, (slots) => this.setState({ allSlots: slots }));
    this.setState({ dialogOpen: null, apptName: null, apptPhone: null, apptTitle: null, validPhone: true})
  }

  renderDialog () {
    switch (this.state.dialogOpen) {
      case dialogs.ADD_APPT:
        return this.renderAddApptDialog();
      case dialogs.ADD_SLOT:
        return this.renderAddSlotDialog();
      case dialogs.SLOT_DETAIL:
        return this.renderDetailDialog();
      default:
        return null;
    }
  }

  renderAddApptDialog () {
    return (
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
  
  keyPress(e, data){
    if(e.keyCode === 13){
      if(data.apptName && data.apptTitle && data.apptPhone && data.validPhone){
        this.addAppt();
      }
    }
  }
  renderApptDurations() {
    if (!this.state.isLoading) {
      const durations = [15, 30, 45, 60];
        return durations.map(duration => {
          return (
            <RadioButton
              label={duration + " minutes"}
              key={durations.indexOf(duration)}
              value={duration}
              style={{
                marginBottom: 15,
              }}
            />
          );
        });
      }
  }

  validatePhone(phoneNumber) {
    const newPhone = phoneNumber.replace(/\D/g,''); //removes any non-digits in the string
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phoneNumber)
      ? this.setState({ apptPhone: newPhone, validPhone: true })
      : this.setState({ apptPhone: newPhone, validPhone: false });
  }

  handleSetAppointmentDuration(duration) {
    this.setState({ apptDuration: duration });
    // this.state.apptDuration = duration; //don't want it to rerender each time it's changed.. is there a etter way to do this?
  }

  renderDetailBtns () {
    if (!this.state.selectedSlot.appointment) {
      return (
        <React.Fragment>
          <Button onClick={() => this.setState({ dialogOpen: dialogs.ADD_APPT })} color="primary">
            Add Appointment
          </Button>
          <Button onClick={() => this.removeSlot(this.state.selectedSlot)} color="primary">
            Remove Timeslot
          </Button>
        </React.Fragment>
      );
    } else return (
      <Button onClick={() => this.removeAppt(this.state.selectedSlot)} color="primary">
        Cancel Appointment
      </Button>
    );
  }

  renderAddSlotDialog () {
    return (
      <div>
        <Dialog
          open
          TransitionComponent={(props) => (<Slide direction="down" {...props} />)}
          keepMounted
          onClose={() => this.setState({ dialogOpen: null })}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Choose duration for appointment slot(s):
          </DialogTitle>
          <RadioButtonGroup
            style={{
              marginTop: 15,
              marginLeft: 15
            }}
            name="appointmentTimes"
            defaultSelected={15}
            onChange={(evt, val) => this.handleSetAppointmentDuration(val)}
          >
          {this.renderApptDurations()}
          </RadioButtonGroup>
          <DialogActions>
            <Button onClick={() => this.addSlots(this.state.selectedRange)} color="primary">
              Add Slot(s)
            </Button>
            <Button onClick={() => this.setState({ dialogOpen: null })} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  renderDetailDialog () {
    return (
      <div>
        <Dialog
          open
          TransitionComponent={(props) => (<Slide direction="down" {...props} />)}
          keepMounted
          onClose={() => this.setState({ dialogOpen: null })}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.state.selectedSlot.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.state.selectedSlot.appointment ? 'With ' + this.state.selectedSlot.appointment.name + ' at ' : 'No appointment from '} {slotRange(this.state.selectedSlot)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {this.renderDetailBtns()}
            <Button onClick={() => this.setState({ dialogOpen: null })} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  renderSmsToast() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.toastText}
        autoHideDuration={3000}
        onClose={() => this.setState({toastText: null})}
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
              <div style={{ marginTop: 10}}><strong>Your Schedule</strong></div>
              <div style={{ fontSize: 'small', fontWeight: 300 }}><strong>Click</strong> on the calendar to set a time you're available to meet. <strong>Click and drag</strong> to select multiple times at once.</div>
            </div>
          }
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={false}
        />
        <div style={styles.calendarContainer}>
          <BigCalendar
            views={['day', 'week', 'month', 'agenda']}
            localizer={localizer}
            // step={this.state.apptDuration}
            step={15}
            defaultDate={new Date()}
            defaultView={DEFAULT_VIEW}
            events={this.state.allSlots}
            titleAccessor={(slot) => (slot.appointment) ? ''+(slot.appointment.name)+': '+slot.title : slot.title}
            style={{ height: "100vh" }}
            selectable={(this.state.view === 'month') ? false : 'ignoreEvents'}
            onView={(view) => this.setState({ view: view })}
            onSelectEvent={(event) => this.onSelectEvent(event)}
            onSelectSlot={this.handleSelectCell}
            eventPropGetter={this.eventStyleGetter}
            min={moment("8:00 AM", "H:mm a")._d}
            max={moment("6:00 PM", "H:mm a")._d}
          />
        </div>
        {this.renderDialog()}
        {this.renderSmsToast()}
      </div>
    );
  }
}

export default BishopPage;