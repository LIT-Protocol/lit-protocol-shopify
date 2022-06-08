// for react 17
// import ReactDOM from "react-dom";
// import App from "./App";
//
// ReactDOM.render(<App />, document.getElementById("app"));

// for react 18
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
