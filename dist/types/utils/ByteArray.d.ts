/// <reference types="node" />
export default class ByteArray {
    DEFAULT_SIZE: number;
    start_size: number;
    writePosition: number;
    readPosition: number;
    endian: boolean;
    buffer: Buffer;
    constructor(buffer: ByteArray | Buffer | number);
    get bytesAvailable(): number;
    get length(): number;
    clear(): void;
    reset(): void;
    canWrite(length: number): boolean;
    scaleBuffer(length: number): void;
    readBoolean(): boolean;
    readByte(): number;
    readBytes(buffer: ByteArray, offset?: number, length?: number): void;
    readDouble(): number;
    readFloat(): number;
    readInt(): number;
    readMultiByte(length: number, charSet?: string): string;
    readShort(): number;
    readUnsignedByte(): number;
    readUnsignedInt(): number;
    readUnsignedShort(): number;
    readUTF(): string;
    readUTFBytes(length: number): string;
    toJSON(): {
        type: "Buffer";
        data: any[];
    };
    toString(charSet?: BufferEncoding, offset?: number, length?: number): string;
    writeBoolean(value: number | boolean): void;
    writeByte(value: number): void;
    writeBytes(buffer: ByteArray, offset?: number, length?: number): void;
    writeDouble(value: number): void;
    writeFloat(value: number): void;
    writeInt(value: number): void;
    writeMultiByte(value: string, charSet?: string): void;
    writeShort(value: number): void;
    writeUnsignedByte(value: number): void;
    writeUnsignedInt(value: number): void;
    writeUnsignedShort(value: number): void;
    writeUTF(value: string): void;
    writeUTFBytes(value: string): void;
    copyBytes(buffer: ByteArray, offset?: number, length?: number): void;
    advanceReadPositionBy(value: number): void;
}
