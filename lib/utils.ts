import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (
  error: unknown
): { message: string; code?: string } => {
  let result: { message: string; code?: string } = {
    message: "Something went wrong",
  };

  if (error instanceof Error) {
    result.message = error.message;
    // If the error has a code property, assign it. This assumes that some errors might have a code property.
    if ("code" in error) {
      result.code = String(error.code);
    }
  } else if (error && typeof error === "object" && "message" in error) {
    result.message = String(error.message);
    // If the error object has a code property, assign it.
    if ("code" in error) {
      result.code = String(error.code);
    }
  } else if (typeof error === "string") {
    result.message = error;
  }

  return result;
};
