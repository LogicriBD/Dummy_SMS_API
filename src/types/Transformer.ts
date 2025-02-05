import { ValueTransformer } from 'typeorm';
import { ZodType } from 'zod';
import { ValidExcelRow } from './Uploader';

export interface ExcelTransformer<SchemaType extends ZodType, FinalOutputType> {
  transform: (item: ValidExcelRow<SchemaType>) => FinalOutputType;
}

export interface SimpleTransformer<InputType = any, FinalOutputType = any> {
  transform: (item: InputType) => FinalOutputType;
}

/** 
 * @description This function is used to create a transformer for a specific schema.
 * @param customInputTransformation - A function that takes a value of type T, which is any specified type and returns a value of any type.
 * @param customOutputTransformation - A function that takes a value of any type and returns a value of type T of any specified type after the operation is performed.
 * @returns A ValueTransformer object used to transform the value to the necessary type upon insertion and fetching
 * @example toNullableTransformer<string>() // to essentially transform a value of type string|undefined to string|null for nullable columns
 * @example ToNullableTransformer<string[]>(
      (value: string[]) => value.join('|'),
      (value: string) => value.split('|'),
    ) // to essentially transform a value of type string[]|undefined to type string|null for a column which is both nullable and should contain text but the text is to be transformed to string[] when fetching
 * 
 * 
 **/
export const ToNullableTransformer = <T>(
  customInputTransformation?: (value: T) => any,
  customOutputTransformation?: (value: any) => T,
): ValueTransformer => {
  return {
    to: (value: T | undefined): T | null => {
      if (value) {
        if (customInputTransformation) {
          return customInputTransformation(value);
        }
        return value;
      }
      return null;
    },
    from: (value: T | null): T | undefined => {
      if (value) {
        if (customOutputTransformation) {
          return customOutputTransformation(value);
        }
        return value;
      }
      return;
    },
  };
};
