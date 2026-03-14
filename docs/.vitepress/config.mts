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
                  text: "prevent-construct-id-collision",
                  link: "/rules/prevent-construct-id-collision",
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
                  text: "prevent-construct-id-collision",
                  link: "/ja/rules/prevent-construct-id-collision",
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
