import * as React from "react";
import renderer from "react-test-renderer";
import TabTwoScreen from "../TabTwoScreen";
import { render } from "@testing-library/react-native";

test("all text rendering correctly", () => {
  const { findByText } = render(<TabTwoScreen />);

  findByText(/Tab Two/gi);
});
