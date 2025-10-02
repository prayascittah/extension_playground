import { useAppStore } from "../store/appStore.ts";

export function useLiveClock(timeoutRef) {
  const { setTime } = useAppStore();
  // Live clock effect
  return () => {
    const getTime = () => {
      const now = new Date();
      setTime(now);
      timeoutRef.current = setTimeout(getTime, 1000 - now.getMilliseconds());
    };
    getTime();
    return () => clearTimeout(timeoutRef.current);
  };
}
