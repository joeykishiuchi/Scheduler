import React from "react";
import DayListItem from "./DayListItem";
// Creates navbar for days of the week
export default function DayList(props) {

  const day =  props.days.map(day => {
    return <DayListItem 
        key= { day.id }
        name= { day.name }
        spots= { day.spots }
        selected= { props.day === day.name }
        setDay= { props.setDay } 
      />
  });
  // Render array of days in the navbar
  return (
    <ul>
      { day } 
    </ul>
  );
};