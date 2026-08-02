import { Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import { AlertProvider } from '@/context/AlertContext';

export default function App() {
  return (
    <AlertProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </AlertProvider>
  );
}
