import { useState } from "react";

export default function useVisualMode(initial) {
  const [ mode, setMode ] = useState(initial);
  const [history] = useState([initial])
  // Controls switching through display modes on user events 
  function transition(newMode, replace) {
    if (replace) { // If set, skip the mode when using back()
      setMode(newMode)
    } else {
      history.push(newMode)
    setMode(newMode);
    }
  }
  // Returns user to previously set mode from cancel events
  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length - 1])
    }
  }
  return { mode, transition, back };
};