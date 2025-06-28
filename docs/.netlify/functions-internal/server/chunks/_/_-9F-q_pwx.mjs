import { jsx, jsxs } from 'react/jsx-runtime';
import { notFound, createFileRoute } from '@tanstack/react-router';
import { executeMdxSync } from '@fumadocs/mdx-remote/client';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from 'fumadocs-ui/page';
import { createCompiler } from '@fumadocs/mdx-remote';
import { c as createServerRpc, a as createServerFn, s as source } from './ssr.mjs';
import path__default from 'node:path';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useMemo } from 'react';
import 'fumadocs-ui/provider/base';
import 'fumadocs-core/framework/tanstack';
import 'fumadocs-core/source';
import 'gray-matter';
import 'lucide-static';
import 'tiny-invariant';
import 'tiny-warning';
import '@tanstack/router-core';
import '@tanstack/router-core/ssr/client';
import 'fumadocs-core/search/server';
import 'fumadocs-core/mdx-plugins';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

const compiler = createCompiler();
const loader_createServerFn_handler = createServerRpc("src_routes_docs_tsx--loader_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return loader.__executeServer(opts, signal);
});
const loader = createServerFn({
  method: "GET"
}).validator((slugs) => slugs).handler(loader_createServerFn_handler, async ({
  data: slugs
}) => {
  const page = source.getPage(slugs);
  if (!page) throw notFound();
  const {
    content,
    ...rest
  } = page.data;
  const compiled = await compiler.compileFile({
    path: path__default.resolve("content", page.path),
    value: content
  });
  return {
    tree: source.pageTree,
    ...rest,
    compiled: compiled.toString()
  };
});
const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({
    params
  }) => {
    var _a;
    const slugs = ((_a = params._splat) != null ? _a : "").split("/");
    return loader({
      data: slugs
    });
  }
});
function Page() {
  const {
    compiled,
    ...data
  } = Route.useLoaderData();
  const {
    default: MDX,
    toc
  } = executeMdxSync(compiled);
  const tree = useMemo(() => {
    function traverse(folder) {
      for (const node of folder.children) {
        if (node.type === "page" && typeof node.icon === "string") {
          node.icon = /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: {
            __html: node.icon
          } });
        }
        if (node.type === "folder") traverse(node);
      }
    }
    const tree2 = data.tree;
    traverse(tree2);
    return tree2;
  }, [data.tree]);
  return /* @__PURE__ */ jsx(DocsLayout, { tree, nav: {
    title: "PingPay Onramp Docs"
  }, children: /* @__PURE__ */ jsxs(DocsPage, { toc, children: [
    /* @__PURE__ */ jsx(DocsTitle, { children: data.title }),
    /* @__PURE__ */ jsx(DocsDescription, { children: data.description }),
    /* @__PURE__ */ jsx(DocsBody, { children: /* @__PURE__ */ jsx(MDX, { components: {
      ...defaultMdxComponents
    } }) })
  ] }) });
}

export { loader_createServerFn_handler };
//# sourceMappingURL=_-9F-q_pwx.mjs.map
