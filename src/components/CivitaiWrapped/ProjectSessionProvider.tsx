import { createContext, useContext, useMemo, useEffect, useRef, useState } from 'react';
import { TUserProps, useUserStore } from '~/store/user.store';

export function ProjectSessionProvider({ children }: { children: React.ReactNode }) {
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const value = useUserStore((state) => state.userInfo);

  useEffect(() => {
    const localUserInfo = localStorage.getItem('userInfo');
    // console.log('localUserInfo: ', localUserInfo);
    if (localUserInfo) {
      setUserInfo(JSON.parse(localUserInfo));
    }
  }, []);

  return <Provider value={value}>{children}</Provider>;
}

// for reference: https://github.com/pacocoursey/state/blob/main/context.js
const CivitaiSessionContext = createContext<{
  state: TUserProps | null;
  subscribe: (listener: (key: keyof TUserProps, value: any) => void) => () => boolean;
} | null>(null);

export const Provider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TUserProps | null;
}) => {
  const state = useRef(value);
  const listeners = useRef(new Set<(key: keyof TUserProps, value: any) => void>());
  const [proxy, setProxy] = useState<TUserProps | null>(value ? createProxy() : null);

  function createProxy() {
    return new Proxy<TUserProps>({} as any, {
      get(_, key: keyof TUserProps) {
        return state.current?.[key];
      },
    });
  }

  useEffect(() => {
    if (!value) return;
    if (!state.current) state.current = value;
    if (!proxy) setProxy(createProxy());
    for (const entries of Object.entries(value)) {
      const [key, value] = entries as [keyof TUserProps, never];

      if (state.current && state.current[key] !== value) {
        state.current[key] = value;
        listeners.current.forEach((listener) => listener(key, value));
      }
    }
  }, [value]);

  const subscribe = (listener: (key: keyof TUserProps, value: any) => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  };

  const context = useMemo(() => ({ state: proxy, subscribe }), [proxy]);
  return (
    <CivitaiSessionContext.Provider value={context}>{children}</CivitaiSessionContext.Provider>
  );
};

export const useProjectSessionContext = () => {
  const rerender = useState<Record<string, unknown>>()[1];
  const tracked = useRef<Record<string, boolean>>({});
  const context = useContext(CivitaiSessionContext);
  if (!context) throw new Error('missing CivitaiSessionContext');
  const { state, subscribe } = context;

  const proxy = useRef(
    new Proxy(
      {},
      {
        get(_, key: keyof TUserProps) {
          tracked.current[key] = true;
          return state?.[key];
        },
      }
    )
  );

  useEffect(() => {
    const unsubscribe = subscribe((key) => {
      if (tracked.current[key]) {
        rerender({});
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return state ? (proxy.current as TUserProps) : null;
};
