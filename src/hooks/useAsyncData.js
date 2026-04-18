import { useEffect, useReducer, useRef } from 'react';

/**
 * useAsyncData — wraps an async fetcher with loading / error / data state.
 * Safe against race conditions and unmounts.
 *
 * Pass a stable fetcher (module-level function or one wrapped in
 * `useCallback` by the caller). The hook re-runs whenever the fetcher
 * reference changes or `refetch` is called.
 *
 * @param {Function} fetcher — async () => T
 */

const initialState = { data: null, error: null, loading: true };

const reducer = (state, action) => {
  switch (action.type) {
    case 'start':
      // Only flip to loading if we aren't already — avoids extra renders
      return state.loading && state.data === null && state.error === null
        ? state
        : { data: null, error: null, loading: true };
    case 'success':
      return { data: action.payload, error: null, loading: false };
    case 'error':
      return { data: null, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const useAsyncData = (fetcher) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const requestIdRef = useRef(0);
  const [reloadToken, setReloadToken] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;
    dispatch({ type: 'start' });

    (async () => {
      try {
        const result = await fetcher();
        if (cancelled || requestId !== requestIdRef.current) return;
        dispatch({ type: 'success', payload: result });
      } catch (err) {
        if (cancelled || requestId !== requestIdRef.current) return;
        dispatch({ type: 'error', payload: err });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetcher, reloadToken]);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    refetch: setReloadToken,
  };
};
