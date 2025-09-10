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