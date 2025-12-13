import * as React from "react";
import Link from "next/link";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, Control, FieldError as RHFError, FieldPath, FieldValues } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { FORGOT_PASSWORD_URL } from "@/constants/route-links";

type InputPasswordGroupFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<"input">;
  isShowForgotPasswordLink?: boolean;
};

const InputPasswordGroupField = <T extends FieldValues>({
  control,
  name,
  label = "Description",
  description = "",
  inputProps = {
    placeholder: "Enter your password",
  },
  isShowForgotPasswordLink = false,
}: InputPasswordGroupFieldProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prevState) => !prevState);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className={cn(isShowForgotPasswordLink ? "flex items-center" : "")}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            {isShowForgotPasswordLink && (
              <Link
                href={FORGOT_PASSWORD_URL}
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            )}
          </div>
          <InputGroup className="relative">
            <InputGroupInput {...field} {...inputProps} type={isPasswordVisible ? "text" : "password"} aria-invalid={fieldState.invalid} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={togglePasswordVisibility}>
                {isPasswordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
        </Field>
      )}
    />
  );
};

export default InputPasswordGroupField;

/**
 * Usage
 * 
  <InputPasswordGroupField
    control={form.control}
    name="password"
    label="Password"
    inputProps={{
      type: "password",
      placeholder: "Enter your password",
    }}
    isShowForgotPasswordLink={true}
  />
 */
