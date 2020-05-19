import { useReducer, useEffect } from "react";
import axios from "axios"
const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

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

  useEffect(() => {
    webSocket.onopen = () => {
      console.log("Connected to socket server")
    };
    webSocket.onmessage = event => {
      const { type, id, interview } = JSON.parse(event.data)
      // Set appointment value according to event
      const appointment = {
        ...state.appointments[id],
        interview: interview 
      }
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      // Calculate the number of spots remaining
      const days = state.days;
      const dayIndex = days.map(day => day.name).indexOf(state.day);
      let interviewCount = 0;
      for(const appointment of days[dayIndex].appointments) {
        if (appointments[appointment].interview) {
          interviewCount++;
        }
      }
      days[dayIndex].spots = 5 - interviewCount;

      dispatch({ type, days, appointments })
    };
  });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/api/appointments/${appointment.id}`, appointment )
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    return axios.delete(`/api/appointments/${appointment.id}`, appointment )
  }


  return {state, setDay, bookInterview, deleteInterview}
}