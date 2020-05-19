import React from 'react';
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from "prop-types"; 

import './InterviewerList.scss';

export default function InterviewerList(props) {
  // Type checking for props
  InterviewerList.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }
  // Items retrieved from database
  const interviewers = props.interviewers.map(interviewer => {
    return (
      <InterviewerListItem
        key={ interviewer.id }
        name={ interviewer.name }
        avatar={ interviewer.avatar }
        selected={ interviewer.id === props.value ? true : null } 
        setInterviewer={ () => props.onChange(interviewer.id) }
      />)
  })
  // Renders a list of interviewers in the appointments 
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        { interviewers }
      </ul>
    </section>
  )
}