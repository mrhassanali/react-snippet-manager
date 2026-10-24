import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Controller,
  Control,
  FieldError as RHFError,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<"input">;
  labelProps?: React.ComponentProps<"label">;
};

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  description = "",
  inputProps = {
    placeholder: "Type your message here...",
  },
  labelProps = {},
}: InputFieldProps<T>) => {
  const { type, className, readOnly, ...restInputProps } = inputProps;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={name} {...labelProps}>
              {label}
              {restInputProps.required && <span className="text-red-500">*</span>}
            </FieldLabel>
          )}
          <Input
            {...field}
            {...restInputProps}
            readOnly={readOnly}
            type={type || "text"}
            className={cn(
              type === "number" && "no-number-spinner",
              readOnly && "cursor-not-allowed bg-gray-50",
              className,
            )}
            aria-invalid={fieldState.invalid}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error as RHFError]} />
          )}
        </Field>
      )}
    />
  );
};

export default InputField;

/**
 * Usage
 * 
  <InputField
    control={form.control}
    name="title"
    label="Field Name"
    description=""
    inputProps={{
      placeholder: "Enter field name",
    }}
  />
 */
