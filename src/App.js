import "./App.css";
import { useEffect, useState, Fragment } from "react";
import { OpenSeaDragonViewer } from "./OpenSeaDragonViewer";

function App() {
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

	return (
		<div className="App">
			<OpenSeaDragonViewer objectGamma={objectGamma} />

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
		</div>
	);
}

export default App;
