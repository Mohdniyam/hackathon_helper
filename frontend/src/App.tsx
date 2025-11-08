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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/showcase" element={<Showcase />} />
        </Route>
      </Routes>
    </Router>
  );
}
