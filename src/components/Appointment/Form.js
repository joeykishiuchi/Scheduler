import React, { useState } from "react"

import InterviewerList from "../InterviewerList"
import Button from "../Button"

export default function Form(props) {

  const [ name, setName ] = useState(props.student || "")
  const [ interviewer, setInterviewer ] = useState(props.interviewer || null)
  const [ err, setErr ] = useState("");

  function reset() {
    setInterviewer("")
    setName("")
    setErr("")
  }

  function cancel() {
    setErr("")
    reset()
    props.onCancel()
  }

  function validate() {
    if (name === "") {
      setErr("Student name cannot be blank")
      return
    }
    setErr("");
    props.onSave(name, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off"
          onSubmit={ event => event.preventDefault() }
        >
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
        <section className="appointment__validation">{ err }</section>
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
}