import React, { useRef, useEffect } from "react";
import { FLUO_CHANNELS, channelCount } from "./App";

const FluotileBuilder = () => {
	const imgRef = useRef(null);
	useEffect(() => {
		if (imgRef) {
			let canvas = document.createElement("canvas");
			let ctx = canvas.getContext("2d");
			canvas.width = 512;
			// each of the rvba channel is assigned to a fluo channel
			canvas.height = (512 * channelCount) / 4;
			const drawImage = async () =>
				Promise.all(
					FLUO_CHANNELS.map((chan) => {
						return new Promise((resolve) => {
							let img = new Image();
							img.onload = () => {
								let canvasTemp = document.createElement("canvas");
								canvasTemp.width = 512;
								canvasTemp.height = 512;
								let ctxTemp = canvasTemp.getContext("2d");
								ctxTemp.drawImage(img, 0, 0);
								const imageDataTemp = ctxTemp.getImageData(
									0,
									0,
									ctxTemp.canvas.width,
									ctxTemp.canvas.height
								);

								resolve(imageDataTemp);
							};
							img.src = `assets/fluo/real-image/16896_24064_${chan}.jpg`;
						});
					})
				);
			drawImage().then((imgDatas) => {
				//console.log(imgDatas.map((imgdata) => imgdata.data.slice(0, 10)));
				const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
				const data = imageData.data;
				const totalBits = channelCount * 512 * 512;
				for (let i = 0; i < totalBits; i += channelCount) {
					for (let j = 0; j < channelCount; j++) {
						data[i + j] = imgDatas[j].data[(i / channelCount) * 4];
					}
				}
				ctx.putImageData(imageData, 0, 0);
				imgRef.current.src = canvas.toDataURL("image/jpeg", 1);
			});
		}
	}, [imgRef]);

	return <img ref={imgRef} alt="yoopi-yoopa" />;
};

export default FluotileBuilder;
