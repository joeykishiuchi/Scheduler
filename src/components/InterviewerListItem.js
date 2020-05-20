import React from "react";
import classnames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  // toggles interviewers tab expansion on select
  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected,
    "interviewers__item-image": props.selected
  });
  //Renders single interviewer
  return (
    <li 
      className={ interviewerClass }
      onClick={ props.setInterviewer }
    >
      <img
        className="interviewers__item-image"
        src={ props.avatar }
        alt={ props.name }
      />
      { props.selected && props.name } {/* interviewer icon is expanded and name is displayed on select */} 
    </li>
  );
};