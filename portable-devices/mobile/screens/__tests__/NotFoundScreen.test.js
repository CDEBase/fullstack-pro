import * as React from "react";
import renderer from "react-test-renderer";
import NotFoundScreen from "../NotFoundScreen";
import { render } from "@testing-library/react-native";

test("all text rendering correctly", () => {
  const { findByText } = render(<NotFoundScreen />);

  findByText(/This screen doesn't exist./gi);
  findByText(/Go to home screen!/gi);
});
