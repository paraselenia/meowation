import { RouterContextProvider, createContext, createRequestHandler } from "react-router";

export const envContext = createContext<Env>();
export const ctxContext = createContext<ExecutionContext>();

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const context = new RouterContextProvider();
    context.set(envContext, env);
    context.set(ctxContext, ctx);
    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;
