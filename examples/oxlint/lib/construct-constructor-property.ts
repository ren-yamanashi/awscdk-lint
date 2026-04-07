/* eslint-disable awscdk/require-jsdoc */
import { Construct } from "constructs";

// ✅ Constructor with "scope, id" property names
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

export interface _MyConstructProps {
  readonly bucketName: string;
}

// ✅ Constructor with "scope, id, props" property names
export class _MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: _MyConstructProps, resourceName: string) {
    super(scope, id);
    console.log(props.bucketName);
    console.log(resourceName);
  }
}

// ❌ First parameter is not named "scope"
export class __MyConstruct extends Construct {
  constructor(myScope: Construct, id: string) {
    super(myScope, id);
  }
}

// ❌ Second parameter is not named "id"
export class ___MyConstruct extends Construct {
  constructor(scope: Construct, myId: string) {
    super(scope, myId);
  }
}

// ❌ Third parameter is not named "props"
export class ____MyConstruct extends Construct {
  constructor(scope: Construct, id: string, myProps: _MyConstructProps) {
    super(scope, id);
    console.log(myProps);
  }
}

// ❌ First parameter type is not "Construct"
export class _____MyConstruct extends Construct {
  constructor(scope: unknown, id: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(scope, id);
  }
}

// ❌ Second parameter type is not "string"
export class ______MyConstruct extends Construct {
  constructor(scope: Construct, id: number) {
    super(scope, id.toString());
  }
}
