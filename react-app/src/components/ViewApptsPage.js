import React, {Component} from 'react';
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { mockAppts } from '../constants';

const localizer = BigCalendar.momentLocalizer(moment);
// const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class ViewApptsPage extends Component {
  state = {
    events: mockAppts
  };

  onSelectEvent(event) {
    const remove = window.confirm("Would you like to cancel this appointment?")
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

  render () {
    return (
      <div>
        <BigCalendar
          views={['month', 'week', 'day', 'agenda']}
          localizer={localizer}
          step={30}
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          style={{ height: "100vh" }}
          onSelectEvent = {(event) => this.onSelectEvent(event)}
          popup
          min={moment("8:00 AM", "H:mm a")._d}
          max={moment("6:00 PM", "H:mm a")._d}
        />
      </div>
    );
  }
}

export default ViewApptsPage;