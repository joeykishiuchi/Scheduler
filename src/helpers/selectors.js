export function getAppointmentsForDay(state, day) {
  const appointmentsForDay = [];
  let dayAppointments;
  if (state.days && state.appointments) {
    dayAppointments = state.days.filter(curr => curr.name === day);
    for (const appointment in state.appointments) {
      if (dayAppointments[0] && dayAppointments[0].appointments.includes(Number(appointment))) {
        appointmentsForDay.push(state.appointments[appointment]);
      }
    }
  }
  return appointmentsForDay;
}

export function getInterviewersForDay(state, day) {
  const interviewersForDay = [];
  let dayInterviewers;
  if (state.days && state.interviewers) {
    dayInterviewers = state.days.filter(curr => curr.name === day);
    for (const interviewer in state.interviewers) {
      if (dayInterviewers[0] && dayInterviewers[0].interviewers.includes(Number(interviewer))) {
        interviewersForDay.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewersForDay;
}



export function getInterview(state, interview) {
  if (interview) {
    return {student: interview.student, interviewer: state.interviewers[interview.interviewer]}
  } else {
    return interview;
  }
}