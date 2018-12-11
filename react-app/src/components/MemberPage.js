import React, { Component } from 'react';
import AppBar from "material-ui/AppBar";
import BigCalendar from "react-big-calendar";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
// import InputSlider from 'react-input-slider';
import { dialogs } from '../constants';
import conn from '../lib/conn';
const moment = extendMoment(Moment);

const localizer = BigCalendar.momentLocalizer(moment);
const styles = {
  pageContainer: {
    flex: 1,
  },
  // sliderContainer: {
  //   flex: 1,
  // },
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

class BishopPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allSlots: [],
      apptDuration: 60, //in minutes
      view: DEFAULT_VIEW,
      dialogOpen: null,
      selectedSlot: null,
      apptTitle: null,
      apptName: null,
      apptPhone: null,
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
    conn.updateSlot(this.state.selectedSlot._id, update, (slots) => this.setState({ allSlots: slots }));
    this.setState({ dialogOpen: null })
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
          Schedule Appointment
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Full Name"
            fullWidth
            onChange={this.handleApptInputChange('apptName')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="phone"
            label="Phone Number"
            fullWidth
            onChange={this.handleApptInputChange('apptPhone')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Purpose"
            fullWidth
            onChange={this.handleApptInputChange('apptTitle')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.addAppt()} color="primary">
            Schedule
          </Button>
          <Button onClick={() => this.setState({ dialogOpen: null })} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render () {
    return (
      <div style={styles.pageContainer}>
        <AppBar
          title="Your Bishop's Schedule"
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
      </div>
    );
  }
}

export default BishopPage;