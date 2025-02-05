import * as csv from 'fast-csv';
import * as fs from 'fs';
import _ from 'lodash';
import { ZodType } from 'zod';
import { CSVFileContent, ExcelRow } from '../../types/Uploader';
import { getExcelRowValidationResult, getKeysOfSchema } from '../Validation';

export class CSVFileReader<SchemaType extends ZodType> {
  constructor(
    private csvFilePath: string,
    private schema: SchemaType,
  ) {}

  validateColumnNames(actualColumns: string[]) {
    const mismatchedColumns = _.difference(getKeysOfSchema(this.schema), actualColumns);
    if (mismatchedColumns.length) {
      throw new Error('Following columns are not found in the file: ' + mismatchedColumns.join(', '));
    }

    return true;
  }

  getFileContent() {
    const content: CSVFileContent<SchemaType> = {
      rowCount: 0,
      validItems: [],
      invalidItems: [],
    };

    if (!fs.existsSync(this.csvFilePath)) {
      throw new Error(`CSV file does not exists at:: ${this.csvFilePath}`);
    }

    return new Promise<CSVFileContent<SchemaType>>((resolve, reject) => {
      fs.createReadStream(this.csvFilePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => reject(error))
        .on('headers', (columns: string[]) => {
          try {
            this.validateColumnNames(columns);
          } catch (error) {
            reject(error);
          }
        })
        .on('data', (row: ExcelRow<SchemaType>) => {
          const validationResult = getExcelRowValidationResult(this.schema, row);
          if (validationResult.success === false) {
            content.invalidItems.push(validationResult.data);
          } else {
            content.validItems.push(validationResult.data);
          }
        })
        .on('end', (count: number) => {
          content.rowCount = count;
          resolve(content);
        });
    });
  }
}
