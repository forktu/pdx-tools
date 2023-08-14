import { useCallback, useState } from "react";
import { captureException } from "@/features/errors";
import { getEu4Worker } from "@/features/eu4/worker";
import { Eu4Worker } from "./bridge";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useOnNewSave } from "./useOnNewSave";

export const useEu4Worker = <T>(cb: (arg0: Eu4Worker) => Promise<T>) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useOnNewSave(
    useCallback(() => {
      let mounted = true;
      async function getData() {
        try {
          if (mounted) {
            setLoading(true);
            const worker = getEu4Worker();
            const result = await cb(worker);
            if (mounted) {
              setError(undefined);
              setData(result);
            }
          }
        } catch (error) {
          captureException(error);
          setError(getErrorMessage(error));
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
      getData();

      return () => {
        mounted = false;
      };
    }, [cb]),
  );

  return { isLoading, data, error };
};
