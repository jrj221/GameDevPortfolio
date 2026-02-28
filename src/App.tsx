import Portfolio from "./components/Portfolio";
import { Route, Routes } from "react-router-dom";
import ScrollController from "./ScrollController";
import GameDevProjects from "./components/GameDevProjects";

function App() {
	return (
		<>
			<ScrollController />
			<Routes>
				<Route path="/" element={<Portfolio />} />
				<Route path="/gamedev" element={<GameDevProjects />} />
				<Route path="/chess" />
				<Route path="/cougs-connect" />
			</Routes>
		</>
	);
}

export default App;
