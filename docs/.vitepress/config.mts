import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import defaultConfig from "./sharedConfig.mjs";

export default defineConfig({
  ...defaultConfig,
  base: "/",
  title: "eslint-plugin-awscdk",
  description: "ESLint plugin for AWS CDK",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/img/logo.png",
      },
    ],
    // setting OGP
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "eslint-plugin-awscdk" }],
    [
      "meta",
      {
        property: "og:description",
        content: "ESLint plugin for AWS CDK",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://eslint-plugin-awscdk.dev/",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://eslint-plugin-awscdk.dev/img/ogp.png",
      },
    ],
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "eslint-plugin-awscdk" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "ESLint plugin for AWS CDK",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://eslint-plugin-awscdk.dev/img/ogp.png",
      },
    ],
    // Other meta tags
    ["meta", { name: "author", content: "ren-yamanashi" }],
    [
      "meta",
      {
        name: "keywords",
        content: "eslint, aws, cdk, typescript, best-practices",
      },
    ],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        ...defaultConfig.themeConfig,
        logo: "/img/logo.png",
        nav: [
          {
            text: "Guide",
            link: "/getting-started/",
          },
          {
            text: "Playground",
            target: "_blank",
            link: "https://eslint-online-playground.netlify.app/#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",
          },
          {
            text: "Blog",
            link: "/blog/2025-10-21.renamed-npm-package",
          },
        ],
        sidebar: {
          "/": [
            {
              text: "Introduction",
              collapsed: true,
              link: "/introduction/",
            },
            {
              text: "Getting Started",
              collapsed: true,
              link: "/getting-started/",
            },
            {
              text: "Rules",
              collapsed: false,
              link: "/rules/",
              items: [
                {
                  text: "construct-constructor-property",
                  link: "/rules/construct-constructor-property",
                },
                {
                  text: "no-construct-in-interface",
                  link: "/rules/no-construct-in-interface",
                },
                {
                  text: "no-construct-in-public-property-of-construct",
                  link: "/rules/no-construct-in-public-property-of-construct",
                },
                {
                  text: "no-construct-stack-suffix",
                  link: "/rules/no-construct-stack-suffix",
                },
                {
                  text: "no-import-private",
                  link: "/rules/no-import-private",
                },
                {
                  text: "no-mutable-property-of-props-interface",
                  link: "/rules/no-mutable-property-of-props-interface",
                },
                {
                  text: "no-mutable-public-property-of-construct",
                  link: "/rules/no-mutable-public-property-of-construct",
                },
                {
                  text: "no-parent-name-construct-id-match",
                  link: "/rules/no-parent-name-construct-id-match",
                },
                {
                  text: "no-unused-props",
                  link: "/rules/no-unused-props",
                },
                {
                  text: "no-variable-construct-id",
                  link: "/rules/no-variable-construct-id",
                },
                {
                  text: "pascal-case-construct-id",
                  link: "/rules/pascal-case-construct-id",
                },
                {
                  text: "prefer-grants-property",
                  link: "/rules/prefer-grants-property",
                },
                {
                  text: "props-name-convention",
                  link: "/rules/props-name-convention",
                },
                {
                  text: "require-jsdoc",
                  link: "/rules/require-jsdoc",
                },
                {
                  text: "require-passing-this",
                  link: "/rules/require-passing-this",
                },
                {
                  text: "require-props-default-doc",
                  link: "/rules/require-props-default-doc",
                },
              ],
            },
          ],
          "/blog/": [
            {
              text: "Renamed npm package to eslint-plugin-awscdk",
              link: "/blog/2025-10-21.renamed-npm-package",
            },
          ],
        },
        socialLinks: [
          {
            icon: {
              svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>`,
            },
            link: "https://github.com/ren-yamanashi/eslint-plugin-awscdk/tree/main",
          },
        ],
      },
    },
    ja: {
      label: "Japanese",
      lang: "ja",
      link: "/ja/",
      title: "eslint-plugin-awscdk",
      themeConfig: {
        ...defaultConfig.themeConfig,
        logo: "/img/logo.png",
        nav: [
          {
            text: "Guide",
            link: "/ja/getting-started/",
          },
          {
            text: "Playground",
            target: "_blank",
            link: "https://eslint-online-playground.netlify.app/#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",
          },
          {
            text: "Blog",
            link: "/ja/blog/2025-10-21.renamed-npm-package",
          },
        ],
        sidebar: {
          "/ja/": [
            {
              text: "Introduction",
              collapsed: true,
              link: "/ja/introduction/",
            },
            {
              text: "Getting Started",
              collapsed: true,
              link: "/ja/getting-started/",
            },
            {
              text: "Rules",
              collapsed: false,
              link: "/ja/rules/",
              items: [
                {
                  text: "construct-constructor-property",
                  link: "/ja/rules/construct-constructor-property",
                },
                {
                  text: "no-construct-in-interface",
                  link: "/ja/rules/no-construct-in-interface",
                },
                {
                  text: "no-construct-in-public-property-of-construct",
                  link: "/ja/rules/no-construct-in-public-property-of-construct",
                },
                {
                  text: "no-construct-stack-suffix",
                  link: "/ja/rules/no-construct-stack-suffix",
                },
                {
                  text: "no-import-private",
                  link: "/ja/rules/no-import-private",
                },
                {
                  text: "no-mutable-property-of-props-interface",
                  link: "/ja/rules/no-mutable-property-of-props-interface",
                },
                {
                  text: "no-mutable-public-property-of-construct",
                  link: "/ja/rules/no-mutable-public-property-of-construct",
                },
                {
                  text: "no-parent-name-construct-id-match",
                  link: "/ja/rules/no-parent-name-construct-id-match",
                },
                {
                  text: "no-unused-props",
                  link: "/ja/rules/no-unused-props",
                },
                {
                  text: "no-variable-construct-id",
                  link: "/ja/rules/no-variable-construct-id",
                },
                {
                  text: "pascal-case-construct-id",
                  link: "/ja/rules/pascal-case-construct-id",
                },
                {
                  text: "prefer-grants-property",
                  link: "/ja/rules/prefer-grants-property",
                },
                {
                  text: "props-name-convention",
                  link: "/ja/rules/props-name-convention",
                },
                {
                  text: "require-jsdoc",
                  link: "/ja/rules/require-jsdoc",
                },
                {
                  text: "require-passing-this",
                  link: "/ja/rules/require-passing-this",
                },
                {
                  text: "require-props-default-doc",
                  link: "/ja/rules/require-props-default-doc",
                },
              ],
            },
          ],
          "/ja/blog/": [
            {
              text: "npm パッケージ名を eslint-plugin-awscdk に変更しました",
              collapsed: true,
              link: "/ja/blog/2025-10-21.renamed-npm-package",
            },
          ],
        },
        socialLinks: [
          {
            icon: {
              svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>`,
            },
            link: "https://github.com/ren-yamanashi/eslint-plugin-awscdk/tree/main",
          },
        ],
      },
    },
  },
  vite: {
    plugins: [
      llmstxt({
        ignoreFiles: ["index.md", "ja/index.md"],
      }),
    ],
  },
});
