import React from "react";
import { render, cleanup } from "@testing-library/react"

import Appointment from "components/Appointment/Index";

afterEach(cleanup);

describe("Appointment", () => {
  it("renders with out crashing", () => {
    render(<Appointment />)
  })
});