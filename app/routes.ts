import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("share", "routes/share.tsx"),
  route("og", "routes/og.ts"),
] satisfies RouteConfig;
