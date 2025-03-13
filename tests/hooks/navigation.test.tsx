import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Segment Navigation and Focus", () => {
  it("advances active segment with Tab and goes back with Shift+Tab", async () => {
    const date = new Date(2021, 0, 15);
    const screen = render(<TestComponent value={date} format="MM/DD/YYYY" />);
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    const setSelectionRangeSpy = vi.spyOn(input, "setSelectionRange");

    input.focus();
    await userEvent.tab();
    expect(setSelectionRangeSpy).toHaveBeenCalledTimes(1);

    await userEvent.tab({ shift: true });
    expect(setSelectionRangeSpy).toHaveBeenCalledTimes(2);
  });

  it("selects the first segment when the input is focused via tab", async () => {
    const date = new Date(2021, 0, 15);
    const screen = render(
      <div>
        <button>Dummy</button>
        <TestComponent value={date} format="MM/DD/YYYY" />
      </div>,
    );

    const button = screen.getByRole("button").element() as HTMLButtonElement;
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    const setSelectionRangeSpy = vi.spyOn(input, "setSelectionRange");

    button.focus();
    await userEvent.tab();

    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 2);
  });

  it("selects the first segment when the input is focused via shift tab", async () => {
    const date = new Date(2021, 0, 15);
    const screen = render(
      <div>
        <TestComponent value={date} format="MM/DD/YYYY" />
        <button>Dummy</button>
      </div>,
    );

    const button = screen.getByRole("button").element() as HTMLButtonElement;
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    const setSelectionRangeSpy = vi.spyOn(input, "setSelectionRange");

    button.focus();
    await userEvent.tab({ shift: true });

    expect(setSelectionRangeSpy).toHaveBeenCalledWith(0, 2);
  });

  it("updates active segment on mouse up events", async () => {
    const date = new Date(2021, 0, 15);
    const screen = render(<TestComponent value={date} format="MM/DD/YYYY" />);
    const input = screen.getByRole("textbox");

    const setSelectionRangeSpy = vi.spyOn(
      input.element() as HTMLInputElement,
      "setSelectionRange",
    );

    await input.click();

    expect(setSelectionRangeSpy).toHaveBeenCalled();
  });
});
