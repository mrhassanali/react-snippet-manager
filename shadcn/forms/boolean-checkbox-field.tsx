  import * as React from "react";
  import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
  import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
  import { Checkbox } from "@/components/ui/checkbox";

  type BooleanCheckboxFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    description?: string;
    checkboxProps?: React.ComponentProps<typeof Checkbox>;
  };

  const BooleanCheckboxField = <T extends FieldValues>({
    control,
    name,
    label,
    description,
    checkboxProps,
  }: BooleanCheckboxFieldProps<T>) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid} className="items-start gap-3">
            <Checkbox
              id={name}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked === true);
              }}
              aria-invalid={fieldState.invalid}
              className="mt-1"
              {...checkboxProps}
            />

            <div className="space-y-1">
              {label && (
                <FieldLabel htmlFor={name} className="font-normal">
                  {label}
                </FieldLabel>
              )}

              {description && <FieldDescription>{description}</FieldDescription>}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />
    );
  };

  export default BooleanCheckboxField;



  /**
   * Usage
   * 
  <BooleanCheckboxField
    control={form.control}
    name="marketing_emails"
    label="Marketing emails"
    description="Receive emails about new products, features, and more."
  /> 
  */
