import "./App.css";
import { useEffect, useState, Fragment } from "react";
import { OSDGammaOnTheFly } from "./OSDGammaOnTheFly";
import { OSDProcessDataToBuildImage } from "./OSDProcessDataToBuildImage";

const MODE = 0;

function App() {
	// mode gamma on the fly
	const [gamma, setGamma] = useState({ r: 10, g: 10, b: 10 });
	const [displayedGamma, setDisplayedGamma] = useState({ r: 1, g: 1, b: 1 });
	const [objectGamma, setObjectGamma] = useState({ r: 1, g: 1, b: 1 });
	useEffect(() => {
		// tricky to have one state with an object with reliable reference
		// And antoher with a primitive to trigger re-render
		setObjectGamma((prev) => {
			Object.entries(gamma).forEach(([color, value]) => {
				prev[color] = Math.max(value / 10, 0.01);
			});
			return prev;
		});
		setDisplayedGamma(
			Object.fromEntries(
				Object.entries(gamma).map(([color, value]) => [color, (value / 10).toFixed(1)])
			)
		);
	}, [gamma]);

	// mode process data to build image
	const [gammaFluo, setGammaFluo] = useState({
		gris: 5,
		rouge: 5,
		cyan: 5,
		vert: 5,
		magenta: 5,
		bleu: 5,
		jaune: 5
	});
	const [displayedGammaFluo, setDisplayedGammaFluo] = useState({
		gris: 0.5,
		rouge: 0.5,
		cyan: 0.5,
		vert: 0.5,
		magenta: 0.5,
		bleu: 0.5,
		jaune: 0.5
	});
	const [objectGammaFluo, setObjectGammaFluo] = useState({
		gris: 0.5,
		rouge: 0.5,
		cyan: 0.5,
		vert: 0.5,
		magenta: 0.5,
		bleu: 0.5,
		jaune: 0.5
	});
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
			{MODE ? (
				<>
					<OSDGammaOnTheFly objectGamma={objectGamma} />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "150px 150px",
							margin: "0 auto",
							width: "300px",
							gap: "16px"
						}}
					>
						{["red", "green", "blue"].map((color) => (
							<Fragment key={color}>
								<input
									type="range"
									id={`${color[0]}gamma`}
									name={`${color[0]}gamma`}
									min={0}
									max={40}
									step={1}
									value={gamma[color[0]]}
									onChange={(e) =>
										setGamma((prev) => ({
											...prev,
											[color[0]]: parseInt(e.target.value)
										}))
									}
								/>
								<label htmlFor={`${color[0]}gamma`}>{`${color} gamma : ${
									displayedGamma[color[0]]
								}`}</label>
							</Fragment>
						))}
					</div>
					<button type="button" onClick={() => setGamma({ r: 10, g: 10, b: 10 })}>
						Reset
					</button>
				</>
			) : (
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
						{["gris", "rouge", "cyan", "vert", "magenta", "bleu", "jaune"].map(
							(color) => (
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
							)
						)}
					</div>
					<button
						type="button"
						style={{ width: 200 }}
						onClick={() =>
							setGammaFluo({
								gris: 5,
								rouge: 5,
								magenta: 5,
								cyan: 5,
								vert: 5,
								jaune: 5,
								bleu: 5
							})
						}
					>
						Reset
					</button>
					<img src="assets/fluo/colorized.jpg" width={1200} />
				</div>
			)}
		</div>
	);
}

export default App;
