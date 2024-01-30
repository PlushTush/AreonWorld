import {Dispatch, useCallback, useEffect, useLayoutEffect, useRef} from "react";

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useSafeDispatch<T>(dispatch: Dispatch<T>) {
    const mountedRef = useRef(false);

    useIsomorphicLayoutEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return useCallback(
        (action: T) => {
            if (mountedRef.current) {
                dispatch(action);
            }
        },
        [dispatch]
    );
}