import * as React from "react";

import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type RadioFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  options: { label: string; value: string }[]; // for checkbox options
  className?: string;
};

const RadioField = <T extends FieldValues>({ control, name, label, description = "", options, className }: RadioFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FieldSet data-invalid={fieldState.invalid}>
        <FieldLegend variant="label" className="sm:text-[17px]!">{label}</FieldLegend>
        {description && <FieldDescription>{description}</FieldDescription>}

        <RadioGroup value={field.value} onValueChange={field.onChange} className={className} data-invalid={fieldState.invalid}>
          {options.map((opt) => (
            <Field orientation="horizontal" key={`opt-${opt.label}`}>
              <RadioGroupItem value={opt.value} id={`plan-${opt.value}`} aria-invalid={fieldState.invalid} />
              <FieldLabel htmlFor={`plan-${opt.value}`} className="font-normal">
                {opt.label}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>

        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldSet>
    )}
  />
);

export default RadioField;

/**
 * Usage
 * 
<RadioField
  control={form.control}
  name="gender"
  label="Gender"
  options={SURVEY_GENDER_OPTIONS}
  className="mt-3 flex max-w-fit flex-row items-start gap-6 sm:gap-8"
  readOnly={isReadOnly}
/>
 */
