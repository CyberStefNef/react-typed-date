import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { useTypedDate } from "../../src/";
import { TypedDateProps } from "../../src/types";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Initial Render", () => {
  it("renders correctly when a valid date is provided", () => {
    const date = new Date(2021, 0, 15);
    const screen = render(<TestComponent value={date} format="MM/DD/YYYY" />);
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.value).toBe("01/15/2021");
  });

  it("renders placeholder format when no date is provided", () => {
    const screen = render(
      <TestComponent value={undefined} format="MM/DD/YYYY" />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.value).toBe("__/__/____");
  });
});
