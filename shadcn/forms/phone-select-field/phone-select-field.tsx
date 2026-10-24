import * as React from "react";

import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { PhoneInput } from "@/components/ui/phone-input";

type PhoneSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  phoneInputProps?: React.ComponentProps<typeof PhoneInput>;
  labelProps?: React.ComponentProps<"label">;
};

const PhoneSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  description = "",
  phoneInputProps = {
    placeholder: "Enter phone number",
  },
  labelProps = {},
}: PhoneSelectFieldProps<T>) => {
  const { className, required, ...restPhoneProps } = phoneInputProps;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={name} {...labelProps}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FieldLabel>
          )}

          <PhoneInput
            {...restPhoneProps}
            value={field.value}
            onChange={field.onChange}
            className={cn(
              "font-outfit",
              "[&>input]:border-[0.833px]",
              "[&>input]:border-solid",
              "[&>input]:border-[#D9D9D9]",
              "[&>input]:dark:border-input",
              "[&>input]:px-4",
              "[&>input]:py-3",
              "[&>input]:placeholder:capitalize",
              className,
            )}
            aria-invalid={fieldState.invalid}
            international
            defaultCountry="PK"
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
        </Field>
      )}
    />
  );
};

export default PhoneSelectField;


/**
 * Usage
 * 
  <InputPhoneField
    control={form.control}
    name="phone"
    label="Phone Number"
    phoneInputProps={{
      placeholder: "Enter your phone number",
    }}
  />
*/