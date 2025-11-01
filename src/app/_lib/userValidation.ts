import { z } from "zod";

// Regex patterns for validation
const phoneRegex = /^\+?[\d\s()-]{10,}$/;
const emailDomainRegex = /@ucalgary\.ca$/i; // UCalgary email validation
const currentYear = new Date().getFullYear();

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  schoolEmail: z
    .string()
    .email("Please enter a valid email address")
    .regex(emailDomainRegex, "Must be a @ucalgary.ca email address")
    .optional()
    .or(z.literal("")),

  phoneNumber: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  ucid: z
    .number()
    .int("UCID must be a whole number")
    .positive("UCID must be a positive number")
    .min(10000000, "UCID must be at least 8 digits")
    .max(99999999, "UCID must be at most 8 digits")
    .optional()
    .or(z.literal(null)),

  fieldOfStudy: z
    .string()
    .max(100, "Field of study must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  schoolYear: z
    .string()
    .max(50, "School year must be less than 50 characters")
    .optional()
    .or(z.literal("")),

  yearJoined: z
    .string()
    .regex(/^\d{4}$/, "Year must be in YYYY format (e.g., 2024)")
    .refine(
      (year) => {
        const y = parseInt(year);
        return y >= 2000 && y <= currentYear + 1;
      },
      {
        message: `Year must be between 2000 and ${currentYear + 1}`,
      },
    )
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(250, "Description must be less than 250 characters")
    .optional()
    .or(z.literal("")),

  teamRole: z.string().optional().or(z.literal("")),

  // profile picture (not validated here as it's a file upload)
  profilePictureUrl: z.string().optional().or(z.literal("")),
});

export type UserFormData = z.infer<typeof userFormSchema>;

// type of the validation errors
export type UserFormErrors = Partial<Record<keyof UserFormData, string>>;

// validate form. return errors if any
export function validateUserForm(data: Partial<UserFormData>): UserFormErrors {
  try {
    userFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: UserFormErrors = {};
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof UserFormData;
        if (path) {
          errors[path] = err.message;
        }
      });
      return errors;
    }
    return {};
  }
}

// validate a single field. return error if any
export function validateUserFormField(
  fieldName: keyof UserFormData,
  value: string | number | null | undefined,
): string | null {
  try {
    const fieldSchema = userFormSchema.shape[fieldName];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message ?? null;
    }
    return null;
  }
}
