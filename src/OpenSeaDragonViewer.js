import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({ objectGamma }) => {
	const [viewer, setViewer] = useState(null);

	const InitOpenseadragon = () => {
		viewer && viewer.destroy();
		const osdViewer = OpenSeaDragon({
			id: "openSeaDragon",
			tileSources: "assets/testpattern.dzi",
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
				}
				const imageData = new ImageData(
					Uint8ClampedArray.from(event.tile.originalImage.data),
					event.tile.originalImage.width,
					event.tile.originalImage.height,
					{ colorSpace: event.tile.originalImage.colorSpace }
				);

				const data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					data[i] = 255 * Math.pow(data[i] / 255, 1 / objectGamma.r);
					data[i + 1] = 255 * Math.pow(data[i + 1] / 255, 1 / objectGamma.g);
					data[i + 2] = 255 * Math.pow(data[i + 2] / 255, 1 / objectGamma.b);
				}
				ctx.putImageData(imageData, 0, 0);
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
	}, [viewer, objectGamma.r, objectGamma.g, objectGamma.b]);

	return (
		<div
			id="openSeaDragon"
			style={{
				height: "800px",
				width: "1200px"
			}}
		></div>
	);
};
export { OpenSeaDragonViewer };
