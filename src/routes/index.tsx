import { Routes, Route } from "react-router-dom";

// 인증 불필요 페이지
import Login from "../pages/Login";
import RegisterForm from "../pages/RegisterForm";
import UserListPage from "../pages/UserListPage";
import OrganizationEditPage from "../pages/OrganizationEditPage";
import UserStastics from "../pages/UserStastics";
// 레이아웃 & 라우팅 헬퍼
import MainLayout from "../components/MainLayout";
// import PrivateRoute from "./PrivateRoute";
import SubscriptionUsagePage from "../pages/SubscriptionUsagePage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ 인증 불필요 */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/oral-check" element={<OralCheckPage />} /> */}
      <Route path="/register" element={<RegisterForm />} />{" "}
      <Route path="/users" element={<UserListPage />} />
      <Route
        path="/organization/edit"
        element={
          <MainLayout
            organizationName="테스트 기관"
            companyLogo="/public/images/DentiGlobal.png"
          >
            <OrganizationEditPage />
          </MainLayout>
        }
      />
      {/* ✅ 회원가입 페이지 등록 */}
      {/* ✅ 인증 필요 (PrivateRoute + MainLayout으로 감싸기) */}
      <Route
        path="/users/stastics"
        element={
          <MainLayout
            organizationName="테스트 기관"
            companyLogo="/public/images/DentiGlobal.png"
          >
            <UserStastics />
          </MainLayout>
        }
      />
      <Route
        path="/subscription-usage"
        element={
          <MainLayout
            organizationName="테스트 기관"
            companyLogo="/public/images/DentiGlobal.png"
          >
            <SubscriptionUsagePage />
          </MainLayout>
        }
      />
    </Routes>
  );
}
