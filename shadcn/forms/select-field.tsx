import * as React from "react";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; group?: string };

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  inputProps?: Omit<React.ComponentProps<typeof SelectTrigger>, "children" | "value" | "onValueChange"> & {
    placeholder?: string;
  };
  options: Option[];
};

const SelectField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  inputProps = {},
  options,
}: SelectFieldProps<T>) => {
  // Group options by group name (or undefined)
  const grouped = React.useMemo(() => {
    const map = new Map<string | undefined, Option[]>();
    options.forEach((opt) => {
      const group = opt.group;
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(opt);
    });
    return Array.from(map.entries());
  }, [options]);

  // Destructure placeholder for SelectTrigger, rest for SelectTrigger as well
  const { placeholder, className, ...triggerProps } = inputProps;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={name} className="text-gray-900 font-semibold text-sm mb-1 block">
              {label}
            </FieldLabel>
          )}
          <FieldContent>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={label ? name : undefined}
                className={cn(
                  className,
                )}
                {...triggerProps}
              >
                <SelectValue placeholder={placeholder} className="placeholder:text-gray-500!"/>
              </SelectTrigger>
              <SelectContent>
                {grouped.map(([group, opts]) => (
                  <SelectGroup key={group ?? "ungrouped"}>
                    {group && <SelectLabel>{group}</SelectLabel>}
                    {opts.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="hover:dark:bg-[#f5f5f5] hover:dark:text-black focus:dark:bg-[#f5f5f5] focus:dark:text-black">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
        </Field>
      )}
    />
  );
};

export default SelectField;
