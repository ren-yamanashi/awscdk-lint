---
title: eslint-plugin-awscdk - Rules
titleTemplate: ":title"
---

<script setup>
import RuleItem from '../components/RuleItem.vue'
</script>

<style>
.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.legend {
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  padding: 12px;
  background-color: var(--vp-c-bg);
  border-radius: 4px;
}

.legend-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-text {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}
</style>

# Rules

## Rules Reference

<div class="legend">
  <div class="legend-item">
    <div class="legend-icon">
      <span class="status-icon recommended">✅</span>
    </div>
    <span class="legend-text">Rules enabled when using the <a href="/rules/#recommended-rules">recommended</a> configuration.</span>
  </div>
  <div class="legend-item">
    <div class="legend-icon">
      <span class="status-icon fixable">🔧</span>
    </div>
    <span class="legend-text">
      Rules that can be automatically fixed using the
      <a href="https://eslint.org/docs/latest/use/command-line-interface#--fix">--fix</a>
      option.
    </span>
  </div>
</div>

We currently support the following rules:

<ul class="rule-list">
  <RuleItem
    name="construct-constructor-property"
    description="Enforces that constructors of CDK Constructs have parameter names 'scope, id' or 'scope, id, props'."
    link="/rules/construct-constructor-property"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-in-interface"
    description="Disallows specifying CDK Construct types (e.g., Bucket) for interface properties."
    link="/rules/no-construct-in-interface"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-in-public-property-of-construct"
    description="Disallows specifying Construct types (e.g., Bucket) for public properties of CDK Constructs."
    link="/rules/no-construct-in-public-property-of-construct"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-construct-stack-suffix"
    description="Disallows 'Construct' or 'Stack' strings in Construct and Stack IDs."
    link="/rules/no-construct-stack-suffix"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-import-private"
    description="Disallows importing modules from private directories at different hierarchy levels."
    link="/rules/no-import-private"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="no-mutable-property-of-props-interface"
    description="Enforces that properties of Props (interface) are specified with readonly."
    link="/rules/no-mutable-property-of-props-interface"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="no-mutable-public-property-of-construct"
    description="Enforces that public properties of Constructs are specified with readonly."
    link="/rules/no-mutable-public-property-of-construct"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="no-parent-name-construct-id-match"
    description="Disallows specifying the parent class name in Construct IDs."
    link="/rules/no-parent-name-construct-id-match"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-unused-props"
    description="Enforces that all properties defined in Construct Props (interface) are used within the constructor."
    link="/rules/no-unused-props"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="no-variable-construct-id"
    description="Disallows using variables for Construct IDs."
    link="/rules/no-variable-construct-id"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="pascal-case-construct-id"
    description="Enforces PascalCase for Construct IDs."
    link="/rules/pascal-case-construct-id"
    :isRecommended="true"
    :isFixable="true"
  />
<RuleItem
    name="prefer-grants-property"
    description="Enforces using the grants property instead of grant* methods."
    link="/rules/prefer-grants-property"
    :isRecommended="true"
    :isFixable="false"
  />
  <RuleItem
    name="props-name-convention"
    description="Enforces that Props (interface) names follow the ${ConstructName}Props format."
    link="/rules/props-name-convention"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="require-jsdoc"
    description="Requires JSDoc comments for properties of Props(interface) and public properties of Constructs."
    link="/rules/require-jsdoc"
    :isRecommended="false"
    :isFixable="false"
  />
  <RuleItem
    name="require-passing-this"
    description="Enforces passing 'this' to the constructor of Constructs."
    link="/rules/require-passing-this"
    :isRecommended="true"
    :isFixable="true"
  />
  <RuleItem
    name="require-props-default-doc"
    description="Requires '@default' JSDoc for optional properties of Props (interface)."
    link="/rules/require-props-default-doc"
    :isRecommended="false"
    :isFixable="false"
  />
</ul>

## Recommended Rules

The `recommended` rules are suggested for maintaining correct code.  
To use these rules, configure as follows:

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-plugin-awscdk";

export default defineConfig([
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      // ✅ Add plugins
      cdkPlugin.configs.recommended,
    ],
    // ... some configs
  },
]);
```

## Strict Rules

The `strict` rules provide all available rules.
To use these rules, configure as follows:

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-plugin-awscdk";

export default defineConfig([
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      // ✅ Add plugins
      cdkPlugin.configs.strict,
    ],
    // ... some configs
  },
]);
```
