import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - onChange Callback", () => {
  it("calls onChange when a complete and valid date is entered", async () => {
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
    await userEvent.keyboard("12282021");

    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];

    expect(newDate.getMonth()).toBe(11);
    expect(newDate.getDate()).toBe(28);
    expect(newDate.getFullYear()).toBe(2021);
  });

  it("does not call onChange if the date is incomplete", async () => {
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

    expect(onChange).not.toHaveBeenCalled();
  });
});
