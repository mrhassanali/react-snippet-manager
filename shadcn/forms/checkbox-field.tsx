import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";

type CheckboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<typeof CheckboxPrimitive.Root>;
};

const CheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  description = "",
}: CheckboxFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} orientation="horizontal">
        <Checkbox id={name} {...field} />
        <FieldLabel htmlFor={name} className="font-normal" defaultChecked>
          {label}
        </FieldLabel>

        {description && <FieldDescription>{description}</FieldDescription>}
        {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
      </Field>
    )}
  />
);

export default CheckboxField;

/**
 * Usage
 * CheckboxField
  <CheckboxField
    key={addon.id}
    control={form.control}
    name="add_ons"
    label={addon.label}
    inputProps={{
      id: addon.id,
      onCheckedChange: (checked: boolean) => {
        onAddOnChange(addon.id, checked);
      },
    }}
  />
 */
