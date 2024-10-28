import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer/Footer";
import * as sessionActions from "./store/session";
import SpotList from "./components/SpotList";
import SpotDetail from "./components/SpotList/SpotDetail";
import CreateSpot from "./components/SpotForm/CreateSpot";
import SpotManage from "./components/SpotList/SpotManage";
import EditSpot from "./components/SpotForm/EditSpot";
import ReviewManage from "./components/ReviewList/ReviewManage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <div className="grid-container">
            <SpotList />
          </div>
        ),
      },
      {
        path: "/spots/:spotId",
        element: (
          <div className="spotdetail_container">
            <SpotDetail />
          </div>
        ),
      },
      {
        path: "/spots/new",
        element: <CreateSpot />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <EditSpot />,
      },
      {
        path: "/spots/current",
        element: <SpotManage />,
      },
      {
        path: "/reviews/current",
        element: <ReviewManage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
