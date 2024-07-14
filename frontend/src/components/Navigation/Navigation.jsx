import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
    <ul className='nav_ul'>
      <li id='logo'>
        <NavLink to="/"><i className="fa-brands fa-airbnb"></i>aAbnb</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>

    </nav>
 
  );
}

export default Navigation;