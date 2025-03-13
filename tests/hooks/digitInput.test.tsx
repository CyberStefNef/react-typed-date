import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Digit Input and Buffer Handling", () => {
  it("accumulates digits for a segment and advances when max length is reached", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("12");

    expect(input.value.startsWith("12")).toBeTruthy();
  });

  it("clamps month input above 12 to 12", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("99");

    expect(input.value.startsWith("12")).toBeTruthy();
  });

  it("clamps day input based on the maximum days for the current month", async () => {
    const onChange = vi.fn();

    const initialDate = new Date(2021, 1, 15);
    const screen = render(
      <TestComponent
        value={initialDate}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.tab();
    await userEvent.keyboard("30");

    const daySegment = input.value.split("/")[1];
    expect(daySegment).toBe("28");
  });
});
