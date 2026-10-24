"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, Controller, FieldPath, FieldValues, FieldError as RHFError } from "react-hook-form";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type InputCommandSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: Option[];
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
};

const InputCommandSelect = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  options,
  disabled = false,
  loading = false,
  required = false,
}: InputCommandSelectProps<T>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((option) => option.value === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
                {required && <span className="text-red-500">*</span>}
              </FieldLabel>
            )}

            <FieldContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      id={name}
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={disabled || loading}
                      className={cn(
                        "min-h-10 w-full justify-between rounded-md font-normal focus-visible:ring-0",
                        !selectedOption && "text-muted-foreground",
                      )}
                    >
                      <span className="truncate">
                        {loading ? "Loading..." : (selectedOption?.label ?? placeholder)}
                      </span>

                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  }
                />

                <PopoverContent className="w-[var(--anchor-width)] p-0">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />

                    <CommandList>
                      <CommandEmpty>{emptyMessage}</CommandEmpty>

                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              field.onChange(option.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", field.value === option.value ? "opacity-100" : "opacity-0")}
                            />

                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FieldContent>

            {description && <FieldDescription>{description}</FieldDescription>}

            {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
          </Field>
        );
      }}
    />
  );
};

export default InputCommandSelect;




/*
* Usage
* 
  <InputCommandSelect
    control={form.control}
    name="industry"
    label="Industry / Sector"
    options={INDUSTORY_OPTIONS}
    placeholder="Select industry"
    required={true}
  />
*/




