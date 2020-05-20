import { useReducer, useEffect } from "react";
import axios from "axios";
const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW"; 

const reducer = function(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day
        };
    case SET_APPLICATION_DATA:
      return { 
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
        };
    case SET_INTERVIEW: {
      return  {
        ...state,
        days: action.days,
        appointments: action.appointments
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  };
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  // Keeps track of users current day selected
  const setDay = day => dispatch({type: SET_DAY, day});
  // Initial retrieval per render
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      dispatch({
        type:SET_APPLICATION_DATA, 
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data
      });
    })
  }, []);
  // returns appointments obj when interview is booked or cancelled
  const getUpdatedAppointments = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: interview 
    }
    return {
      ...state.appointments,
      [id]: appointment
    };
  }

  // returns days array with updated spots remaining count when interview is booked or cancelled
  const getUpdatedDays = (id, interview) => {
    const appointments = getUpdatedAppointments(id, interview)
    const { name } = state.days.find(day => day.appointments.includes(id))
    const days = state.days;
    const dayIndex = days.map(day => day.name).indexOf(name);
    let interviewCount = 0;
    for(const appointment of days[dayIndex].appointments) {
      if (appointments[appointment].interview) {
        interviewCount++;
      }
    }
    days[dayIndex].spots = days.length - interviewCount;
    return days;

  }
  // Initializes WebSocket
  useEffect(() => {
    webSocket.onopen = () => {
      console.log("Connected to socket server")
    };
    // Listens for appointment updates broadcasted for other users
    webSocket.onmessage = event => {
      const { type, id, interview } = JSON.parse(event.data)
      const appointments = getUpdatedAppointments(id, interview);
      const days = getUpdatedDays(id, interview) 

      dispatch({ type, days, appointments })
    };
  });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: interview 
    }
    const appointments = getUpdatedAppointments(id, interview);
    const days = getUpdatedDays(id, interview) 

    // Delete request broadcasts interview details to websocket. Included state change for testing
    return axios.put(`/api/appointments/${appointment.id}`, appointment)
      .then(() => dispatch({type:SET_INTERVIEW, days, appointments}))
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = getUpdatedAppointments(id, null);
    const days = getUpdatedDays(id, null) 

    // Delete request broadcasts interview details to websocket. Included state change for testing
    return axios.delete(`/api/appointments/${appointment.id}`, appointment )
      .then(() => dispatch({type:SET_INTERVIEW, days, appointments}))
  }
  
  return {state, setDay, bookInterview, deleteInterview}
}