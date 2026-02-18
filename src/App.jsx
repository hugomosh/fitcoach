import { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import HomePage from './pages/HomePage';
import WorkoutPage from './pages/WorkoutPage';
import RecoveryPage from './pages/RecoveryPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const appData = useAppData();
  const [view, setView] = useState('home');
  const streak = appData.getStreak();

  const navigate = (page) => setView(page);

  switch (view) {
    case 'workout':
      return <WorkoutPage appData={appData} onNavigate={navigate} />;
    case 'recovery':
      return <RecoveryPage appData={appData} onNavigate={navigate} />;
    case 'progress':
      return <ProgressPage appData={appData} streak={streak} onNavigate={navigate} />;
    case 'settings':
      return <SettingsPage appData={appData} onNavigate={navigate} />;
    default:
      return <HomePage appData={appData} streak={streak} onNavigate={navigate} />;
  }
}
