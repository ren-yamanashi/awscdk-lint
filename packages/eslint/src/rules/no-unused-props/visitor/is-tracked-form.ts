import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Returns true when the given identifier does NOT need to be marked as a whole-object escape,
 * either because it is not a value reference at all (e.g. a property key like `this.props`)
 * or because it appears in a form whose per-property usage is tracked precisely elsewhere in
 * the analyzer.
 *
 * Any other position is a whole-object escape and should mark all properties as used.
 */
export const isTrackedFormForBareIdentifier = (node: TSESTree.Identifier): boolean => {
  const parent = node.parent;
  if (!parent) return true;

  // NOTE: non-reference positions — the identifier is a name label, not a variable read
  if (isNonReferencePosition(node, parent)) return true;

  switch (parent.type) {
    // NOTE: `props.x` / `props?.x` / `props["x"]` — per-property tracked
    case AST_NODE_TYPES.MemberExpression: {
      return parent.object === node;
    }
    // NOTE: `const x = props` / `const { x } = props` — alias/destructuring tracked
    case AST_NODE_TYPES.VariableDeclarator: {
      return parent.init === node;
    }
    // NOTE: `this.x = props` / `this.#x = props` — instance-variable tracked
    case AST_NODE_TYPES.AssignmentExpression: {
      return parent.right === node && isThisMemberLeft(parent.left);
    }
    // NOTE: `this.method(props)` — transitive method-body tracked
    case AST_NODE_TYPES.CallExpression: {
      return isThisMethodCall(parent) && parent.arguments.includes(node);
    }
    default: {
      return false;
    }
  }
};

/**
 * Narrower tracked-form check for alias identifiers (variables bound via `const a = props`).
 *
 * Aliases are only tracked when they appear as a member-access object (`a.x`) or as the RHS of
 * a destructuring declaration (`const { x } = a`). Every other position — including plain
 * `const b = a`, `this.x = a`, `this.m(a)` — is treated as a whole-object escape because there
 * is no alias-of-alias, instance-variable, or method-call tracking for aliased references.
 */
export const isTrackedFormForAliasIdentifier = (node: TSESTree.Identifier): boolean => {
  const parent = node.parent;
  if (!parent) return true;

  if (isNonReferencePosition(node, parent)) return true;

  switch (parent.type) {
    case AST_NODE_TYPES.MemberExpression: {
      return parent.object === node;
    }
    case AST_NODE_TYPES.VariableDeclarator: {
      // NOTE: destructuring `const { x } = alias` is tracked; plain `const b = alias` is not.
      return parent.init === node && parent.id.type === AST_NODE_TYPES.ObjectPattern;
    }
    default: {
      return false;
    }
  }
};

const isNonReferencePosition = (node: TSESTree.Identifier, parent: TSESTree.Node): boolean => {
  switch (parent.type) {
    case AST_NODE_TYPES.MemberExpression: {
      // NOTE: `x.props` — `props` is a property name, not a variable read
      return !parent.computed && parent.property === node;
    }
    case AST_NODE_TYPES.Property: {
      // NOTE: `{ props: value }` — non-shorthand key is a name label
      return !parent.computed && !parent.shorthand && parent.key === node;
    }
    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.PropertyDefinition:
    case AST_NODE_TYPES.TSPropertySignature:
    case AST_NODE_TYPES.TSMethodSignature: {
      return !parent.computed && parent.key === node;
    }
    default: {
      return false;
    }
  }
};

const isThisMemberLeft = (left: TSESTree.Node): boolean => {
  if (left.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (left.object.type !== AST_NODE_TYPES.ThisExpression) return false;
  return (
    left.property.type === AST_NODE_TYPES.Identifier ||
    left.property.type === AST_NODE_TYPES.PrivateIdentifier
  );
};

const isThisMethodCall = (call: TSESTree.CallExpression): boolean => {
  const callee = call.callee;
  // NOTE: computed calls (`this["m"](props)`) are not collected by MethodCallCollectorVisitor,
  // so they must fall through to the whole-object escape path.
  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.object.type === AST_NODE_TYPES.ThisExpression &&
    callee.property.type === AST_NODE_TYPES.Identifier
  );
};
