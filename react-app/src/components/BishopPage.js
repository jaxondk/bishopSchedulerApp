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
      apptDuration: 60, //in minutes
      view: DEFAULT_VIEW,
      dialogOpen: null,
      selectedSlot: null,
      selectedRange: null,
      apptTitle: null,
      apptName: null,
      apptPhone: null,
    };
  }

  componentDidMount () {
    conn.getSlots((data) => this.setState({ allSlots: data }));
  }

  onSelectEvent (slot) {
    this.setState({ dialogOpen: dialogs.SLOT_DETAIL, selectedSlot: slot });
  }

  removeAppt (slot) {
    const firstName = slot.appointment.name.split(' ')[0];
    const body = {
      to: slot.appointment.phone,
      msg: `Hey ${firstName}, Bishop had to cancel his upcoming appointment with you. Please go back to our scheduling site and schedule a new appointment. Thanks! \n -- <3 Your favorite executive secretary`,
    }
    conn.sendText(body);
    const update = {
      title: 'Available',
      appointment: null
    };
    conn.updateSlot(slot._id, update, (slots) => this.setState({ allSlots: slots, dialogOpen: null }));
  }

  removeSlot (slot) {
    conn.deleteSlot(slot._id, (slots) => this.setState({ allSlots: slots }));
    this.setState({ dialogOpen: null });
  }

  handleSelectCell = ({ start, end }) => {
    this.setState({ dialogOpen: dialogs.ADD_SLOT, selectedRange: { start, end } });
  }

  addSlots ({ start, end }) {
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
    this.setState({ dialogOpen: null });
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
    this.setState({ dialogOpen: null })
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
          Add Appointment?
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
            Add slot(s)?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Create new available time slot(s) from this range?
            </DialogContentText>
          </DialogContent>
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
              {this.state.selectedSlot.appointment ? this.state.selectedSlot.appointment.name : 'No appointment during this available timeslot'}
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

  render () {
    return (
      <div style={styles.pageContainer}>
        <AppBar
          title="Bishop's Schedule"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={false}
        />
        {/* <InputSlider
          className="slider"
          axis="x"
          x={this.state.apptDuration}
          xmin={15}
          xmax={120}
          xstep={15}
          onChange={(pos) => this.setState({ apptDuration: pos.x })}
        /> */}
        <div style={styles.calendarContainer}>
          <BigCalendar
            views={['day', 'week', 'month', 'agenda']}
            localizer={localizer}
            step={this.state.apptDuration}
            defaultDate={new Date()}
            defaultView={DEFAULT_VIEW}
            events={this.state.allSlots}
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
        {/* {this.renderAddSlotDialog()} */}
      </div>
    );
  }
}

export default BishopPage;