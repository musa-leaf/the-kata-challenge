
import { ISource } from './../interfaces/source';
import { IDestination } from './../interfaces/destination';
import { Copier } from './../copier';
import { BUFFER_SIZE_ERROR, SOURCE_DESTINATION_ERROR_MSG } from '../utils';


describe('Copier', () => {

    let source: jest.Mocked<ISource>;
    let destination: jest.Mocked<IDestination>;
    let copier: Copier;

    beforeEach(() => {
        source = {
            readChar: jest.fn(),
            readChars: jest.fn(),
        };
        destination = {
            writeChar: jest.fn(),
            writeChars: jest.fn(),
        };
        copier = new Copier(source, destination);
    });

    describe('copy', () => {
        it('should copy characters until newline is encountered', async () => {

            source.readChar.mockResolvedValueOnce('T');
            source.readChar.mockResolvedValueOnce('e');
            source.readChar.mockResolvedValueOnce('s');
            source.readChar.mockResolvedValueOnce('t');
            source.readChar.mockResolvedValueOnce('\n');

            await copier.copy();

            expect(destination.writeChar).toHaveBeenCalledTimes(4);
            expect(destination.writeChar).toHaveBeenNthCalledWith(1, 'T');
            expect(destination.writeChar).toHaveBeenNthCalledWith(2, 'e');
            expect(destination.writeChar).toHaveBeenNthCalledWith(3, 's');
            expect(destination.writeChar).toHaveBeenNthCalledWith(4, 't');
            expect(destination.writeChar).not.toHaveBeenCalledWith('\n');
        });

        it('should handle empty input', async () => {
            source.readChar.mockResolvedValue('\n');

            await copier.copy();

            expect(destination.writeChar).not.toHaveBeenCalled();
        });
    });

    describe('copyMultiple', () => {
        it('should copy multiple characters at once', async () => {
            const input = ['T', 'e', 's', 't', 'i', 'n', 'g'];
            source.readChars.mockResolvedValue(input);

            await copier.copyMultiple(6);

            expect(destination.writeChars).toHaveBeenCalledWith(input);
        });

        it('should stop at newline when copying multiple characters', async () => {

            const input = ['T', 'e', 's', '\n', 't'];
            source.readChars.mockResolvedValue(input);

            await copier.copyMultiple(5);

            expect(destination.writeChars).toHaveBeenCalledWith(['T', 'e', 's']);
        });

        it('should throw error for invalid buffer size', async () => {
            await expect(copier.copyMultiple(0)).rejects.toThrow(BUFFER_SIZE_ERROR);
            await expect(copier.copyMultiple(-1)).rejects.toThrow(BUFFER_SIZE_ERROR);
        });
    });

    describe('constructor', () => {
        it('should throw error for null source', () => {
            expect(() => new Copier(null!, destination)).toThrow(SOURCE_DESTINATION_ERROR_MSG);
        });

        it('should throw error for null destination', () => {
            expect(() => new Copier(source, null!)).toThrow(SOURCE_DESTINATION_ERROR_MSG);
        });
    });

})