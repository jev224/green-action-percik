// hooks/useShowToast.tsx  (note: .tsx, since it renders JSX)
import { useState, useCallback } from "react";

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

type ShowToastOptions = {
  title: string;
  description?: string;
  action?: "error" | "warning" | "success" | "info" | "muted";
  variant?: "solid" | "outline";
  duration?: number;
  placement?:
    | "top"
    | "bottom"
    | "top right"
    | "top left"
    | "bottom right"
    | "bottom left";
};

export function useShowToast() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);

  const showToast = useCallback(
    ({
      title,
      description,
      action = "muted",
      variant = "solid",
      duration = 3000,
      placement = "bottom",
    }: ShowToastOptions) => {
      if (toast.isActive(String(toastId))) return;

      const newId = Date.now() + toastId + 1;
      setToastId(newId);

      toast.show({
        id: String(newId),
        placement,
        duration,

        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={action}
              variant={variant}
              className="self-center mb-12 mx-4"
            >
              <ToastTitle>{title}</ToastTitle>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </Toast>
          );
        },
      });
    },

    [toast, toastId],
  );

  return showToast;
}
