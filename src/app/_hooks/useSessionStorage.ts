import { useCallback, useState } from "react";

import { type PortalNavigationLinks } from "@/app/_types";

type SetStringValue = (
  value:
    | PortalNavigationLinks
    | ((prevValue: PortalNavigationLinks) => PortalNavigationLinks),
) => void;

export function useSessionStorage(
  key: string,
  defaultValue: PortalNavigationLinks,
): [PortalNavigationLinks, SetStringValue] {
  const [storedValue, setStoredValue] = useState<PortalNavigationLinks>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as PortalNavigationLinks) : defaultValue;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue: SetStringValue = useCallback(
    (
      value:
        | PortalNavigationLinks
        | ((prevValue: PortalNavigationLinks) => PortalNavigationLinks),
    ) => {
      try {
        // so that it follow sthe same as usestate
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
