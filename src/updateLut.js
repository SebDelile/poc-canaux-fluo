export const INITIAL_LUT = new Uint8Array(256).map((_, i) => i);

export const updateLut = ({ brightness, contrast, gamma }) => {
	const c = (100 + contrast) / 100;
	const gammaInv = 1 / gamma;

	return INITIAL_LUT.map((byte) => {
		let f = (byte + brightness) / 255;
		f = (f - 0.5) * c + 0.5;
		f = Math.pow(f, gammaInv) * 255;

		return Math.min(Math.max(Math.round(f), 0), 255);
	});
};
