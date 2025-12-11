import * as React from "react";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea as TextArea,
} from "@/components/ui/input-group";

type InputGroupTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  inputProps?: React.ComponentProps<"textarea"> & {
    maxLength?: number;
  };
};

const InputGroupTextarea = <T extends FieldValues>({
  control,
  name,
  label = "Description",
  description = "",
  inputProps = {
    placeholder: "Type your message here...",
    maxLength: 100,
    rows: 6,
  },
}: InputGroupTextareaProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <InputGroup>
          <TextArea
            {...field}
            id={name}
            className="min-h-24 resize-none"
            aria-invalid={fieldState.invalid}
            {...inputProps}
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {field.value?.length || 0}/{inputProps.maxLength} characters
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
      </Field>
    )}
  />
);

export default InputGroupTextarea;
