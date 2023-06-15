import { useState, useRef, Fragment } from "react";
import { OSDProcessDataToBuildImage } from "./OSDProcessDataToBuildImage";
import { updateLut, INITIAL_LUT } from "./updateLut";
import { FLUO_CHANNELS, FLUO_RGB, PARAMS_NAME } from "./constants";

const initialParams = { brightness: 0, contrast: 0, gamma: 1, lut: INITIAL_LUT };

function App() {
	const paramsAsRef = useRef(FLUO_CHANNELS.map((_) => ({ ...initialParams })));
	const [paramsAsState, setParamsAsState] = useState(paramsAsRef.current);
	const [seeOriginalImage, setSeeOriginalImage] = useState(false);

	const updateParams = (channelIndex, param, newValue) => {
		paramsAsRef.current[channelIndex] = {
			...paramsAsRef.current[channelIndex],
			[param]: newValue
		};
		paramsAsRef.current[channelIndex].lut = updateLut(paramsAsRef.current[channelIndex]);
		setParamsAsState([...paramsAsRef.current]);
	};

	const resetParams = (channelIndex) => {
		paramsAsRef.current[channelIndex] = { ...initialParams };
		setParamsAsState([...paramsAsRef.current]);
	};

	return (
		<div style={{ margin: 16 }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 16
				}}
			>
				<OSDProcessDataToBuildImage params={paramsAsRef} updateHandler={paramsAsState} />
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(6,1fr)",
						margin: "0 auto",
						width: "1200px",
						gap: "32px",
						textAlign: "center"
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr",
							gap: "4px",
							fontWeight: "bold"
						}}
					>
						<div>Channel</div>
						{PARAMS_NAME.map((paramName) => (
							<div key={paramName}>{paramName}</div>
						))}
						<button
							type="button"
							onClick={() =>
								FLUO_CHANNELS.forEach((_, channelIndex) =>
									resetParams(channelIndex)
								)
							}
						>
							Reset all
						</button>
					</div>
					{FLUO_CHANNELS.map((channel, channelIndex) => (
						<div
							key={channel}
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2,1fr)",
								gap: "4px"
							}}
						>
							<div
								style={{
									gridColumnEnd: "span 2",
									fontWeight: "bold",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								{channel}
								<svg
									width="1em"
									height="1em"
									viewBox="0 0 10 10"
									style={{ marginLeft: "4px" }}
								>
									<rect
										x="0"
										y="0"
										width="10"
										height="10"
										style={{
											fill: `rgb(${FLUO_RGB[channelIndex]})`,
											stroke: "#666",
											strokeWidth: 1
										}}
									/>
								</svg>
							</div>

							{PARAMS_NAME.map((param) => (
								<Fragment key={param}>
									<input
										type="range"
										id={`${channel}${param}`}
										name={`${channel}${param}`}
										min={param === "gamma" ? 0.1 : -100}
										max={param === "gamma" ? 5 : 100}
										step={param === "gamma" ? 0.1 : 4}
										value={paramsAsState[channelIndex][param]}
										onChange={(e) => {
											const newValue =
												param === "gamma"
													? parseFloat(e.target.value)
													: parseInt(e.target.value);
											updateParams(channelIndex, param, newValue);
										}}
									/>
									<label htmlFor={`${channel}${param}`}>
										{paramsAsState[channelIndex][param]}
									</label>
								</Fragment>
							))}
							<button
								type="button"
								onClick={() => resetParams(channelIndex)}
								style={{ gridColumnEnd: "span 2" }}
							>
								Reset
							</button>
						</div>
					))}
				</div>
				<hr />
				<div
					style={{ cursor: "pointer" }}
					onClick={() => {
						setSeeOriginalImage((prev) => !prev);
					}}
				>
					{`See original image and monochromes per fluo channel ${
						seeOriginalImage ? "▲" : "▼"
					}`}
				</div>
				<div
					style={{
						display: seeOriginalImage ? "grid" : "none",
						gridTemplateColumns: "5fr 1fr 1fr",
						placeItems: "center",
						gap: "0px 16px",
						marginTop: 16
					}}
				>
					<img
						src="assets/fluo/real-image/16896_24064.jpg"
						height={512}
						alt="original with color"
						style={{ gridRowEnd: "span 5" }}
					/>
					<img
						src="assets/fluo/real-image/vertical-added.jpg"
						height={512}
						alt="monochrome channels"
						style={{ gridRowEnd: "span 5" }}
					/>
					{FLUO_CHANNELS.map((channel) => (
						<div key={channel}>{channel}</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
