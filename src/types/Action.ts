export interface Action {
  execute: (...paarms: any[]) => Promise<unknown>
}
