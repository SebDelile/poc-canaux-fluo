import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";
import {
	FLUO_CHANNELS,
	PARAMS_NAME,
	CHANNEL_COUNT,
	FLUO_RGB,
	ORIGINAL_IMG_PIXEL_COUNT,
	IMG_BYTE_COUNT
} from "./constants";

const OSDProcessDataToBuildImage = ({ params, updateHandler }) => {
	const [viewer, setViewer] = useState(null);

	const InitOpenseadragon = () => {
		viewer && viewer.destroy();
		const osdViewer = OpenSeaDragon({
			id: "openSeaDragon",
			tileSources: "assets/testpatternFluo.dzi",
			// tileSources: "assets/CMU-1-Small-Region.dzi",
			prefixUrl: "images/",
			animationTime: 0.5,
			blendTime: 0.1,
			constrainDuringPan: true,
			maxZoomPixelRatio: 2,
			minZoomLevel: 1,
			visibilityRatio: 1,
			zoomPerScroll: 2
		});
		osdViewer.addHandler("tile-drawing", (event) => {
			if (
				!event.tile.currentParams ||
				Object.entries(event.tile.currentParams).some(([chan, chanParams]) =>
					PARAMS_NAME.some((param) => chanParams[param] !== params.current[chan][param])
				)
			) {
				const ctx = event.rendered;
				if (!event.tile.cachedData) {
					const originalImageData = ctx.getImageData(
						0,
						0,
						ctx.canvas.width,
						ctx.canvas.height
					).data;

					const data = new Uint8ClampedArray(ORIGINAL_IMG_PIXEL_COUNT);

					for (let i = 0; i < ORIGINAL_IMG_PIXEL_COUNT; i += CHANNEL_COUNT) {
						for (let j = 0; j < CHANNEL_COUNT; j++) {
							// each pixel RGBA of original image is R=G=B and A=255, 3 of 4 int are useless
							// store only the R int of each pixel of each img
							data[i + j] =
								originalImageData[(i / CHANNEL_COUNT) * 4 + j * IMG_BYTE_COUNT];
						}
					}
					event.tile.cachedData = data;
					ctx.canvas.width = 512;
					ctx.canvas.height = 512;
				}
				const fluoData = event.tile.cachedData;
				const displayedImageData = ctx.getImageData(
					0,
					0,
					ctx.canvas.width,
					ctx.canvas.height
				);
				const data = displayedImageData.data;
				const frameLength = data.length;

				//console.time(event.tile.cacheKey);

				//for each pixel
				for (let i = 0; i < frameLength; i += 4) {
					// for each of the RGB channels
					for (let j = 0; j < 3; j++) {
						let c = 0;
						// for each of the fluo channels
						for (let k = 0; k < FLUO_CHANNELS.length; k++) {
							c +=
								(FLUO_RGB[k][j] / 255) *
								params.current[FLUO_CHANNELS[k]].lut[
									fluoData[(i / 4) * CHANNEL_COUNT + k]
								];
						}
						data[i + j] = Math.min(c, 255);
					}
					//opacity
					data[i + 3] = 255;
				}
				// console.timeEnd(event.tile.cacheKey);
				ctx.putImageData(displayedImageData, 0, 0);
				event.tile.currentParams = { ...params.current };
			}
		});
		setViewer(osdViewer);
	};

	useEffect(() => {
		InitOpenseadragon();
		return () => {
			viewer && viewer.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (viewer) {
			const tiledImage = viewer.world.getItemAt(0);
			if (tiledImage) tiledImage.draw();
		}
	}, [viewer, updateHandler]);

	return (
		<div
			id="openSeaDragon"
			style={{
				height: "600px",
				width: "1200px"
			}}
		></div>
	);
};
export { OSDProcessDataToBuildImage };
