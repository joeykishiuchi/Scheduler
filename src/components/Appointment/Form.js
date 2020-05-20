import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {
  // State of users name input
  const [ name, setName ] = useState(props.student || "");
  // State of users interviewer choice
  const [ interviewer, setInterviewer ] = useState(props.interviewer || null);
  // state of input error message
  const [ err, setErr ] = useState("");

  function reset() {
    setInterviewer("")
    setName("")
    setErr("")
  };
  // Removes all existing states if user cancels form
  function cancel() {
    setErr("")
    reset()
    props.onCancel()
  };
  // Validate users form to negate submission with missing fields
  function validate() {
    if (name === "") {
      setErr("Please enter your name.");
      return;
    } else if (interviewer === null) {
      setErr("Please choose an interviewer.");
      return;
    }
    setErr("");
    props.onSave(name, interviewer);
  };
  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off"
          onSubmit={ event => event.preventDefault() }
        >
          {/* Value and onChange are type restricted to number and func */}
          <input
            data-testid="student-name-input"
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value= { name }
            onChange={ event => setName(event.target.value) }
          />
        </form>
        <section className="appointment__validation">{ err }</section> {/* Toggles error message */}
        {/* Displays list of available interviewers for user to choose */}
        <InterviewerList interviewers={ props.interviewers } value={ interviewer } onChange={ setInterviewer } />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button 
            danger
            onClick={ () => cancel() }
          >Cancel</Button>
          <Button 
            confirm
            onClick={ () => validate() }
          >Save</Button>
        </section>
      </section>
    </main>
  );
};