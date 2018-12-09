import React, {Component} from 'react';
import AppBar from "material-ui/AppBar";
import BigCalendar from "react-big-calendar";
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

class SlotPickerPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      allSlots: [],
      apptDuration: 60 //in minutes
    };
  }

  componentDidMount() {
    conn.getSlots((data) => this.setState({allSlots: data}));
  }

  onSelectEvent(slot) {
    const prompt = (slot.appointment) ? 'Would you like to cancel this appointment?' : 'Would you like to remove this time slot?';
    const remove = window.confirm(prompt)
    if(remove) {
      //TODO - send text to member letting them know about cancelation
      if(slot.appointment) {
        const firstName = slot.appointment.name.split(' ')[0];
        const body = {
          to: slot.appointment.phone,
          msg: `Hey ${firstName}, Bishop had to cancel his upcoming appointment with you. Please go back to our scheduling site and schedule a new appointment. Thanks! \n <3 Your favorite executive secretary <3`,
        }
        conn.sendText(body);
      }
      
      conn.deleteSlot(slot._id, (slots) => this.setState({allSlots: slots}));
    }
  }

  handleSelect = ({ start, end }) => {
    const create = window.confirm('Create new available time slots from this range?')
    if (create) {
      const range = moment.range(start, end);
      var times = Array.from(range.by('minutes', {step: this.state.apptDuration}));
      times.forEach((start_moment, i) => {
        if(i !== times.length - 1) {
          const new_slot = {
            start: start_moment._d,
            end: times[i+1]._d,
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
            views={['day', 'week', 'month','agenda']}
            localizer={localizer}
            step={this.state.apptDuration}
            defaultDate={new Date()}
            defaultView="week"
            events={this.state.allSlots}
            style={{ height: "100vh" }}
            selectable
            onSelectEvent={(event) => this.onSelectEvent(event)}
            onSelectSlot={this.handleSelect}
            eventPropGetter={this.eventStyleGetter}
            min={moment("8:00 AM", "H:mm a")._d}
            max={moment("6:00 PM", "H:mm a")._d}
          />
        </div>
      </div>
    );
  }
}

export default SlotPickerPage;