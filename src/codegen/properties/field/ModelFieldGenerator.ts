import _ from "lodash";
import { PropertyOptions } from "mikro-orm";
import { CodeBuilder } from "@elg/tscodegen";
import { ImportMap } from "../../ImportMap";
import { FieldBasedGenerator } from "./FieldBasedGenerator";

/**
 * Generates code for a field property in a database entity class.
 */
export class ModelFieldGenerator extends FieldBasedGenerator {
  get decoratorName(): "PrimaryKey" | "Property" {
    const { isPrimaryKey } = this.specification;
    return isPrimaryKey ? "PrimaryKey" : "Property";
  }

  generateLines(codeBuilder: CodeBuilder): CodeBuilder {
    const { name, type } = this.specification;
    const propertyOptions: PropertyOptions = _.pick(this.specification, [
      "nullable",
      "unique",
    ]);

    const optionsString = _.isEmpty(propertyOptions)
      ? ""
      : JSON.stringify(propertyOptions);
    const nullUnwrapIndicator = propertyOptions.nullable ? "?" : "!";
    return codeBuilder
      .addLine(`@${this.decoratorName}(${optionsString})`)
      .addLine(`${name}${nullUnwrapIndicator}: ${type};`);
  }

  importsRequired(): ImportMap {
    return { "mikro-orm": [this.decoratorName] };
  }
}