import moment from "moment";

export const dialogs = {
  ADD_APPT: 'ADD_APPT',
  ADD_SLOT: 'ADD_SLOT',
  SLOT_DETAIL: 'SLOT_DETAIL',
}

export const leader = {
  BISHOP: "Bishop",
  FIRST_C: "1st Counselor",
  SECOND_C: "2nd Counselor",
};

export const mockAppts = [
  {
    start: moment("3:30 PM", "H:mm a")._d,
    end: moment("4:00 PM", "H:mm a")._d,
    title: "\nMOCK: Jaxon Keeler", // If we build custom calendar event component, this could be something like "Temple Recommend Renewal"
    member: "Jaxon Keeler",
    leader: leader.FIRST_C,
    phone: '8323144134'
  },
  {
    start: moment("4:00 PM", "H:mm a")._d,
    end: moment("4:30 PM", "H:mm a")._d,
    title: "MOCK: Ileana Heaton",
    member: "Ileana Heaton",
    leader: leader.BISHOP,
    phone: '4047978483'
  },
  {
    start: moment("4:30 PM", "H:mm a")._d,
    end: moment("5:00 PM", "H:mm a")._d,
    title: "MOCK: Joe Schmoe",
    member: "Joe Schmoe",
    leader: leader.FIRST_C,
    phone: '8323144134'
  },
  {
    start: moment("5:00 PM", "H:mm a")._d,
    end: moment("5:30 PM", "H:mm a")._d,
    title: "MOCK: Dan Smith",
    member: "Dan Smith",
    leader: leader.SECOND_C,
    phone: '8323144134'
  },
]