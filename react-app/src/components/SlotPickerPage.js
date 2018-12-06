import React, {Component} from 'react';
import AppBar from "material-ui/AppBar";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
// import InputSlider from 'react-input-slider';



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
  state = {
    events: [],
    apptDuration: 60 //in minutes
  };

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
    const create = window.confirm('Create new available time slot?')
    if (create) {
      const title = 'Available';
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      });
      console.log(this.state.events);
    }
  }

  render () {
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
            events={this.state.events}
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