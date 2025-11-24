import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollController() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/tic-tac-toe-squared") { // add more if any shouldn't have them.
      document.body.style.overflow = "hidden";   // no scroll
    } else {
      document.body.style.overflow = "auto";     // scroll allowed
    }
  }, [location]);

  return null; // doesn’t render anything
}

export default ScrollController;