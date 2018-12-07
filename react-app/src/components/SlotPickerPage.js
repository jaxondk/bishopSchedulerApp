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
  }
}

class SlotPickerPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      events: [],
      allSlots: [],
      apptDuration: 60 //in minutes
    };
  }

  componentDidMount() {
    conn.getSlots((data) => this.setState({allSlots: data}));
  }

  onSelectEvent(event) {
    const remove = window.confirm("Would you like to remove this time slot?")
    if(remove) {
      //TODO - send text to member letting them know about cancelation
      this.setState((prevState, props) => {
        const events = [...prevState.events]
        const idx = events.indexOf(event)
        events.splice(idx, 1);
        return { events };
      });
    }
  }

  handleSelect = ({ start, end }) => {
    const create = window.confirm('Create new available time slots from this range?')
    if (create) {
      const range = moment.range(start, end);
      var times = Array.from(range.by('minutes', {step: this.state.apptDuration}));
      const new_slots = times.reduce((result, start_moment, i) => {
        if(i !== times.length - 1) {
          result.push({
            start: start_moment._d,
            end: times[i+1]._d
          })
        }
        return result;
      }, []);
      new_slots.forEach(new_slot => {
        conn.createSlot(new_slot, (new_slot) => this.setState({ allSlots: [...this.state.allSlots, new_slot]}));
      });
    }
  }

  render () {
    console.log('all slots', this.state.allSlots);
    return (
      <div style={styles.pageContainer}>
        <AppBar
          title="Choose Your Available Times"
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
            views={['week']}
            localizer={localizer}
            step={this.state.apptDuration}
            defaultDate={new Date()}
            defaultView="week"
            events={this.state.allSlots}
            style={{ height: "100vh" }}
            selectable
            onSelectEvent={(event) => this.onSelectEvent(event)}
            onSelectSlot={this.handleSelect}
            min={moment("8:00 AM", "H:mm a")._d}
            max={moment("6:00 PM", "H:mm a")._d}
          />
        </div>
      </div>
    );
  }
}

export default SlotPickerPage;