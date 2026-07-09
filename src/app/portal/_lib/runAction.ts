import toast from "react-hot-toast";

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
  const result = await action();

  if (!result.success) {
    toast.error(result.error ?? messages.error ?? "Something went wrong.", {
      id: toastId,
    });
    return result;
  }

  toast.success(messages.success, { id: toastId });
  return result;
}
