"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  group?: string;
};

type InputGroupMultiSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  emptyMessage?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const MultiSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Select options",
  emptyMessage = "No options found.",
  options,
  required = false,
  disabled = false,
  className,
}: InputGroupMultiSelectProps<T>) => {
  const optionMap = React.useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value: string[] = Array.isArray(field.value) ? field.value : [];

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
                {required && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}

            <FieldContent>
              <Combobox
                multiple
                value={value}
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                }}
                items={options.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                disabled={disabled}
              >
                <ComboboxChips
                  className={cn(
                    "min-h-10 w-full",
                    fieldState.invalid && "border-destructive ring-destructive/20",
                    className,
                  )}
                  aria-invalid={fieldState.invalid}
                >
                  <ComboboxValue>
                    {value.map((selectedValue) => {
                      const option = optionMap.get(selectedValue);

                      return (
                        <ComboboxChip key={selectedValue} className="border-border border text-sm">
                          {option?.label ?? selectedValue}
                        </ComboboxChip>
                      );
                    })}
                  </ComboboxValue>

                  <ComboboxChipsInput
                    placeholder={value.length > 0 ? "" : placeholder}
                    disabled={disabled}
                    aria-label={label}
                  />
                </ComboboxChips>

                <ComboboxContent>
                  <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

                  <ComboboxList>
                    {(item) => {
                      const option = optionMap.get(item.value);

                      return (
                        <ComboboxItem key={item.value} value={item.value}>
                          {option?.label ?? item.label}
                        </ComboboxItem>
                      );
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldContent>

            {description && <FieldDescription>{description}</FieldDescription>}

            {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
          </Field>
        );
      }}
    />
  );
};

export default MultiSelectField;
