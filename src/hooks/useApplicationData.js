import { useReducer, useEffect } from "react";
import axios from "axios"

const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW"; 

  const reducer = function(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
         }
      case SET_APPLICATION_DATA:
        return { 
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
         }
      case SET_INTERVIEW: {
        return  {
          ...state,
          days: action.days,
          appointments: action.appointments
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({type: SET_DAY, day});

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      dispatch({type:SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data});
    })
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${appointment.id}`, appointment )
      .then(() => {
        return axios.get("/api/days")
        .then(days => dispatch({ type:SET_INTERVIEW, appointments, days: days.data}))
      })
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${appointment.id}`,  { interview: null } )
      .then(() => {
        axios.get("/api/days")
        .then(days => dispatch({type:SET_INTERVIEW, appointments, days: days.data}));
      })
  }



  return {state, setDay, bookInterview, deleteInterview}
}