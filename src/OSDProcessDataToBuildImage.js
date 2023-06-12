import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const FLUO_RGB = [
	[255, 255, 0],
	[255, 0, 0],
	[0, 0, 255],
	[0, 255, 0],
	[255, 128, 0]
];

const OSDProcessDataToBuildImage = ({ objectGamma }) => {
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
				!event.tile.currentGamma ||
				Object.entries(event.tile.currentGamma).some(
					([color, value]) => objectGamma[color] !== value
				)
			) {
				const ctx = event.rendered;
				if (!event.tile.originalImage) {
					event.tile.originalImage = ctx.getImageData(
						0,
						0,
						ctx.canvas.width,
						ctx.canvas.height
					);
					ctx.canvas.width = 512;
					ctx.canvas.height = 512;
				}
				const fluoData = Uint8ClampedArray.from(event.tile.originalImage.data);
				const displayedImageData = ctx.getImageData(
					0,
					0,
					ctx.canvas.width,
					ctx.canvas.height
				);
				const data = displayedImageData.data;
				const frameLength = data.length;

				const precomputedGammas = Object.values(objectGamma).map((gamma) => {
					const precomputedGamma = [];
					for (let i = 0; i < 256; i++) {
						precomputedGamma[i] = parseInt(Math.pow(i / 255, 1 / gamma) * 255);
					}
					return precomputedGamma;
				});
				// console.log(fluoData);
				// console.log(precomputedGammas[0]);
				for (var i = 0; i < frameLength; i += 4) {
					data[i] = Math.min(
						[0, 1, 2, 3, 4].reduce(
							(a, b) =>
								a +
								(FLUO_RGB[b][0] / 255) *
									precomputedGammas[b][fluoData[i + frameLength * b]],
							0
						),
						255
					);
					data[i + 1] = Math.min(
						[0, 1, 2, 3, 4].reduce(
							(a, b) =>
								a +
								(FLUO_RGB[b][1] / 255) *
									precomputedGammas[b][fluoData[i + 1 + frameLength * b]],
							0
						),
						255
					);
					data[i + 2] = Math.min(
						[0, 1, 2, 3, 4].reduce(
							(a, b) =>
								a +
								(FLUO_RGB[b][2] / 255) *
									precomputedGammas[b][fluoData[i + 2 + frameLength * b]],
							0
						),
						255
					);
					data[i + 3] = 255;
				}
				ctx.putImageData(displayedImageData, 0, 0);
				event.tile.currentGamma = { ...objectGamma };
			}
		});
		setViewer(osdViewer);
	};

	useEffect(() => {
		InitOpenseadragon();
		return () => {
			viewer && viewer.destroy();
		};
	}, []);

	useEffect(() => {
		if (viewer) {
			const tiledImage = viewer.world.getItemAt(0);
			if (tiledImage) tiledImage.draw();
		}
	}, [
		viewer,
		objectGamma.CY3,
		objectGamma.CY5,
		objectGamma.DAPI,
		objectGamma.FITC,
		objectGamma.TexasRed
	]);

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
