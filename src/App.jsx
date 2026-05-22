import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentCompletePage from './pages/AssessmentCompletePage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientStoriesPage from './pages/ClientStoriesPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AssessmentPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment-complete" element={<AssessmentCompletePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/client-stories" element={<ClientStoriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
