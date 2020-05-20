import React from "react";

export default function Empty(props) {
  // Display mode for a slot with no booked appointment
  return (
    <main className="appointment__add">
    <img
      className="appointment__add-button"
      src="images/add.png"
      alt="Add"
      onClick={ props.onAdd }
    />
  </main>
  )
};