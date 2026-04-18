import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Checkins from '../pages/Checkins/Checkins';
import Messages from '../pages/Messages/Messages';
import Sightings from '../pages/Sightings/Sightings';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkins" element={<Checkins />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/sightings" element={<Sightings />} />
    </Routes>
  );
}

export default AppRoutes;
