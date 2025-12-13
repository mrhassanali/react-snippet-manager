import * as React from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

type InputGroupFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  endText?: React.ReactNode;
  inputProps?: React.ComponentProps<"input">;
};

const InputGroupField = <T extends FieldValues>({
  control,
  name,
  label = "Description",
  description = "",
  startIcon,
  endIcon,
  endText,
  inputProps = {
    placeholder: "Type your message here...",
  },
}: InputGroupFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <InputGroup>
          <InputGroupInput {...field} {...inputProps} aria-invalid={fieldState.invalid}/>
          {React.isValidElement(startIcon) && <InputGroupAddon>{startIcon}</InputGroupAddon>}

          {React.isValidElement(endIcon) && (
            <InputGroupAddon align="inline-end">
              <InputGroupText>{endIcon}</InputGroupText>
            </InputGroupAddon>
          )}
          {endText && (
            <InputGroupAddon align="inline-end">
              <InputGroupText>{endText}</InputGroupText>
            </InputGroupAddon>
          )}
        </InputGroup>
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
      </Field>
    )}
  />
);

export default InputGroupField;

/**
 * Usage
 * 
  <InputGroupField
    control={form.control}
    name="title"
    label="Persona Name"
    description=""
    inputProps={{
      placeholder: "Enter persona name",
    }}
  />
 */
