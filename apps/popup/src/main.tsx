import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createStore, Provider } from "jotai";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

import type { TargetAsset } from "@pingpay/onramp-types";

export interface RouterContext {
  queryClient: QueryClient;
  store: ReturnType<typeof createStore>;
  sessionId: string;
  target?: TargetAsset;
}

const queryClient = new QueryClient();
const store = createStore();

const router = createRouter({
  routeTree,
  context: {
    store,
    queryClient,
    // These will be injected by root route's validateSearch and beforeLoad
    sessionId: "",
    target: undefined,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  );
}
