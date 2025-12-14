import { useState } from "react";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

type InputGroupDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  calendarProps?: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">;
};

const InputGroupDatePicker = <T extends FieldValues>({
  control,
  name,
  label = "Date",
  description = "",
  calendarProps,
}: InputGroupDatePickerProps<T>) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldContent>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start bg-white pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  type="button"
                >
                  {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? (field.value as Date) : undefined}
                  onSelect={(date: Date | undefined) => {
                    field.onChange(date);
                    setIsDatePopoverOpen(false);
                  }}
                  captionLayout="label"
                  {...calendarProps}
                />
              </PopoverContent>
            </Popover>
          </FieldContent>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
        </Field>
      )}
    />
  );
};

export default InputGroupDatePicker;

/**
 * Usage
 * 
 <InputGroupDatePicker
    control={form.control}
    name="end_date"
    label="End Date"
    description="Select the end date of the experience."
  />
 */
