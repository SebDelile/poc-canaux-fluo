export const FLUO_CHANNELS = ["CY3", "CY5", "DAPI", "FITC", "TexasRed"];
export const CHANNEL_COUNT = FLUO_CHANNELS.length;

export const FLUO_RGB = [
	[255, 255, 0],
	[255, 0, 0],
	[0, 0, 255],
	[0, 255, 0],
	[255, 128, 0]
];

export const FLUO_RGB_RATIO = FLUO_RGB.map((rgb) => rgb.map((byte) => byte / 255));

export const PARAMS_NAME = ["brightness", "contrast", "gamma"];

export const ORIGINAL_IMG_PIXEL_COUNT = CHANNEL_COUNT * 512 * 512;
export const IMG_BYTE_COUNT = 4 * 512 * 512;
