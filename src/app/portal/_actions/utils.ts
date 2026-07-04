import { PortalError } from "@/server/portal/errors";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { data, success: true };
}

export function actionError(error: unknown): ActionResult<never> {
  if (error instanceof PortalError) {
    return { error: error.message, success: false };
  }
  if (error instanceof Error) {
    return { error: error.message, success: false };
  }
  return { error: "An unexpected error occurred.", success: false };
}
