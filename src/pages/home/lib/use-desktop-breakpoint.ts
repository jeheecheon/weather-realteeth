import { useEffect } from "react";
import { useMedia } from "react-use";

type UseDesktopParams = {
  onChange?: (isDesktop: boolean) => void;
};

export function useDesktopBreakpoint(params: UseDesktopParams = {}) {
  const isDesktop = useMedia("(width >= 48rem)");

  useEffect(() => {
    params.onChange?.(isDesktop);
  }, [isDesktop, params.onChange]);

  return isDesktop;
}
