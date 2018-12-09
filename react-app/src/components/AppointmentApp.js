import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import moment from "moment";
import DatePicker from "material-ui/DatePicker";
import Dialog from "material-ui/Dialog";
// import SelectField from "material-ui/SelectField";
// import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
// import SnackBar from "material-ui/Snackbar";
import Card from "material-ui/Card";
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from "material-ui/Stepper";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import axios from 'axios';
import conn from "../lib/conn";


const API_BASE = "http://localhost:8083/api/";

class AppointmentApp extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = this.getDefaultState();
    // console.log("this.state: ", this.state);
  }

  getDefaultState(){
    // const defaultState = {
    return {
      appointmentDate: "", 
      appointmentDateSelected: false,
      appointmentSlot: null,
      appointmentTitle: "",
      availableAppointmentSlots: [],
      confirmationModalOpen: false,
      confirmationSnackbarMessage: "",
      confirmationSnackbarOpen: false,
      confirmationTextVisible: false,
      finished: false,
      firstName: "",
      lastName: "",
      openSlots: [],
      phone: "",
      processed: false,
      schedule: [],
      smallScreen: false,
      stepIndex: 0,
      validPhone: true,
    };
    // return defaultState;
  }

  componentWillMount() {
    conn.getSlots(this.handleDBReponse);
    // axios.get(API_BASE + `slots`).then(response => {
    //   console.log("response via db: ", response.data);
    //   this.handleDBReponse(response.data);
    // })
    // .catch((err) => console.log('err retrieving slots', err));
  }
  handleSetAppointmentDate(date) {
    const dateString = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
    const openSlots = this.state.openSlots
    if(openSlots[dateString]){
      //need to order time slots..
      const relevantSlots = openSlots[dateString];
      function compare(a,b) {
        if (a.start < b.start)
          return -1;
        if (a.start > b.start)
          return 1;
        return 0;
      }
      relevantSlots.sort(compare);

      this.setState({availableAppointmentSlots: relevantSlots});
      console.log("relevant slots:", relevantSlots);
    }
    this.setState({ appointmentDate: date, confirmationTextVisible: true, appointmentDateSelected: true });
  }

  handleSetAppointmentSlot(slot) {
    this.setState({ appointmentSlot: slot });
  }
  handleSetAppointmentMeridiem(meridiem) {
    this.setState({ appointmentMeridiem: meridiem });
  }
  handleSubmit() {
    const newAppointment = {
      name: this.state.firstName + " " + this.state.lastName,
      phone: this.state.phone,
      title: this.state.appointmentTitle
    };
    // this.setState({ confirmationModalOpen: false });
    axios
      .put(API_BASE + "slots/"+ this.state.appointmentSlot._id, newAppointment) // Instead, use slot2controller's update with appt call
      .then(response =>
        {
          console.log("appointment successfully added to DB!");
          this.setState({
          confirmationSnackbarMessage: "Appointment succesfully added!",
          confirmationSnackbarOpen: true,
          processed: true    
        });        
        this.setState({ confirmationModalOpen: false });
        this.renderSuccessDialog();}
      )
      .catch(err => {
        console.log(err);
        console.log("appointment failed to save");
        return this.setState({
          confirmationSnackbarMessage: "Appointment failed to save.",
          confirmationSnackbarOpen: true
        });
      });
  }
  
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };
  validatePhone(phoneNumber) {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phoneNumber)
      ? this.setState({ phone: phoneNumber, validPhone: true })
      : this.setState({ phone: phoneNumber, validPhone: false });
  }
  checkDisableDate(day) {
    const dateString = moment(day).format("YYYY-DD-MM");
    return (
      this.state.schedule[dateString] === true ||
      moment(day)
        .startOf("day")
        .diff(moment().startOf("day")) < 0
    );
  }

  
  handleDBReponse(response) {
    // const appointments = response;
    const openSlots = {};
    response.forEach(function(slot){  
      const {start, appointment} = slot;
      const dateString = moment(start, "YYYY-DD-MM").format(
        "YYYY-DD-MM"
      );
      if(!appointment){
        if(!openSlots[dateString]){
          openSlots[dateString] = [];
        }
        openSlots[dateString].push(slot);
      }
    });
    console.log("openSlots by date: ", openSlots);

    this.setState({
      openSlots: openSlots
    });
  }
  renderAppointmentConfirmation() {
    const spanStyle = { color: "#00C853" };
    if(this.state.appointmentSlot){
      return (
        <section>
          <p>
            Name:{" "}
            <span style={spanStyle}>
              {this.state.firstName} {this.state.lastName}
            </span>
          </p>
          <p>
            Number: <span style={spanStyle}>{this.state.phone}</span>
          </p>
          <p>
            Appointment:{" "}
            <span style={spanStyle}>
              {moment(this.state.appointmentSlot.start).format(
                "dddd[,] MMMM Do[,] YYYY"
              )}
            </span>{" "}
            at{" "}
            <span style={spanStyle}>
              {moment(this.state.appointmentSlot.start)
                // .hour(9)
                // .minute(0)
                // .add(this.state.appointmentSlot.start, "hours")
                .format("h:mm a")}
            </span>
          </p>
        </section>
      );
    }
  }

  renderSuccessDialog() {
    const spanStyle = { color: "#00C853" };
    return (
      <section>
        <p>
          Thank you, {" "}
          <span style={spanStyle}>
            {this.state.firstName} {this.state.lastName}
          </span>!
        </p>
        <p>
          Your appointment has been scheduled for{" "}
          <span style={spanStyle}>
            {moment(this.state.appointmentDate).format(
              "dddd[,] MMMM Do[,] YYYY"
            )}
          </span>{" "}
          at{" "}
          <span style={spanStyle}>
            {moment(this.state.appointmentSlot)
              // .hour(9)
              // .minute(0)
              // .add(this.state.appointmentSlot, "hours")
              .format("h:mm a")}
          </span>.
        </p>
        <p>
          A reminder will be sent to <span style={spanStyle}>{this.state.phone}</span>.
        </p>
      </section>
    );
  }

  renderAppointmentTimes() {
    if (!this.state.isLoading) {
      if(this.state.availableAppointmentSlots){
        const slots = this.state.availableAppointmentSlots;
        return slots.map(slot => {
          const {start, end} = slot;
          const appointmentDateString = moment(this.state.appointmentDate).format("YYYY-DD-MM");
          const time1 = moment(start);
          const time2 = moment(end);
          const scheduleDisabled = this.state.schedule[appointmentDateString]
            ? this.state.schedule[
                moment(this.state.appointmentDate).format("YYYY-DD-MM")
              ][slot]
            : false;
          return (
            <RadioButton
              label={time1.format("hh:mm a") + " - " + time2.format("hh:mm a")}
              key={slot._id}
              value={slot}
              style={{
                marginBottom: 15,
              }}
              disabled={scheduleDisabled}
            />
          );
        });
      }
    } else {
      return null;
    }
  }

  formIsFilled(stepIndex, data) {
    if(stepIndex===0 && data.appointmentDateSelected){
      return true;
    }
    if(stepIndex===1 && data.appointmentSlot!==null){
      return true;
    }
    if(stepIndex===2 && 
      data.firstName &&
      data.lastName &&
      data.phone &&
      data.validPhone &&
      data.appointmentTitle){
      return true;
    }
    return false;
  };

  renderStepActions(step) {
    const { stepIndex, ...data } = this.state;
    const finished = stepIndex >= 2;

    return (
      <div style={{ margin: "12px 0" }}>
        <RaisedButton
          label={stepIndex === 2 ? "Schedule" : "Next"}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={ 
            finished === true 
            ? () => this.setState({
                  confirmationModalOpen: !this.state
                    .confirmationModalOpen
              }) 
            : this.handleNext
          }
          disabled={!this.formIsFilled(stepIndex, data)}
          backgroundColor="#00C853 !important"
          style={{ marginRight: 12, backgroundColor: "#00C853" }}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }



  render() {
    const {
      finished,
      isLoading,
      smallScreen,
      stepIndex,
      confirmationModalOpen,
      confirmationSnackbarOpen=false,
      ...data
    } = this.state;
    const DatePickerExampleSimple = () => (
      <div>
        <DatePicker
          hintText="Select Date"
          value= {data.appointmentDate}
          mode={smallScreen ? "portrait" : "landscape"}
          onChange={(n, date) => this.handleSetAppointmentDate(date)}
          shouldDisableDate={day => this.checkDisableDate(day)}
        />
      </div>
    );
    const modalActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={() => this.setState({ confirmationModalOpen: false })}
      />,
      <FlatButton
        label="Confirm"
        style={{ backgroundColor: "#00C853 !important" }}
        primary={true}
        onClick={() => this.handleSubmit()}
      />
    ];
    return (
      <div>
        <AppBar
          title="Bishop Appointment Scheduler"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          showMenuIconButton={false}
        />
        <section
          style={{
            maxWidth: !smallScreen ? "80%" : "100%",
            margin: "auto",
            marginTop: !smallScreen ? 20 : 0
          }}
        >
          <Card
            style={{
              padding: "12px 12px 25px 12px",
              height: smallScreen ? "100vh" : null
            }}
          >
            <Stepper
              activeStep={stepIndex}
              orientation="vertical"
              linear={false}
            >
              <Step>
                <StepLabel  disabled={stepIndex!==0}>
                  Choose an available day for your appointment
                </StepLabel>
                <StepContent>
                  {DatePickerExampleSimple()}
                  {this.renderStepActions(0)}
                </StepContent>
              </Step>
              <Step disabled={!data.appointmentDate}>
                <StepLabel  disabled={stepIndex!==1}>
                  Choose an available time for your appointment
                </StepLabel>
                <StepContent>
                  <RadioButtonGroup
                    style={{
                      marginTop: 15,
                      marginLeft: 15
                    }}
                    name="appointmentTimes"
                    defaultSelected={data.appointmentSlot}
                    onChange={(evt, val) => this.handleSetAppointmentSlot(val)}
                  >
                    {this.renderAppointmentTimes()}
                  </RadioButtonGroup>
                  {this.renderStepActions(1)}
                </StepContent>
              </Step>
              <Step>
                <StepLabel  disabled={stepIndex!==2}>
                  Share your contact information with us and we'll send you a
                  reminder
                </StepLabel>
                <StepContent>
                  <div>
                    <section>
                      <TextField
                        style={{ display: "block" }}
                        name="first_name"
                        hintText="First Name"
                        value={this.state.firstName}
                        floatingLabelText="First Name"
                        onChange={(evt, newValue) =>
                          this.setState({ firstName: newValue })
                        }
                      />
                      <TextField
                        style={{ display: "block" }}
                        name="last_name"
                        hintText="Last Name"
                        floatingLabelText="Last Name"
                        value={this.state.lastName}
                        onChange={(evt, newValue) =>
                          this.setState({ lastName: newValue })
                        }
                      />
                      <TextField
                        style={{ display: "block" }}
                        name="appointment_title"
                        hintText='"Temple Recommend Interview"'
                        floatingLabelText="Type of Appointment"
                        value={this.state.appointmentTitle}
                        onChange={(evt, newValue) =>
                          this.setState({ appointmentTitle: newValue })
                        }
                      />
                      <TextField
                        style={{ display: "block" }}
                        name="phone"
                        hintText="1234567890"
                        floatingLabelText="Phone"
                        value={this.state.phone}
                        errorText={
                          data.validPhone ? null : "Enter a valid phone number"
                        }
                        onChange={(evt, newValue) =>
                          this.validatePhone(newValue)
                        }
                      />
                    </section>
                  </div>
                  {this.renderStepActions(2)}
                </StepContent>
              </Step>
            </Stepper>
          </Card>
          <Dialog
            modal={true}
            open={confirmationModalOpen}
            actions={modalActions}
            title="Confirm your appointment"
          >
            {this.renderAppointmentConfirmation()}
          </Dialog>
          <Dialog
            modal={true}
            open={confirmationSnackbarOpen}
            actions={
            <FlatButton
              label="OK"
              primary={true}
              onClick={() => {
                this.setState({
                  appointmentDate: "", 
                  appointmentDateSelected: false,
                  appointmentSlot: null,
                  appointmentTitle: "",
                  availableAppointmentSlots: [],
                  confirmationModalOpen: false,
                  confirmationSnackbarMessage: "",
                  confirmationSnackbarOpen: false,
                  confirmationTextVisible: false,
                  finished: false,
                  firstName: "",
                  lastName: "",
                  openSlots: [],
                  phone: "",
                  processed: false,
                  schedule: [],
                  smallScreen: false,
                  stepIndex: 0,
                  validPhone: true,
                });
                this.componentWillMount();
              }
            }
            />
            }
            title="Appointment Scheduled!"
          >
            {this.renderSuccessDialog()}
          </Dialog>
          {/* <SnackBar
            open={confirmationSnackbarOpen || isLoading}
            message={
              isLoading ? "Loading... " : data.confirmationSnackbarMessage || ""
            }
            autoHideDuration={10000}
            onRequestClose={() =>
              this.setState({ confirmationSnackbarOpen: false })
            }
          /> */}
        </section>
      </div>
    );
  }
}
export default AppointmentApp;
