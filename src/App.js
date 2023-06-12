import "./App.css";
import { useEffect, useState, Fragment } from "react";
import { OSDProcessDataToBuildImage } from "./OSDProcessDataToBuildImage";
import FluotileBuilder from "./FluoTileBuilder";

export const FLUO_CHANNELS = ["CY3", "CY5", "DAPI", "FITC", "TexasRed"];
export const channelCount = FLUO_CHANNELS.length;
const initialGamma = 1;

function App() {
	const [gammaFluo, setGammaFluo] = useState(
		Object.fromEntries(FLUO_CHANNELS.map((chan) => [chan, 10 * initialGamma]))
	);
	const [displayedGammaFluo, setDisplayedGammaFluo] = useState(
		Object.fromEntries(FLUO_CHANNELS.map((chan) => [chan, initialGamma]))
	);
	const [objectGammaFluo, setObjectGammaFluo] = useState(
		Object.fromEntries(FLUO_CHANNELS.map((chan) => [chan, initialGamma]))
	);
	useEffect(() => {
		// tricky to have one state with an object with reliable reference
		// And antoher with a primitive to trigger re-render
		setObjectGammaFluo((prev) => {
			Object.entries(gammaFluo).forEach(([color, value]) => {
				prev[color] = Math.max(value / 10, 0.01);
			});
			return prev;
		});
		setDisplayedGammaFluo(
			Object.fromEntries(
				Object.entries(gammaFluo).map(([color, value]) => [color, (value / 10).toFixed(1)])
			)
		);
	}, [gammaFluo]);

	return (
		<div className="App">
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 16
				}}
			>
				<OSDProcessDataToBuildImage objectGamma={objectGammaFluo} />
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "200px 200px",
						margin: "0 auto",
						width: "400px",
						gap: "4px"
					}}
				>
					{["CY3", "CY5", "DAPI", "FITC", "TexasRed"].map((color) => (
						<Fragment key={color}>
							<input
								type="range"
								id={`${color[0]}gamma`}
								name={`${color[0]}gamma`}
								min={0}
								max={40}
								step={1}
								value={gammaFluo[color]}
								onChange={(e) =>
									setGammaFluo((prev) => ({
										...prev,
										[color]: parseInt(e.target.value)
									}))
								}
							/>
							<label
								htmlFor={`${color[0]}gamma`}
							>{`${color} gamma : ${displayedGammaFluo[color]}`}</label>
						</Fragment>
					))}
				</div>
				<div style={{ display: "flex", gap: 16 }}>
					<button
						type="button"
						style={{ width: 200 }}
						onClick={() =>
							setGammaFluo(
								Object.fromEntries(FLUO_CHANNELS.map((chan) => [chan, 0.1]))
							)
						}
					>
						Turn all off
					</button>
					<button
						type="button"
						style={{ width: 200 }}
						onClick={() =>
							setGammaFluo(
								Object.fromEntries(
									FLUO_CHANNELS.map((chan) => [chan, 10 * initialGamma])
								)
							)
						}
					>
						Reset all to 1
					</button>
					<button
						type="button"
						style={{ width: 200 }}
						onClick={() =>
							setGammaFluo((prev) =>
								Object.fromEntries(
									Object.entries(prev).map(([chan, value]) => [
										chan,
										Math.max(value - 5, 0.1)
									])
								)
							)
						}
					>
						substract 0.5 for all
					</button>
					<button
						type="button"
						style={{ width: 200 }}
						onClick={() =>
							setGammaFluo((prev) =>
								Object.fromEntries(
									Object.entries(prev).map(([chan, value]) => [
										chan,
										Math.min(value + 5, 40)
									])
								)
							)
						}
					>
						add 0.5 for all
					</button>
				</div>
				<div style={{ display: "flex", gap: 16 }}>
					<img src="assets/fluo/real-image/16896_24064.jpg" height={512} />
					<img src="assets/fluo/real-image/vertical-added.jpg" height={512} />
				</div>
			</div>
			{/* <FluotileBuilder /> */}
		</div>
	);
}

export default App;
