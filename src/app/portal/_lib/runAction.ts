import toast from "react-hot-toast";

import { tryCatch } from "@/app/_lib/utils";
import type { ActionResult } from "@/app/portal/actions";

export async function runPortalAction<T>(
  action: () => Promise<ActionResult<T>>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  },
): Promise<ActionResult<T>> {
  const toastId = toast.loading(messages.loading);
  const { data } = await tryCatch(Promise.resolve().then(action));
  const result: ActionResult<T> = data ?? {
    error: messages.error ?? "Something went wrong.",
    success: false,
  };

  if (!result.success) {
    toast.error(result.error ?? messages.error ?? "Something went wrong.", {
      id: toastId,
    });
    return result;
  }

  toast.success(messages.success, { id: toastId });
  return result;
}
