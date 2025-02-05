import * as csv from 'fast-csv';
import * as fs from 'fs';
import { ZodType } from 'zod';
import { InvalidExcelRow } from '../../types/Uploader';
import { formatIssueMessage } from '../Validation';

export class CSVFileWriter {
  constructor(private csvFilePath: string) {}

  writeInvalidatedRows<SchemaType extends ZodType>(rows: InvalidExcelRow<SchemaType>[]) {
    return this.writeRows(rows, (item) => ({
      ...item.row,
      Reason: item.issues.map(formatIssueMessage).join('\n'),
    }));
  }

  writeRows(rows: any[], mapper?: (item: any) => any) {
    return new Promise<string | null>(async (resolve, reject) => {
      if (!rows.length) {
        reject(new Error('No rows to write to CSV'));
      }

      const writeStream = fs.createWriteStream(this.csvFilePath);
      const csvStream = csv.format({ headers: true });

      csvStream.pipe(writeStream);

      for (const item of rows) {
        csvStream.write(mapper?.(item) ?? item);
      }

      writeStream.on('finish', () => resolve(this.csvFilePath));

      csvStream
        .on('error', (error) => reject(error))
        .on('end', () => {})
        .end();
    });
  }

  appendRows(rows: any[], mapper?: (item: any) => any) {
    return new Promise<string | null>(async (resolve, reject) => {
      if (!rows.length) {
        reject(new Error('No rows to append to CSV'));
        return;
      }

      const writeStream = fs.createWriteStream(this.csvFilePath, { flags: 'a' });
      const csvStream = csv.format({ headers: false });

      csvStream.pipe(writeStream);

      for (const item of rows) {
        csvStream.write(mapper?.(item) ?? item);
      }

      writeStream.on('finish', () => resolve(this.csvFilePath));

      csvStream
        .on('error', (error) => reject(error))
        .on('end', () => {})
        .end();
    });
  }
}
