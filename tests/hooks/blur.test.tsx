import { describe, it, expect, vi } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { render } from "vitest-browser-react";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - Blur Handling", () => {
  it("commits the current buffer when day loses focus", async () => {
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
    await vi.waitFor(() => {
      expect(input.value).toEqual("__/__/____");
    });
    input.blur();

    input.focus();
    await userEvent.keyboard("1");
    input.blur();

    await vi.waitFor(() => {
      expect(input.value).toEqual("01/__/____");
    });
  });

  it("commits the current buffer when month loses focus", async () => {
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
    await userEvent.tab();
    input.blur();
    await vi.waitFor(() => {
      expect(input.value).toEqual("__/__/____");
    });

    input.focus();
    await userEvent.tab();
    await userEvent.keyboard("1");
    input.blur();
    await vi.waitFor(() => {
      expect(input.value).toEqual("__/01/____");
    });
  });

  it("commits the current buffer when year loses focus", async () => {
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
    await userEvent.tab();
    await userEvent.tab();
    input.blur();
    await vi.waitFor(() => {
      expect(input.value).toEqual("__/__/____");
    });

    input.focus();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.keyboard("1");
    input.blur();

    await vi.waitFor(() => {
      expect(input.value).toEqual("__/__/0001");
    });
  });
});
