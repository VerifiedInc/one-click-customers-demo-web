import { createContext, PropsWithChildren, useContext } from 'react';

type RequestContext = {
  isRequest: boolean;
  isPublicRequest: boolean;
};

const Context = createContext<RequestContext>({
  isRequest: false,
  isPublicRequest: false,
});

export function useRequestContext() {
  return useContext(Context);
}

export function RequestProvider(
  props: Partial<RequestContext> & PropsWithChildren
) {
  return (
    <Context.Provider
      value={{
        isRequest: props.isRequest || false,
        isPublicRequest: props.isPublicRequest || false,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
