import { jsx, jsxs } from 'react/jsx-runtime';
import { executeMdxSync } from '@fumadocs/mdx-remote/client';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { useMemo } from 'react';
import { R as Route } from './ssr.mjs';
import '@tanstack/react-router';
import 'fumadocs-ui/provider/base';
import 'fumadocs-core/framework/tanstack';
import '@fumadocs/mdx-remote';
import 'fumadocs-core/source';
import 'gray-matter';
import 'node:path';
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

const SplitComponent = function Page() {
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
};

export { SplitComponent as component };
//# sourceMappingURL=_-BnA5QDav.mjs.map
