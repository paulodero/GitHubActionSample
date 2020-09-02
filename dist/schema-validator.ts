import Ajv, { ValidateFunction } from 'ajv';
import betterAjvErrors from 'better-ajv-errors';
import { InvalidSchemaError, InvalidJsonError } from './errors';

class SchemaValidator {
    private schemaValidator: Ajv.Ajv;

    constructor() {
        this.schemaValidator = new Ajv({ allErrors: true, jsonPointers: true, loadSchema: this.loadSchema });
    }

    public instance(): Ajv.Ajv {
        return this.schemaValidator;
    }

    public async prepareSchema(schema: object): Promise<ValidateFunction> {
        const isSchemaValid = this.schemaValidator.validateSchema(schema);
        if (!isSchemaValid) {
            const errors = this.schemaValidator.errorsText(this.schemaValidator.errors);
            throw new InvalidSchemaError(errors);
        }

        return await this.schemaValidator.compileAsync(schema);
    }

    public async validate(data: object, validator: ValidateFunction): Promise<boolean> {
        const valid = await validator(data);

        if (!valid) {
            const errors = this.schemaValidator.errorsText(validator.errors);
            const output = betterAjvErrors(validator.schema, data, validator.errors, { format: 'cli', indent: 4 });
            throw new InvalidJsonError(errors, (output || {}) as string);
        }

        return valid;
    }

    private async loadSchema() {
        return Promise.resolve(true);
    }
}

export const schemaValidator = new SchemaValidator();