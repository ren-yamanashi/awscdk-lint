import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { Type } from "typescript";

import { findPropertyNames } from "../../core/ast-node/finder/property-name";

export interface IPropsUsageTracker {
  /**
   * Marks a property as used when it is accessed in a member expression.
   *
   * @param node The member expression node.
   * @param propsParamName The name of the property being tracked.
   */
  markAsUsedForMemberExpression(node: TSESTree.MemberExpression, propsParamName: string): void;

  /**
   * Marks a property as used when it is accessed in a member expression.
   *
   * @param node The member expression node.
   * @param propsParamName The name of the property being tracked.
   */
  markAsUsedForVariableDeclarator(node: TSESTree.VariableDeclarator, propsParamName: string): void;

  /**
   * Marks a property as used when it is assigned in an expression.
   *
   * @param node The assignment expression node.
   * @param propsParamName The name of the property being tracked.
   */
  markAsUsedForAssignmentExpression(
    node: TSESTree.AssignmentExpression,
    propsParamName: string,
  ): void;

  /**
   * Marks a property as used by its name.
   *
   * @param propertyName The name of the property to mark as used.
   */
  markAsUsed(propertyName: string): void;

  /**
   * Marks all properties as used.
   * This is useful when props object is used as a whole (e.g., console.log(props)).
   */
  markAllAsUsed(): void;

  /**
   * Returns an array of unused property names.
   *
   * @returns An array of unused property names.
   */
  getUnusedProperties(): string[];
}

export class PropsUsageTracker implements IPropsUsageTracker {
  private propUsageMap: Map<string, boolean>;

  constructor(propType: Type) {
    this.propUsageMap = new Map<string, boolean>(
      this.getPropsPropertyNames(propType).map((name) => [name, false]),
    );
  }

  public getUnusedProperties(): string[] {
    return Array.from(this.propUsageMap.entries()).reduce<string[]>(
      (acc, [name, used]) => (!used ? [...acc, name] : acc),
      [],
    );
  }

  public markAsUsed(propertyName: string): void {
    if (this.propUsageMap.has(propertyName)) {
      this.propUsageMap.set(propertyName, true);
    }
  }

  public markAllAsUsed(): void {
    for (const key of this.propUsageMap.keys()) {
      this.propUsageMap.set(key, true);
    }
  }

  public markAsUsedForMemberExpression(
    node: TSESTree.MemberExpression,
    propsParamName: string,
  ): void {
    // NOTE: props.x / props?.x / props["x"] / props[<other>]
    if (node.object.type === AST_NODE_TYPES.Identifier && node.object.name === propsParamName) {
      this.markPropertyFromAccess(node);
      return;
    }

    // NOTE: this.props.x / this.props?.x / this.props["x"] (parameter-property style bindings)
    if (
      node.object.type === AST_NODE_TYPES.MemberExpression &&
      node.object.object.type === AST_NODE_TYPES.ThisExpression &&
      node.object.property.type === AST_NODE_TYPES.Identifier &&
      node.object.property.name === propsParamName
    ) {
      this.markPropertyFromAccess(node);
      return;
    }
  }

  public markAsUsedForVariableDeclarator(
    node: TSESTree.VariableDeclarator,
    propsParamName: string,
  ): void {
    if (
      node.id.type !== AST_NODE_TYPES.ObjectPattern ||
      node.init?.type !== AST_NODE_TYPES.Identifier ||
      node.init.name !== propsParamName
    ) {
      return;
    }

    for (const name of findPropertyNames(node.id.properties)) {
      this.markAsUsed(name);
    }
    // NOTE: `const { a, ...rest } = props` — the rest binding captures the remaining
    // properties opaquely, so treat them all as used
    if (node.id.properties.some((p) => p.type === AST_NODE_TYPES.RestElement)) {
      this.markAllAsUsed();
    }
  }

  public markAsUsedForAssignmentExpression(
    node: TSESTree.AssignmentExpression,
    propsParamName: string,
  ): void {
    // NOTE: Check for this.property = props.property pattern
    if (
      node.right.type !== AST_NODE_TYPES.MemberExpression ||
      node.right.object.type !== AST_NODE_TYPES.Identifier ||
      node.right.object.name !== propsParamName ||
      node.right.property.type !== AST_NODE_TYPES.Identifier
    ) {
      return;
    }

    this.markAsUsed(node.right.property.name);
  }

  /**
   * Marks the property targeted by the given member expression's `property` node. Falls back to
   * marking all properties when the access is computed with a non-string-literal key.
   */
  private markPropertyFromAccess(node: TSESTree.MemberExpression): void {
    const property = node.property;
    if (!node.computed && property.type === AST_NODE_TYPES.Identifier) {
      this.markAsUsed(property.name);
      return;
    }
    if (
      node.computed &&
      property.type === AST_NODE_TYPES.Literal &&
      typeof property.value === "string"
    ) {
      this.markAsUsed(property.value);
      return;
    }
    // NOTE: props[variable] / props[expr] — key is opaque, so all properties are treated as used
    this.markAllAsUsed();
  }

  /**
   * Gets the property names from the props type
   */
  private getPropsPropertyNames(propsType: Type): string[] {
    const isInternalProperty = (propertyName: string): boolean =>
      propertyName.startsWith("_") ||
      propertyName === "constructor" ||
      propertyName === "prototype";

    const typeProperties = propsType.getProperties();
    if (typeProperties.length) {
      return typeProperties.reduce<string[]>(
        (acc, prop) => (!isInternalProperty(prop.name) ? [...acc, prop.name] : acc),
        [],
      );
    }

    const symbol = propsType.getSymbol();
    if (!symbol?.members) return [];

    return Array.from(symbol.members.keys()).reduce<string[]>((acc, key) => {
      const name = String(key);
      return !isInternalProperty(name) ? [...acc, name] : acc;
    }, []);
  }
}
