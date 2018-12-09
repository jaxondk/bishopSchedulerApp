import React, { Component } from 'react';
import AppBar from "material-ui/AppBar";
import BigCalendar from "react-big-calendar";
import Button from '@material-ui/core/Button';
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
    marginTop: 10,
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

class CalendarPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allSlots: [],
      apptDuration: 60, //in minutes
      view: DEFAULT_VIEW,
      detailDialogOpen: false,
      addSlotDialogOpen: false,
      selectedSlot: null,
      selectedCell: null,
    };
  }

  componentDidMount () {
    conn.getSlots((data) => this.setState({ allSlots: data }));
  }

  onSelectEvent (slot) {
    this.setState({ selectedSlot: slot });
    this.setState({ detailDialogOpen: true });
    // const prompt = (slot.appointment) ? 'Would you like to cancel this appointment?' : 'Would you like to remove this time slot?';
    // const remove = window.confirm(prompt)
    // if(remove) {
    //   if(slot.appointment) {
    //     const firstName = slot.appointment.name.split(' ')[0];
    //     const body = {
    //       to: slot.appointment.phone,
    //       msg: `Hey ${firstName}, Bishop had to cancel his upcoming appointment with you. Please go back to our scheduling site and schedule a new appointment. Thanks! \n -- <3 Your favorite executive secretary`,
    //     }
    //     conn.sendText(body);
    //   }

    //   conn.deleteSlot(slot._id, (slots) => this.setState({allSlots: slots}));
    // }
  }

  removeSlot (slot) {
    if (slot.appointment) {
      const firstName = slot.appointment.name.split(' ')[0];
      const body = {
        to: slot.appointment.phone,
        msg: `Hey ${firstName}, Bishop had to cancel his upcoming appointment with you. Please go back to our scheduling site and schedule a new appointment. Thanks! \n -- <3 Your favorite executive secretary`,
      }
      conn.sendText(body);
    }
    conn.deleteSlot(slot._id, (slots) => this.setState({ allSlots: slots }));
    this.setState({ detailDialogOpen: false })
  }

  handleSelectCell = ({ start, end }) => {
    const create = window.confirm('Create new available time slots from this range?')
    if (create) {
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
    }
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

  renderDialog () {
    if(this.state.detailDialogOpen) {
      return (
        <div>
          <Dialog
            open
            TransitionComponent={(props) => (<Slide direction="up" {...props} />)}
            keepMounted
            onClose={() => this.setState({ detailDialogOpen: false })}
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
              <Button onClick={() => this.removeSlot(this.state.selectedSlot)} color="primary">
                {this.state.selectedSlot.appointment ? 'Cancel Appointment' : 'Remove Timeslot'}
              </Button>
              <Button onClick={() => this.setState({ detailDialogOpen: false })} color="secondary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }

  render () {
    console.log('all slots', this.state.allSlots);
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
      </div>
    );
  }
}

export default CalendarPage;