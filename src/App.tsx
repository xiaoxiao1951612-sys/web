import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminLogin from "@/pages/AdminLogin";
import AdminEdit from "@/pages/AdminEdit";
import { Toaster } from "sonner";
import { AIAssistantFloatingButton } from "@/components/AIAssistantFloatingButton";
import { AuthProvider } from "@/contexts/authContext";
import { NotFound } from "@/components/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAddProject from "@/pages/AdminAddProject";
import AdminAddExperience from "@/pages/AdminAddExperience";
import AdminEditProfile from "@/pages/AdminEditProfile";
import AdminEditExperience from "@/pages/AdminEditExperience";

export default function App() {
  return (
    <AuthProvider>
      <>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: "bg-gray-800 border border-gray-700 text-white",
            success: {
              className: "bg-green-900/30 border border-green-700/50 text-green-300",
            },
            error: {
              className: "bg-red-900/30 border border-red-700/50 text-red-300",
            },
          }}
        />
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
           <Route path="/admin/login" element={<AdminLogin />} />
            {/* 确保路由匹配以斜杠结尾的URL */}
            <Route path="/admin/login/" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/edit/:id" element={<AdminEdit />} />
          <Route path="/admin/add-project" element={<AdminAddProject />} />
          <Route path="/admin/add-experience" element={<AdminAddExperience />} />
          <Route path="/admin/edit-profile" element={<AdminEditProfile />} />
          <Route path="/admin/edit-experience/:id" element={<AdminEditExperience />} />
          {/* 添加404路由处理 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* 确保在移动端也能正常显示的悬浮按钮 */}
        <AIAssistantFloatingButton />
      </>
    </AuthProvider>
  );
}
