import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { IPropsUsageTracker } from "./props-usage-tracker";
import {
  DirectPropsUsageVisitor,
  InstanceVariableUsageVisitor,
  MethodCallCollectorVisitor,
  PropsAliasVisitor,
  traverseNodes,
} from "./visitor";

export interface IPropsUsageAnalyzer {
  analyze(
    constructor: TSESTree.MethodDefinition,
    propsParam: TSESTree.Identifier
  ): void;
}

export class PropsUsageAnalyzer implements IPropsUsageAnalyzer {
  constructor(private readonly tracker: IPropsUsageTracker) {}

  analyze(
    constructor: TSESTree.MethodDefinition,
    propsParam: TSESTree.Identifier
  ): void {
    const constructorBody = constructor.value.body;
    const classNode = constructor.parent;
    const propsParamName = propsParam.name;
    if (!constructorBody) return;

    this.checkUsageForDirectAccess(constructorBody, propsParamName);
    this.checkUsageForAliasAccess(constructorBody, propsParamName);
    this.checkUsageForInstanceVariable(classNode, constructor, propsParamName);
    this.checkUsageForPrivateMethodsCalledFromConstructor(
      constructorBody,
      classNode,
      propsParamName
    );
  }

  /**
   * Analyzes direct access to props within the constructor body.
   *
   * @example
   * ```typescript
   * constructor(scope: Construct, id: string, props: MyConstructProps) {
   *   super(scope, id);
   *   console.log(props.bucketName);  // <- Direct access tracked here
   * }
   * ```
   *
   * @param constructorBody - The constructor's BlockStatement to analyze
   * @param propsParamName - The name of the props parameter (e.g., "props")
   */
  private checkUsageForDirectAccess(
    constructorBody: TSESTree.BlockStatement,
    propsParamName: string
  ): void {
    const directVisitor = new DirectPropsUsageVisitor(
      this.tracker,
      propsParamName
    );
    traverseNodes(constructorBody, directVisitor);
  }

  /**
   * Analyzes props usage via aliases within the constructor body.
   *
   * When props is assigned to another variable (alias), this method tracks
   * usage of that alias throughout the constructor.
   *
   * @example
   * ```typescript
   * constructor(scope: Construct, id: string, props: MyConstructProps) {
   *   super(scope, id);
   *   const p = props;  // <- Alias assignment detected
   *   console.log(p.bucketName);  // <- Usage tracked here
   * }
   * ```
   *
   * @param constructorBody - The constructor's BlockStatement to analyze
   * @param propsParamName - The name of the props parameter (e.g., "props")
   */
  private checkUsageForAliasAccess(
    constructorBody: TSESTree.BlockStatement,
    propsParamName: string
  ): void {
    const aliasVisitor = new PropsAliasVisitor(this.tracker, propsParamName);
    traverseNodes(constructorBody, aliasVisitor);
  }

  /**
   * Analyzes the class body for props usage via instance variables.
   *
   * When props is assigned to an instance variable (e.g., `this.myProps = props`),
   * this method tracks usage of that instance variable throughout the entire class.
   *
   * @example
   * ```typescript
   * class MyConstruct extends Construct {
   *   private myProps: MyConstructProps;
   *
   *   constructor(scope: Construct, id: string, props: MyConstructProps) {
   *     super(scope, id);
   *     this.myProps = props;  // <- Instance variable assignment detected
   *   }
   *
   *   someMethod() {
   *     console.log(this.myProps.bucketName);  // <- Usage tracked here
   *   }
   * }
   * ```
   *
   * @param classBody - The ClassBody node to analyze
   * @param constructor - The constructor MethodDefinition node
   * @param propsParamName - The name of the props parameter (e.g., "props")
   */
  private checkUsageForInstanceVariable(
    classBody: TSESTree.ClassBody,
    constructor: TSESTree.MethodDefinition,
    propsParamName: string
  ) {
    if (!constructor.value.body) return;
    const instanceVarName = this.findPropsInstanceVariable(
      constructor.value.body,
      propsParamName
    );
    if (!instanceVarName) return;

    const instanceVisitor = new InstanceVariableUsageVisitor(
      this.tracker,
      instanceVarName
    );
    traverseNodes(classBody, instanceVisitor);
  }

  /**
   * Analyzes private methods that are called from the constructor with props as an argument.
   *
   * When a constructor calls a private method and passes props to it, this method
   * finds the method definition and analyzes the props usage within that method.
   *
   * @example
   * ```typescript
   * class MyConstruct extends Construct {
   *   constructor(scope: Construct, id: string, props: MyConstructProps) {
   *     super(scope, id);
   *     this.setupBucket(props);  // <- Method call with props detected
   *   }
   *
   *   private setupBucket(p: MyConstructProps) {
   *     // Props usage in this method body is analyzed
   *     new Bucket(this, 'Bucket', { bucketName: p.bucketName });
   *   }
   * }
   * ```
   *
   * @param constructorBody - The constructor's BlockStatement to search for method calls
   * @param classBody - The ClassBody containing method definitions
   * @param propsParamName - The name of the props parameter (e.g., "props")
   */
  private checkUsageForPrivateMethodsCalledFromConstructor(
    constructorBody: TSESTree.BlockStatement,
    classBody: TSESTree.ClassBody,
    propsParamName: string
  ): void {
    // NOTE: Collect method calls in constructor
    const methodCallsWithProps = this.collectMethodCallsWithProps(
      constructorBody,
      propsParamName
    );

    // NOTE: For each method call, find the method definition and analyze it
    for (const { methodName, propsArgIndices } of methodCallsWithProps) {
      const methodDef = this.findMethodDefinition(classBody, methodName);
      if (!methodDef?.value.body) continue;

      // NOTE: Get the actual parameter names from the method definition
      for (const argIndex of propsArgIndices) {
        const param = methodDef.value.params[argIndex];
        if (param && param.type === AST_NODE_TYPES.Identifier) {
          const visitor = new DirectPropsUsageVisitor(this.tracker, param.name);
          traverseNodes(methodDef.value.body, visitor);
        }
      }
    }
  }

  /**
   * Collects method calls in the constructor body where props is passed as an argument.
   *
   * Uses `MethodCallCollectorVisitor` to traverse the constructor body and find
   * all `this.methodName(props)` patterns.
   *
   * @example
   * ```typescript
   * constructor(scope: Construct, id: string, props: MyConstructProps) {
   *   super(scope, id);
   *   this.setupBucket(props);        // <- Collected: { methodName: "setupBucket", propsArgIndices: [0] }
   *   this.configure(config, props);  // <- Collected: { methodName: "configure", propsArgIndices: [1] }
   * }
   * ```
   *
   * @param body - The constructor's BlockStatement to traverse
   * @param propsParamName - The name of the props parameter (e.g., "props")
   * @returns Array of method call info with method names and argument indices where props appears
   */
  private collectMethodCallsWithProps(
    body: TSESTree.BlockStatement,
    propsParamName: string
  ): { methodName: string; propsArgIndices: number[] }[] {
    const visitor = new MethodCallCollectorVisitor(propsParamName);
    traverseNodes(body, visitor);
    return visitor.result;
  }

  /**
   * Finds the instance variable name where props is assigned in the constructor.
   *
   * This method detects the pattern where props is stored in an instance variable
   * for later access within the class.
   *
   * @example
   * ```typescript
   * class MyConstruct extends Construct {
   *   private myProps: MyConstructProps;
   *
   *   constructor(scope: Construct, id: string, props: MyConstructProps) {
   *     super(scope, id);
   *     this.myProps = props;  // <- This pattern is detected
   *   }
   * }
   * ```
   *
   * AST structure for `this.myProps = props`:
   *   ExpressionStatement
   *   └── expression: AssignmentExpression
   *       ├── left: MemberExpression
   *       │   ├── object: ThisExpression
   *       │   └── property: Identifier (name: "myProps" - returned value)
   *       └── right: Identifier (name: "props" === propsParamName)
   *
   * @param body - The constructor's BlockStatement to analyze
   * @param propsParamName - The name of the props parameter (e.g., "props")
   * @returns The instance variable name (e.g., "myProps") or null if not found
   */
  private findPropsInstanceVariable(
    body: TSESTree.BlockStatement,
    propsParamName: string
  ): string | null {
    for (const statement of body.body) {
      if (
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        statement.expression.type === AST_NODE_TYPES.AssignmentExpression &&
        statement.expression.left.type === AST_NODE_TYPES.MemberExpression &&
        statement.expression.left.object.type ===
          AST_NODE_TYPES.ThisExpression &&
        statement.expression.left.property.type === AST_NODE_TYPES.Identifier &&
        statement.expression.right.type === AST_NODE_TYPES.Identifier &&
        statement.expression.right.name === propsParamName
      ) {
        return statement.expression.left.property.name;
      }
    }
    return null;
  }

  /**
   * Finds a method definition in the class body by its name.
   *
   * This method is used to locate the actual method implementation when
   * a method call like `this.someMethod(props)` is found in the constructor.
   *
   * @example
   * ```typescript
   * class MyConstruct extends Construct {
   *   constructor(scope: Construct, id: string, props: MyConstructProps) {
   *     super(scope, id);
   *     this.setupBucket(props);  // <- Method call detected
   *   }
   *
   *   private setupBucket(p: MyConstructProps) {  // <- This definition is found
   *     new Bucket(this, 'Bucket', { bucketName: p.bucketName });
   *   }
   * }
   * ```
   *
   * AST structure for method definition:
   *   MethodDefinition
   *   ├── key: Identifier (name: "setupBucket" === methodName)
   *   └── value: FunctionExpression
   *       ├── params: [Identifier, ...]
   *       └── body: BlockStatement
   *
   * @param classBody - The ClassBody node containing all class members
   * @param methodName - The name of the method to find (e.g., "setupBucket")
   * @returns The MethodDefinition node or null if not found
   */
  private findMethodDefinition(
    classBody: TSESTree.ClassBody,
    methodName: string
  ): TSESTree.MethodDefinition | null {
    for (const member of classBody.body) {
      if (
        member.type === AST_NODE_TYPES.MethodDefinition &&
        member.key.type === AST_NODE_TYPES.Identifier &&
        member.key.name === methodName
      ) {
        return member;
      }
    }
    return null;
  }
}
