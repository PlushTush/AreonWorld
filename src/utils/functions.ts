import {ColorType} from "../pages/Worlds/ColorSelect";

export const shortAddress = (inputString: string, maxLength = 20) => {
    if (inputString.length <= maxLength) return inputString;
    const prefixLength = Math.floor((maxLength - 3) / 2);
    const suffixLength = maxLength - prefixLength - 3;
    const prefix = inputString.substring(0, prefixLength);
    const suffix = inputString.substring(inputString.length - suffixLength);
    return `${prefix}...${suffix}`;
};

export const timestampToDDMMYYYY = (timestamp: number, withTime: boolean = false) => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    if (withTime) return `${day}/${month}/${year} ${hours}:${minutes}`;
    else return `${day}/${month}/${year}`;
};

export const hexToRgb = (hex: string): { R: number; G: number; B: number } | null => {
    hex = hex.replace(/^#/, '');
    if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) return null;
    let bigint = parseInt(hex, 16);
    let R = (bigint >> 16) & 255;
    let G = (bigint >> 8) & 255;
    let B = bigint & 255;
    return {R, G, B};
};

export const objToRgbString = ({G, B, R}: ColorType): string => `rgb(${R}, ${G}, ${B})`;

export const preventDefaultClick = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
}