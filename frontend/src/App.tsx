import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/team";
import Ideas from "./pages/Ideas";
import Resources from "./pages/resources";
import Tasks from "./pages/Tasks";
import Submission from "./pages/Submission";
import Showcase from "./pages/Showcase";
import ProjectLists from "./pages/ProjectLists";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./auth/ProtectRoute";
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/submission" element={<Submission />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/projects" element={<ProjectLists />} />
            <Route path="/submission/:projectId" element={<Submission />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
