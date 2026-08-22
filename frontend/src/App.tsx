import Portfolio from "./components/Portfolio";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollController from "./ScrollController";
import GameDevProjects from "./components/GameDevPortfolio/GameDevProjects";
import BudgetAppPrivacyPolicy from "./components/PrivacyPolicies/BudgetAppPrivacyPolicy";
import ScorekeeperAppPrivacyPolicy from "./components/PrivacyPolicies/ScorekeeperAppPrivacyPolicy";
import ThenAndNowAppPrivacyPolicy from "./components/PrivacyPolicies/ThenAndNowAppPrivacyPolicy";
import EVStopTrackerPrivacyPolicy from "./components/PrivacyPolicies/EVStopTrackerPrivacyPolicy";
import ProjectContributions from "./components/ContributionsProject/ProjectContributions";
import { useEffect } from "react";

/**
 * Forces a server-side reload to a path with a trailing slash.
 * This is necessary for S3 sub-folder deployments to load correctly.
 */
function HardRedirect({ to }: { to: string }) {
	const location = useLocation();
	useEffect(() => {
		// Only redirect if we don't already have the trailing slash
		if (!location.pathname.endsWith("/")) {
			window.location.replace(to);
		}
	}, [location, to]);

	return null;
}

function App() {
	return (
		<>
			<ScrollController />
			<Routes>
				<Route path="/" element={<Portfolio />} />
				<Route path="/gamedev" element={<GameDevProjects />} />
				<Route path="/contributions" element={<ProjectContributions />} />
				<Route path="/budget_app/privacy_policy" element={<BudgetAppPrivacyPolicy />} />
				<Route path="/scorekeeper_app/privacy_policy" element={<ScorekeeperAppPrivacyPolicy />} />
				<Route path="/then_and_now_app/privacy_policy" element={<ThenAndNowAppPrivacyPolicy />} />
				<Route path="/ev_stop_tracker/privacy_policy" element={<EVStopTrackerPrivacyPolicy />} />

				{/* Sub-projects deployed to S3 sub-folders */}
				<Route path="/agenda" element={<HardRedirect to="/agenda/" />} />
				<Route path="/chess" element={<HardRedirect to="/chess/" />} />
				<Route path="/cougs-connect" element={<HardRedirect to="/cougs-connect/" />} />
			</Routes>
		</>
	);
}

export default App;
