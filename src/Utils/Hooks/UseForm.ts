import { useEffect, useState } from "react";
import { z } from "zod";

export default function useForm<T extends z.ZodRawShape>(
  formSchema: z.ZodObject<T>,
  defaultValues: z.infer<typeof formSchema>,
) {
  type TFormValues = z.infer<typeof formSchema>;

  const [formValues, setFormValues] = useState<TFormValues>(defaultValues);
  const [errors, setErrors] = useState<z.inferFormattedError<typeof formSchema>>();
  const [submittedOnce, setSubmittedOnce] = useState<boolean>(false);

  useEffect(() => {
    if (!submittedOnce) return;

    const result = formSchema.safeParse(formValues);

    if (!result.success) {
      setErrors(result.error.format());
    } else {
      setErrors(undefined);
    }
  }, [formValues]);

  function editField<K extends keyof TFormValues>(fieldName: K, fieldValue: TFormValues[K] | undefined | null) {
    setFormValues({ ...formValues, [fieldName]: fieldValue });
  }

  function submitForm(onSubmitionSuccess: () => void) {
    return (e?: React.FormEvent<HTMLFormElement>) => {
      if (!submittedOnce) setSubmittedOnce(true);

      if (e !== undefined) e.preventDefault();

      const result = formSchema.safeParse(formValues);

      if (!result.success) {
        setErrors(result.error.format());
      } else {
        setErrors(undefined);
        onSubmitionSuccess();
      }
    };
  }

  return {
    formValues,
    setFormValues,
    editField,

    errors,
    setErrors,

    submitForm,
  };
};
