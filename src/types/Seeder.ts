export interface Seeder {
  seed: (...args: any[]) => Promise<unknown>
  undo: (...args: any[]) => Promise<unknown>
}
