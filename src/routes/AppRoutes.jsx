import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Checkins from '../pages/Checkins/Checkins';
import Messages from '../pages/Messages/Messages';
import SectionPlaceholder from '../pages/SectionPlaceholder/SectionPlaceholder';

const sectionRoutes = [
  {
    path: '/sightings',
    title: 'Who is seen with who?',
    description:
      'Sightings of people seen together at specific places and times.',
    icon: '👥',
    accent: 'yellow',
  },
  {
    path: '/notes',
    title: 'Personal notes',
    description: 'Personal notes and comments gathered during the investigation.',
    icon: '📝',
    accent: 'blue',
  },
  {
    path: '/tips',
    title: 'Anonymous tips',
    description: 'Anonymous tips submitted with varying reliability.',
    icon: '🔎',
    accent: 'orange',
  },
];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkins" element={<Checkins />} />
      <Route path="/messages" element={<Messages />} />
      {sectionRoutes.map((section) => (
        <Route
          key={section.path}
          path={section.path}
          element={
            <SectionPlaceholder
              title={section.title}
              description={section.description}
              icon={section.icon}
              accent={section.accent}
            />
          }
        />
      ))}
    </Routes>
  );
}

export default AppRoutes;
