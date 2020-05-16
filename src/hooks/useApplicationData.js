import { useState, useEffect } from "react";
import axios from "axios"

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
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
        .then(days => setState({...state, appointments, days: days.data}));
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
      .then(() => setState({...state, appointments}))
      .then(() => {
        axios.get("/api/days")
        .then(days => setState({...state, days: days.data}));
      })
  }



  return {state, setDay, bookInterview, deleteInterview}
}