import { randomUUID } from 'crypto'

export const randomUsername = () => randomUUID().split('-').pop()!
