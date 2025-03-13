import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Arrow Keys Increment/Decrement", () => {
  it("increments/decrements the day using ArrowUp/ArrowDown", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowUp}");

    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];
    expect(newDate.getDate()).toBe(16);

    onChange.mockReset();
    await userEvent.keyboard("{ArrowDown}");
    const newDate2 = onChange.mock.calls[0][0];
    expect(newDate2.getDate()).toBe(15);
  });

  it("increments/decrements the month using ArrowUp/ArrowDown", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];

    expect(newDate.getMonth()).toBe(1);

    onChange.mockReset();
    await userEvent.keyboard("{ArrowDown}");
    const newDate2 = onChange.mock.calls[0][0];
    expect(newDate2.getMonth()).toBe(0);
  });

  it("increments/decrements the year using ArrowUp/ArrowDown", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowUp}");

    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];
    expect(newDate.getFullYear()).toBe(2022);

    onChange.mockReset();
    await userEvent.keyboard("{ArrowDown}");
    const newDate2 = onChange.mock.calls[0][0];
    expect(newDate2.getFullYear()).toBe(2021);
  });
});

describe("useTypedDate - Arrow Keys Max/Min Boundaries", () => {
  it("does not increment month beyond December", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 11, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not decrement month below January", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not increment day beyond the maximum for the month", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 31)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not decrement day below 1", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2021, 0, 1)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    input.focus();

    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowDown}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not increment year beyond 9999", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(9999, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not decrement year below 1000", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(1000, 0, 15)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await userEvent.keyboard("{ArrowDown}");

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("useTypedDate - February and Leap Year Edge Cases", () => {
  it("automatically adjusts Feb 29 to Feb 28 when decrementing year from leap to non-leap", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2020, 1, 29)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await userEvent.keyboard("{ArrowDown}");

    expect(onChange).toHaveBeenCalled();
    const newDate = onChange.mock.calls[0][0];

    expect(newDate.getFullYear()).toBe(2019);
    expect(newDate.getMonth()).toBe(1);
    expect(newDate.getDate()).toBe(28);
  });

  it("does not increment day beyond 29 in February for a leap year", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2020, 1, 29)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not increment day beyond 28 in February for a non-leap year", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={new Date(2019, 1, 28)}
        format="MM/DD/YYYY"
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowUp}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
