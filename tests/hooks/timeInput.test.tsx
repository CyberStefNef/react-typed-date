import { describe, it, expect, vi } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";

function TestComponent({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - 24-hour Time Support", () => {
  it("should render with time format MM/DD/YYYY HH:mm", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("__/__/____ __:__");
  });

  it("should handle complete datetime input", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    
    input.focus();
    await userEvent.keyboard("1225202314");
    await userEvent.keyboard("30");
    
    expect(input.value).toBe("12/25/2023 14:30");
    expect(onChange).toHaveBeenCalled();
    
    const callArgs = onChange.mock.calls[onChange.mock.calls.length - 1];
    const date = callArgs[0] as Date;
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(30);
  });

  it("should validate hour limits (0-23)", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    
    input.focus();
    await userEvent.keyboard("12252023");
    await userEvent.keyboard("25");
    
    expect(input.value).toBe("12/25/2023 23:__");
  });

  it("should validate minute limits (0-59)", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    
    input.focus();
    await userEvent.keyboard("1225202314");
    await userEvent.keyboard("65");
    
    expect(input.value).toBe("12/25/2023 14:59");
  });

  it("should render full hour segment when entering 00", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("1225202300");

    expect(input.value).toBe("12/25/2023 00:__");
  });

  it("should handle arrow keys for time segments", async () => {
    const onChange = vi.fn();
    const initialDate = new Date(2023, 11, 25, 14, 30);
    const screen = render(
      <TestComponent
        value={initialDate}
        format="MM/DD/YYYY HH:mm"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    
    input.focus();
    // Navigate to hour segment using arrow right keys
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    
    // Increase hour with arrow up
    await userEvent.keyboard("{ArrowUp}");
    expect(input.value).toBe("12/25/2023 15:30");
    
    // Navigate to minute segment
    await userEvent.keyboard("{ArrowRight}");
    
    // Decrease minute with arrow down
    await userEvent.keyboard("{ArrowDown}");
    expect(input.value).toBe("12/25/2023 15:29");
  });

  it("should handle seconds format HH:mm:ss", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm:ss"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("__/__/____ __:__:__");
    
    // Enter complete date, hour, minute and second
    input.focus();
    await userEvent.keyboard("12252023143045");
    
    expect(input.value).toBe("12/25/2023 14:30:45");
    expect(onChange).toHaveBeenCalled();
    
    const callArgs = onChange.mock.calls[onChange.mock.calls.length - 1];
    const date = callArgs[0] as Date;
    expect(date.getSeconds()).toBe(45);
  });

  it("should validate seconds limits (0-59)", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm:ss"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    
    input.focus();
    await userEvent.keyboard("122520231430");
    
    // Try to enter 65 (invalid second)
    await userEvent.keyboard("65");
    
    // Should be clamped to 59
    expect(input.value).toBe("12/25/2023 14:30:59");
  });

  it("should render full second segment when entering 00", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY HH:mm:ss"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("12252023143000");

    expect(input.value).toBe("12/25/2023 14:30:00");
  });

  it("should handle arrow keys for seconds", async () => {
    const onChange = vi.fn();
    const initialDate = new Date(2023, 11, 25, 14, 30, 45);
    const screen = render(
      <TestComponent
        value={initialDate}
        format="MM/DD/YYYY HH:mm:ss"
        onChange={onChange}
      />
    );
    
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("12/25/2023 14:30:45");
    
    input.focus();
    // Navigate to seconds segment
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}");
    
    // Increase seconds with arrow up
    await userEvent.keyboard("{ArrowUp}");
    expect(input.value).toBe("12/25/2023 14:30:46");
    
    // Decrease seconds with arrow down
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(input.value).toBe("12/25/2023 14:30:44");
  });
});

describe("useTypedDate - 12-hour Time Support", () => {
  it("should render with format MM/DD/YYYY hh:mm A", () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY hh:mm A"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("__/__/____ __:__ __");
  });

  it("should render midnight as 12 in 12-hour mode", () => {
    const onChange = vi.fn();
    const midnight = new Date(2023, 11, 25, 0, 5);
    const screen = render(
      <TestComponent
        value={midnight}
        format="MM/DD/YYYY hh:mm A"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("12/25/2023 12:05 AM");
  });

  it("should accept meridiem letter input and convert hour", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY hh:mm A"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("122520231130");

    expect(input.value).toBe("12/25/2023 11:30 AM");

    await userEvent.keyboard("p");
    expect(input.value).toBe("12/25/2023 11:30 PM");

    const callArgs = onChange.mock.calls[onChange.mock.calls.length - 1];
    const date = callArgs[0] as Date;
    expect(date.getHours()).toBe(23);
  });

  it("should toggle meridiem with arrow keys", async () => {
    const onChange = vi.fn();
    const initialDate = new Date(2023, 11, 25, 10, 30);
    const screen = render(
      <TestComponent
        value={initialDate}
        format="MM/DD/YYYY hh:mm A"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("12/25/2023 10:30 AM");

    input.focus();
    await userEvent.keyboard(
      "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}",
    );
    await userEvent.keyboard("{ArrowUp}");
    expect(input.value).toBe("12/25/2023 10:30 PM");

    await userEvent.keyboard("{ArrowDown}");
    expect(input.value).toBe("12/25/2023 10:30 AM");
  });

  it("should support lowercase meridiem token", async () => {
    const onChange = vi.fn();
    const screen = render(
      <TestComponent
        value={undefined}
        format="MM/DD/YYYY hh:mm a"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox").element() as HTMLInputElement;

    input.focus();
    await userEvent.keyboard("122520231230");
    expect(input.value).toBe("12/25/2023 12:30 am");

    await userEvent.keyboard("p");
    expect(input.value).toBe("12/25/2023 12:30 pm");
  });
});
