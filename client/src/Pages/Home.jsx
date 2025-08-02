
import './Home.css'; // CSS styles

import Navbar from '../Component/Navbar';

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <div className="overlay">
           <h1 className="fade-in">Welcome to WebTwist</h1>
        <p className="fade-in delay-1">Innovative Solutions for Your Business</p>
        <button className="fade-in delay-2">Explore Services</button>
      </div>
      </div>
    </div>
  );
};

export default Home;

