"use client";

import * as React from "react";
import {
  Controller,
  Control,
  ControllerRenderProps,
  FieldError as RHFError,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { countWords, enforceWordLimit, truncateToMaxWords, cn } from "./utils";

type TextareaFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  inputProps?: React.ComponentProps<"textarea"> & {
    maxLength?: number;
  };
  wordLimit?: {
    min?: number;
    max: number;
  };
};

function TextareaFieldInner<T extends FieldValues>({
  field,
  fieldState,
  name,
  label,
  description,
  inputProps,
  wordLimit,
  fieldRef,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: { invalid: boolean; error?: RHFError };
  name: string;
  label?: string;
  description?: string;
  inputProps: TextareaFieldProps<T>["inputProps"];
  wordLimit?: TextareaFieldProps<T>["wordLimit"];
  fieldRef: React.Ref<HTMLTextAreaElement>;
}) {
  const { maxLength, onChange: inputOnChange, ...textareaProps } = inputProps ?? {};
  const resolvedMaxLength = wordLimit ? undefined : maxLength;

  const [draft, setDraft] = React.useState(() => String(field.value ?? ""));
  const draftRef = React.useRef(draft);

  React.useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const applyWordLimit = React.useCallback(
    (text: string, previous?: string) => {
      if (!wordLimit) return text;
      if (previous !== undefined) {
        return enforceWordLimit(previous, text, wordLimit.max);
      }
      return truncateToMaxWords(text, wordLimit.max);
    },
    [wordLimit],
  );

  React.useEffect(() => {
    const nextValue = String(field.value ?? "");
    setDraft((prev) => (prev === nextValue ? prev : nextValue));
  }, [field.value]);

  const wordCount = countWords(draft);
  const isOverWordLimit = wordLimit !== undefined && wordCount > wordLimit.max;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const limited = applyWordLimit(event.target.value, draftRef.current);
    setDraft(limited);
    field.onChange(limited);
    inputOnChange?.({
      ...event,
      target: { ...event.target, value: limited },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      {label && (
        <FieldLabel htmlFor={name} className="text-gray-900 dark:text-white font-semibold text-sm mb-1 block">
          {label}
          {textareaProps?.required && <span className="text-red-500 ml-1">*</span>}
        </FieldLabel>
      )}
      <InputGroup
        className={cn(
          "bg-white border border-gray-200 dark:border-input text-gray-900 focus-within:border-gray-400 focus-within:ring-0 rounded-lg has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/0 has-[[data-slot=input-group-control]:focus-visible]:ring-[0px]",
          wordLimit && "flex-col items-stretch",
        )}
      >
        <div className={cn("w-full", wordLimit && "max-h-[500px] overflow-y-auto md:max-h-[550px]")}>
          <InputGroupTextarea
            {...textareaProps}
            id={name}
            name={field.name}
            ref={fieldRef}
            onBlur={field.onBlur}
            value={draft}
            onChange={handleChange}
            className={cn(
              "resize-none text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 px-4 pb-3 text-sm! sm:text-sm! min-h-24 w-full",
              "placeholder:text-gray-500",
              wordLimit ? "pt-4" : "py-3",
            )}
            aria-invalid={fieldState.invalid}
            maxLength={resolvedMaxLength}
          />
        </div>
        <InputGroupAddon align="block-end" className="px-0 pb-0">
          <div className={cn("flex w-full items-center justify-end px-4 pb-2", wordLimit && "pt-3")}>
            <InputGroupText
              className={`tabular-nums text-xs bg-transparent border-0 px-0 pb-0 ${
                isOverWordLimit ? "text-red-500" : "text-gray-500"
              }`}
            >
              {wordLimit
                ? `${wordCount}/${wordLimit.max} words`
                : `${draft.length}/${resolvedMaxLength ?? 100} characters`}
            </InputGroupText>
          </div>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription className="text-gray-600 text-sm mt-1.5">{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error as RHFError]} />}
    </Field>
  );
}

const InputTextareaWordLimitField = <T extends FieldValues>({
  control,
  name,
  label = "Description",
  description = "",
  inputProps = {
    placeholder: "Type your message here...",
    maxLength: 100,
    rows: 6,
  },
  wordLimit,
}: TextareaFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextareaFieldInner
        fieldRef={field.ref}
        field={field}
        fieldState={fieldState}
        name={name}
        label={label}
        description={description}
        inputProps={inputProps}
        wordLimit={wordLimit}
      />
    )}
  />
);

export default InputTextareaWordLimitField;




/**
 * Usage
 * 
  <InputTextareaWordLimitField
    control={form.control}
    name="message"
    label="Message"
    inputProps={{
      placeholder:" Key stackeholders, current situation, timing...",
      rows: 6,
    }}
    wordLimit={{ max: MESSAGE_MAX_WORDS }} get MESSAGE_MAX_WORDS from schema
  />
 */

