import * as React from "react";
import renderer from "react-test-renderer";
import TabOneScreen from "../TabOneScreen";
import { render } from "@testing-library/react-native";

test("all text rendering correctly", () => {
  const { findByText } = render(<TabOneScreen />);

  findByText(/Tab One/gi);
});