import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Non-Digit Input Handling", () => {
  it("ignores non-digit characters", async () => {
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
    await userEvent.keyboard("a");

    expect(input.value).toEqual("__/__/____");
    expect(onChange).not.toHaveBeenCalled();
  });
});
