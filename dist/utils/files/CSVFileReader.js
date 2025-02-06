"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVFileReader = void 0;
const csv = __importStar(require("fast-csv"));
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const Validation_1 = require("../Validation");
class CSVFileReader {
    constructor(csvFilePath, schema) {
        this.csvFilePath = csvFilePath;
        this.schema = schema;
    }
    validateColumnNames(actualColumns) {
        const mismatchedColumns = lodash_1.default.difference((0, Validation_1.getKeysOfSchema)(this.schema), actualColumns);
        if (mismatchedColumns.length) {
            throw new Error('Following columns are not found in the file: ' + mismatchedColumns.join(', '));
        }
        return true;
    }
    getFileContent() {
        const content = {
            rowCount: 0,
            validItems: [],
            invalidItems: [],
        };
        if (!fs.existsSync(this.csvFilePath)) {
            throw new Error(`CSV file does not exists at:: ${this.csvFilePath}`);
        }
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.csvFilePath)
                .pipe(csv.parse({ headers: true }))
                .on('error', (error) => reject(error))
                .on('headers', (columns) => {
                try {
                    this.validateColumnNames(columns);
                }
                catch (error) {
                    reject(error);
                }
            })
                .on('data', (row) => {
                const validationResult = (0, Validation_1.getExcelRowValidationResult)(this.schema, row);
                if (validationResult.success === false) {
                    content.invalidItems.push(validationResult.data);
                }
                else {
                    content.validItems.push(validationResult.data);
                }
            })
                .on('end', (count) => {
                content.rowCount = count;
                resolve(content);
            });
        });
    }
}
exports.CSVFileReader = CSVFileReader;
//# sourceMappingURL=CSVFileReader.js.map