import { isClassDeclaration, isConstructorDeclaration, Type } from "typescript";


/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 */
export const findConstructorPropertyNames = (type: Type): string[] => {
  const declarations = type.symbol?.declarations;
  if (!declarations?.length) return [];

  const classDeclaration = declarations[0];
  if (!isClassDeclaration(classDeclaration)) return [];

  const constructor = classDeclaration.members.find((member) =>
    isConstructorDeclaration(member)
  );
  if (!constructor?.parameters.length) return [];

  return constructor.parameters.map((param) => param.name.getText());
};
