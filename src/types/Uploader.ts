import { ZodIssue, ZodType, z } from 'zod'

export type SchemaColumn<SchemaType extends ZodType> = keyof z.infer<SchemaType>
export type ExcelRow<SchemaType extends ZodType> = Record<SchemaColumn<SchemaType>, string>
export type ValidExcelRow<SchemaType extends ZodType> = z.infer<SchemaType>
export type InvalidExcelRow<SchemaType extends ZodType> = { row: ExcelRow<SchemaType>; issues: ZodIssue[] }

export type RowValidationResult<SchemaType extends ZodType> =
  | { success: false; data: InvalidExcelRow<SchemaType> }
  | { success: true; data: ValidExcelRow<SchemaType> }

export type CSVFileContent<SchemaType extends ZodType> = {
  validItems: ValidExcelRow<SchemaType>[]
  invalidItems: InvalidExcelRow<SchemaType>[]
  rowCount: number
}

export type ImportActionResult = {
  insertCount: number
  failedCount: number
  failedItemsFileUrl?: string
}
