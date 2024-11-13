export interface ISource {
    readChar(): Promise<string>;
    readChars(count: number): Promise<string[]>;
}