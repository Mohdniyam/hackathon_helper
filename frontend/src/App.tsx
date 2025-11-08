import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Submission from "@/pages/Submission";
import Showcase from "@/pages/Showcase";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
    </Layout>
  );
}
