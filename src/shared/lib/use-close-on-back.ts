import { useEffect, useEffectEvent } from "react";

export function useCloseOnBack(enabled: boolean, onClose: () => void) {
  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.history.pushState({ modalOpen: true }, "");
    window.addEventListener("popstate", handleClose);

    return () => {
      window.removeEventListener("popstate", handleClose);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [enabled]);
}
