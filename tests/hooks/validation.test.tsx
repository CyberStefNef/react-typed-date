import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { useTypedDate } from "../../src";
import {
  TypedDateProps,
  TypedDateValidation,
  ValidationCode,
} from "../../src/types";

function TestComponent(props: TypedDateProps) {
  const { inputProps } = useTypedDate(props);
  return <input {...inputProps} />;
}

const collectCodes = (mock: ReturnType<typeof vi.fn>): ValidationCode[] => {
  return mock.mock.calls.map(
    (call) => (call[0] as TypedDateValidation).code as ValidationCode,
  );
};

describe("useTypedDate - Validation", () => {
  it("marks empty optional input as valid", () => {
    const onValidationChange = vi.fn();
    const screen = render(
      <TestComponent format="MM/DD/YYYY" onValidationChange={onValidationChange} />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "none", isValid: true }),
    );
  });

  it("marks empty required input as incomplete", () => {
    const onValidationChange = vi.fn();
    const screen = render(
      <TestComponent
        format="MM/DD/YYYY"
        required
        onValidationChange={onValidationChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "incomplete", isValid: false }),
    );
  });

  it("marks a complete initial value as valid", () => {
    const onValidationChange = vi.fn();
    const date = new Date(2023, 11, 25, 14, 30, 45);
    const screen = render(
      <TestComponent
        value={date}
        format="MM/DD/YYYY HH:mm:ss"
        required
        onValidationChange={onValidationChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "none", isValid: true }),
    );
  });

  it("validates minimum date range", () => {
    const onValidationChange = vi.fn();
    const minDate = new Date(2023, 11, 26);
    const value = new Date(2023, 11, 25);
    const screen = render(
      <TestComponent
        value={value}
        format="MM/DD/YYYY"
        minDate={minDate}
        onValidationChange={onValidationChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "out_of_range_min", isValid: false }),
    );
  });

  it("validates maximum date range", () => {
    const onValidationChange = vi.fn();
    const maxDate = new Date(2023, 11, 24);
    const value = new Date(2023, 11, 25);
    const screen = render(
      <TestComponent
        value={value}
        format="MM/DD/YYYY"
        maxDate={maxDate}
        onValidationChange={onValidationChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "out_of_range_max", isValid: false }),
    );
  });

  it("marks invalid year input as invalid_date after blur", async () => {
    const onValidationChange = vi.fn();
    const screen = render(
      <TestComponent
        format="MM/DD/YYYY"
        required
        onValidationChange={onValidationChange}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("12259");
    await userEvent.tab();

    expect(input.value).toBe("12/25/0009");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "invalid_date", isValid: false }),
    );
  });

  it("only emits validation callback when code changes", async () => {
    const onValidationChange = vi.fn();
    const screen = render(
      <TestComponent format="MM/DD/YYYY" onValidationChange={onValidationChange} />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("12252023");

    const codes = collectCodes(onValidationChange);
    const dedupedCodes = codes.filter(
      (code, index) => index === 0 || code !== codes[index - 1],
    );

    expect(dedupedCodes).toEqual(["none", "incomplete", "none"]);
  });
});
