import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotList from './components/SpotList';
import SpotDetail from './components/SpotList/SpotDetail';
import CreateSpot from './components/SpotForm/CreateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <div className='spotlist_container'><SpotList /></div>
      },
      {
        path: '/spots/:spotId',
        element: <div className='spotdetail_container'><SpotDetail /></div>
      },
      {
        path: '/spots/new',
        element: <div><CreateSpot /></div>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;