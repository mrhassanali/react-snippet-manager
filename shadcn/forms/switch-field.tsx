"use client";

import * as React from "react";
import { Control, Controller, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

type SwitchFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  switchProps?: React.ComponentProps<typeof Switch>;
  labelProps?: React.ComponentProps<"label">;
  className?: string;
  descriptionClassName?: string;
};

const SwitchField = <T extends FieldValues>({ control, name, label, description, switchProps, labelProps = {}, className, descriptionClassName }: SwitchFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("flex flex-row items-center justify-between", className)}>
          <div className="space-y-0.5">
            {label && (
              <FieldLabel htmlFor={name} {...labelProps}>
                {label}
              </FieldLabel>
            )}
            {description && <FieldDescription className={descriptionClassName}>{description}</FieldDescription>}
          </div>
          <Switch {...switchProps} id={name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
        </Field>
      )}
    />
  );
};

export default SwitchField;


/**
 * Usage
 * 
<SwitchField
  control={form.control}
  name="marketing_emails"
  label="Marketing emails"
  description="Receive emails about new products, features, and more."
/> 
 */
