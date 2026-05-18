// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

function isValidDateOnlyString(value: string): boolean {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!dateMatch) return false;

  const [, year, month, day] = dateMatch;
  const parsedDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getUTCFullYear() === Number(year) &&
    parsedDate.getUTCMonth() + 1 === Number(month) &&
    parsedDate.getUTCDate() === Number(day)
  );
}

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

export function formatDateOnly(
  value: Date | string | null | undefined,
): string {
  if (!value) return "";

  if (typeof value === "string") {
    if (isValidDateOnlyString(value)) return value;
    if (/^\d{4}$/.test(value)) return `${value}-01-01`;

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? ""
      : parsed.toISOString().slice(0, 10);
  }

  // Guard against invalid Date objects to avoid toISOString() throwing
  if (Number.isNaN(value.getTime())) return "";
  return value.toISOString().slice(0, 10);
}

export function parseDateOnly(
  value: Date | string | null | undefined,
): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(
      Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
    );
  }

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    if (!isValidDateOnlyString(value)) return null;

    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const yearMatch = /^(\d{4})$/.exec(value);
  if (yearMatch) {
    return new Date(Date.UTC(Number(yearMatch[1]), 0, 1));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
