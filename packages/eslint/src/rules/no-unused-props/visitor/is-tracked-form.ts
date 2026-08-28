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
  return (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.object.type === AST_NODE_TYPES.ThisExpression
  );
};
