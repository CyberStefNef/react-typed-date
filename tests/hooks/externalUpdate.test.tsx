import { useState } from "react";
import { describe, it, expect } from "vitest";
import { useTypedDate } from "../../src";
import { TypedDateProps } from "../../src/types";
import { render } from "vitest-browser-react";

function ParentComponent({
  initialValue,
  format,
  onChange,
}: {
  initialValue: Date;
  onChange: (date?: Date) => void;
  format: string;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <button onClick={() => setValue(new Date(2022, 5, 20))}>Update</button>
      <Child value={value} format={format} onChange={onChange} />
    </>
  );
}

function Child({ value, format, onChange }: TypedDateProps) {
  const { inputProps } = useTypedDate({ value, format, onChange });
  return <input {...inputProps} />;
}

describe("useTypedDate - External Update", () => {
  it("updates internal state when the external date changes", async () => {
    const screen = render(
      <ParentComponent
        initialValue={new Date(2021, 0, 15)}
        format="MM/DD/YYYY"
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole("textbox").element() as HTMLInputElement;
    expect(input.value).toBe("01/15/2021");

    const button = screen.getByRole("button");
    await button.click();

    expect(input.value).toBe("06/20/2022");
  });
});
