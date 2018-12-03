import React, {Component} from 'react';
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = BigCalendar.momentLocalizer(moment);
// const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class CalendarPage extends Component {
  state = {
    events: [
      {
        start: new Date(),
        end: new Date(moment().add(1, "days")),
        title: "Example Event"
      }
    ]
  };
  render () {
    return (
      <div>
        <BigCalendar
          views={['month', 'week', 'agenda']}
          localizer={localizer}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          defaultView="month"
          events={this.state.events}
          style={{ height: "100vh" }}
        />
      </div>
    );
  }
}

export default CalendarPage;