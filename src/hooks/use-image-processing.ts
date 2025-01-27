import { useState, useCallback } from 'react';
import { createCanvas, loadImage } from 'canvas';

export const useImageProcessing = () => {

    const dct = (data: Uint8Array): number[] => {
        const N = Math.sqrt(data.length);
        const coefficients = new Array(data.length).fill(0);
        for (let u = 0; u < N; u++) {
            for (let v = 0; v < N; v++) {
                let sum = 0;
                for (let x = 0; x < N; x++) {
                    for (let y = 0; y < N; y++) {
                        sum += data[x * N + y] * Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N)) *
                            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * N));
                    }
                }
                coefficients[u * N + v] = sum * (u === 0 ? 1 / Math.sqrt(2) : 1) * (v === 0 ? 1 / Math.sqrt(2) : 1);
            }
        }
        return coefficients;
    };

    const calculatePhash = useCallback(async (imagePath: string): Promise<string> => {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(16, 16);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 16, 16);
        const imageData = ctx.getImageData(0, 0, 16, 16);
        const grayscaleData = new Uint8Array(16 * 16);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            grayscaleData[i / 4] = Math.round(avg);
        }

        const dctCoefficients = dct(grayscaleData);
        const dct8x8 = dctCoefficients.slice(0, 64);
        const avg = dct8x8.reduce((sum, value) => sum + value, 0) / dct8x8.length;

        let hash = '';
        for (const value of dct8x8) {
            hash += value >= avg ? '1' : '0';
        }

        return hash;
    }, []);

    const calculateHammingDistanceHelper = (hash1: string, hash2: string): number => {
        let distance = 0;
        for (let i = 0; i < hash1.length; i++) {
            if (hash1[i] !== hash2[i]) distance++;
        }
        return distance;
    };

    return {
        calculatePhash,
        calculateHammingDistanceHelper
    };
};
