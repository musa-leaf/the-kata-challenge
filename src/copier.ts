import { IDestination, ISource } from "./interfaces";
import { BUFFER_SIZE_ERROR, ENDLINE, SOURCE_DESTINATION_ERROR_MSG } from "./utils";

export class Copier {

    constructor(private readonly source: ISource, private readonly destination: IDestination) {
        if (!source || !destination) throw new Error(SOURCE_DESTINATION_ERROR_MSG)
    }

    async copy(): Promise<void> {
        let currentChar = await this.source.readChar();
        while (currentChar !== ENDLINE) {
            await this.destination.writeChar(currentChar);
            currentChar = await this.source.readChar();
        }
    }

    async copyMultiple(bufferSize: number): Promise<void> {
        if (bufferSize <= 0) {
            throw new Error(BUFFER_SIZE_ERROR);
        }

        const buffer = await this.source.readChars(bufferSize);
        const newlineIndex = buffer.indexOf(ENDLINE);

        if (newlineIndex === -1) {
            await this.destination.writeChars(buffer);
        } else {
            const slicedBuffer = buffer.slice(0, newlineIndex)
            await this.destination.writeChars(slicedBuffer);
        }


    }
}