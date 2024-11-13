export interface IDestination {
    writeChar(char: string): Promise<void>;
    writeChars(chars: string[]): Promise<void>;
}
