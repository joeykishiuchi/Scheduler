import React from "react"
import classnames from "classnames"

import "components/DayListItem.scss"

export default function DayListItem(props) {

  const dayClass = classnames("day-list__item",{
    "day-list__item--selected": props.selected, // toggles when user selects a day
    "day-list__item--full": props.spots === 0 // toggles day tab opacity when no spots are available
  })
  // Caters spots remaining message to particular number of spots
  function formattedSpots(spots) {
    if (spots === 0) {
      return "no spots remaining"
    } else if (spots === 1) {
      return "1 spot remaining"
    } else {
      return `${spots} spots remaining`
    }
  }
  // Creates a formatted tab for a day
  return (
    <li 
      className= { dayClass } 
      onClick= { () => props.setDay(props.name) }
    >
      <h2 className="text--regular">{ props.name }</h2> 
      <h3 className="text--light"> { formattedSpots(props.spots) } </h3>
    </li>
  );
}