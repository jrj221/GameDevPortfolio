import Portfolio from "./Portfolio";
import { Route, Routes } from "react-router-dom";
import ScrollController from "./ScrollController";

function App() {
	return (
		<>
			<ScrollController />
			<Routes>
				<Route path="/" element={<Portfolio />} />
				<Route path="/chess" />
				<Route path="/cougs-connect" />
			</Routes>
		</>
	);
}

export default App;
