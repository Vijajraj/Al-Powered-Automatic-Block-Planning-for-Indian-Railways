import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MaintenancePage from './pages/MaintenancePage';
import TrainsPage from './pages/TrainsPage';
import BlockPlanningPage from './pages/BlockPlanningPage';
import DisruptionsPage from './pages/DisruptionsPage';
import ApprovalsPage from './pages/ApprovalsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/trains" element={<TrainsPage />} />
          <Route path="/block-planning" element={<BlockPlanningPage />} />
          <Route path="/disruptions" element={<DisruptionsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
