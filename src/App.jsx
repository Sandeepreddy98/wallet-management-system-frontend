import "./App.css";
import {
  createBrowserRouter,
  BrowserRouter as Route,
  Router,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import Wallet from "./components/Wallet";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "",
      element: <Home />,
    },
    {
      path: "/wallet/:id",
      element: <Wallet />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
