import { jsxs, jsx } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

const SplitComponent = function Home() {
  return /* @__PURE__ */ jsxs(HomeLayout, { nav: {
    title: "PingPay Docs"
  }, className: "text-center py-32 justify-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-medium text-xl mb-4", children: "PingPay Docs" }),
    /* @__PURE__ */ jsx(Link, { to: "/docs/$", params: {
      _splat: ""
    }, className: "px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto", children: "Open Docs" })
  ] });
};

export { SplitComponent as component };
//# sourceMappingURL=index-Dsl4MEkl.mjs.map
