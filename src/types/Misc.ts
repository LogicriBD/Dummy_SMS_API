export type PaginatedList<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type DownloadableFile = {
  fileName: string;
  sizeInBytes: number;
  url: string;
};

export type RemoteFileReference = {
  sizeInBytes?: number;
  originalName: string;
  downloadUrl: string;
  mimeType: string;
};

type Year = 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 | 2031;
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
type Day =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31';

export type CalendarDate = `${Year}-${Month}-${Day}`;
