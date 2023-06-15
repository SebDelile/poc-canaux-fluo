import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";
import {
	PARAMS_NAME,
	CHANNEL_COUNT,
	ORIGINAL_IMG_PIXEL_COUNT,
	IMG_BYTE_COUNT,
	FLUO_RGB_RATIO
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
			const currentParams = [...params.current];
			if (
				!event.tile.currentParams ||
				event.tile.currentParams.some((channelParams, channelIndex) =>
					PARAMS_NAME.some(
						(param) => channelParams[param] !== currentParams[channelIndex][param]
					)
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

				console.time(event.tile.cacheKey);

				//for each pixel
				for (let i = 0; i < frameLength; i += 4) {
					const pixel = [0, 0, 0];
					// for each of the fluo channels
					for (let j = 0; j < CHANNEL_COUNT; j++) {
						const fluoChannelRGBRatio = FLUO_RGB_RATIO[j];
						const fluoByte = fluoData[(i / 4) * CHANNEL_COUNT + j];
						const { lut } = currentParams[j];
						const correctedFluoByte = lut[fluoByte];
						// for each of the RGB channels
						for (let k = 0; k < 3; k++) {
							const fluoChannelRatio = fluoChannelRGBRatio[k];
							if (fluoChannelRatio) pixel[k] += fluoChannelRatio * correctedFluoByte;
						}
					}
					for (let k = 0; k < 3; k++) {
						data[i + k] = Math.min(255, pixel[k]);
					}
					//opacity
					data[i + 3] = 255;
				}
				console.timeEnd(event.tile.cacheKey);
				//console.log(data);
				ctx.putImageData(displayedImageData, 0, 0);
				event.tile.currentParams = currentParams;
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
