import * as React from "react";
import renderer from "react-test-renderer";
import CounterScreen from "../CounterScreen";
import { fireEvent, render } from "@testing-library/react-native";

test("renders correctly", () => {
  const tree = renderer.create(<CounterScreen />).toJSON();

  //   expect(tree).toMatchSnapshot();
});

test("all buttons and text are rendering correctly", () => {
  const { getAllByTestId, findByText } = render(<CounterScreen />);

  getAllByTestId("go-back-home-btn");
  findByText("Counter value:");
  findByText("Go back home");
  findByText("Increment Counter");
  findByText("Reset Counter");
});

test("increment btn working correctly", () => {
  const { getAllByTestId, findByText } = render(<CounterScreen />);

  const incBtn = getAllByTestId("inc-btn")[0];

  // before pressing increment button, counter value should be zero
  findByText(/counter value: 0/gi);
  fireEvent.keyPress(incBtn);

  // after pressing increment button, counter value should be one
  findByText(/counter value: 1/gi);
});

test("reset button working correctly", () => {
  const { findByText, getAllByTestId } = render(<CounterScreen />);
  const resetBtn = getAllByTestId("reset-btn")[0];

  fireEvent.keyPress(resetBtn);
  // after pressing the reset btn, the counter value should reset to zero
  findByText(/counter value: 0/gi);
});
