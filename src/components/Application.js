import React from "react";
import useApplicationData from "../hooks/useApplicationData";

import "components/Application.scss";

import DayList from "./DayList.js";
import Appointment from "components/Appointment/Index";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";

export default function Application() {

  const {
    state,
    setDay,
    bookInterview,
    deleteInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);
  // Formats each appointment in a given day of the week
  const appointments = getAppointmentsForDay(state, state.day).map(appointment => {
      return (
          <Appointment 
            key={ appointment.id }
            id={ appointment.id }
            time={appointment.time }
            interview={ getInterview(state, appointment.interview)}
            interviewers={ interviewers }
            bookInterview={ bookInterview }
            deleteInterview={ deleteInterview }
             />
      );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Site Logo */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={ state.days }
            day={ state.day }
            setDay= { setDay }
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { appointments }
        <Appointment key="last" time="5pm" /> {/* Last hour of each day is unavailable and doesn't contain a form */}
      </section>
    </main>
  );
};
