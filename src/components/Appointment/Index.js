import React, { useEffect } from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import "./styles.scss";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  
// Various mode options for a given hour
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const {mode, transition, back} = useVisualMode(
  props.interview ? SHOW : EMPTY 
);
// Initializes appointment mode on page refresh
useEffect(() => {
  if (props.interview === null && mode === "SHOW") {
    transition(EMPTY);
  }
  if (props.interview && mode === "EMPTY") {
    transition(SHOW);
  }
}, [ props.interview, mode, transition ]);

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  transition(SAVE, true)
  props.bookInterview(props.id, interview)
    .then(() => transition(SHOW)) 
    .catch(() => transition(ERROR_SAVE, true)); // Displays appropriate error message if saving fails in the server API
};

function deleteInt() {
  transition(DELETE, true);
  props.deleteInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true)); // Displays appropriate error message if delete fails in the server API
};

  return (
     <article 
      className="appointment"
      data-testid="appointment"
     >
       <Header time={ props.time } />
       {mode === EMPTY && <Empty onAdd={ () => transition(CREATE) } />}
       {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={ () => transition(CONFIRM) }
            onEdit={ () => transition(EDIT) }
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewers={ props.interviewers }
            onCancel ={ () => back()}
            onSave={ save }
          />
        )}
        {mode === EDIT && (
        <Form
          student={ props.interview.student }
          interviewer={ props.interview.interviewer.id }
          interviewers={ props.interviewers }
          onCancel ={ () => back() }
          onSave={ save }
        />)}
        {mode === SAVE && <Status message="Saving" />}
        {mode === DELETE && <Status message="Deleting" />}
        {mode === CONFIRM && 
        (<Confirm 
          message="Are you sure you want to cancel this interview?"
          onCancel={ () => back() }
          onConfirm={ deleteInt }
        />)}
        {mode === ERROR_SAVE && <Error message="Could not save appointment." onClose={() => back()} />}
        {mode === ERROR_DELETE && <Error message="Could not delete appointment." onClose={() => back()}/>}
     </article>
  );  
};