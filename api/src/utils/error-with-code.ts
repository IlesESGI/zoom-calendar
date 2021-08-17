export interface ErrorWithCode extends Error {
    code: number
    name: string
}
