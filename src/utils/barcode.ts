import { BarcodeInfo } from '@/types/scanner.types';
import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/library';

export const scanBarcode = async (imageElement: HTMLImageElement): Promise<BarcodeInfo | null> => {
    const codeReader = new BrowserMultiFormatReader();

    try {
        const result = await codeReader.decodeFromImageElement(imageElement);
        return {
            rawText: result.getText(),
            barcodeFormat: BarcodeFormat[result.getBarcodeFormat()],
            parsedResult: result.getText(),
        };
    } catch (error) {
        return null;
    } finally {
        codeReader.reset();
    }
};

export const createBarcodeReader = (): BrowserMultiFormatReader => {
    return new BrowserMultiFormatReader();
};
