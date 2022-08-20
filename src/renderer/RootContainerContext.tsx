import { createContext, ReactNode, RefObject, useRef } from 'react';

export const ContainerRefContext =
  createContext<RefObject<HTMLDivElement> | null>(null);

interface Props {
  children: ReactNode;
}

export const ContextStore = ({ children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ContainerRefContext.Provider value={ref}>
      {children}
    </ContainerRefContext.Provider>
  );
};
