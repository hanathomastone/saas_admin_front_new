import { Routes, Route } from "react-router-dom";

// 인증 불필요 페이지
import Login from "../pages/Login";
import RegisterForm from "../pages/RegisterForm";
import UserListPage from "../pages/UserListPage";
import OrganizationEditPage from "../pages/OrganizationEditPage";
import UserStastics from "../pages/UserStatisticsPage";
// 레이아웃 & 라우팅 헬퍼
import MainLayout from "../components/MainLayout";
// import PrivateRoute from "./PrivateRoute";
// import SubscriptionUsagePage from "../pages/SubscriptionUsagePage";
import SubscriptionUsagePage from "../pages/SubscriptionUsagePage";
import SubscriptionEdit from "../pages/SubscriptionEdit";
import ServiceUsageDashboard from "../pages/ServiceUsageDashboard";
import ContactPage from "../pages/Contact";
import AwsUsageDashboard from "../pages/AwsUsageDashboard";
import OrganizationRegister from "../pages/OrganizationRegister";
import UserUsagePage from "../pages/userUsagePage";
import Contact from "../pages/Contact";
import SubscriptionSuper from "../pages/SuperAdmin/SubscriptionSuper";
import SuperUserStatisticPage from "../pages/SuperAdmin/SuperUserStatisticPage";
import SuperUsageInfoPage from "../pages/SuperAdmin/SuperUsageInfoPage";
// import AwsUsageDashboard from "../pages/AwsUsageDashboard";
export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ 인증 불필요 */}
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<RegisterForm />} />{" "}
      <Route path="/register/organization" element={<OrganizationRegister />} />
      {""}
      <Route
        path="/organization/edit"
        element={
          <MainLayout>
            <OrganizationEditPage />
          </MainLayout>
        }
      />
      {/* ✅ 회원가입 페이지 등록 */}
      {/* ✅ 인증 필요 (PrivateRoute + MainLayout으로 감싸기) */}
      <Route
        path="/admin/users/statistic"
        element={
          <MainLayout>
            <UserStastics />
          </MainLayout>
        }
      />
      <Route
        path="/admin/subscription/usage"
        element={
          <MainLayout>
            <SubscriptionUsagePage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/subscription/edit"
        element={
          <MainLayout>
            <SubscriptionEdit />
          </MainLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <MainLayout>
            <UserListPage />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/admin/usage-service/info"
        element={
          <MainLayout>
            <ServiceUsageDashboard />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/admin/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/admin/aws"
        element={
          <MainLayout>
            <AwsUsageDashboard />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/admin/subscription/users"
        element={
          <MainLayout>
            <UserUsagePage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/organization/edit"
        element={
          <MainLayout>
            <OrganizationEditPage />
          </MainLayout>
        }
      ></Route>
      <Route
        path="/admin/subscription/super"
        element={
          <MainLayout>
            <SubscriptionSuper />
          </MainLayout>
        }
      />
      <Route
        path="/admin/users/statistic/super"
        element={
          <MainLayout>
            <SuperUserStatisticPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/usage-service/info/super"
        element={
          <MainLayout>
            <SuperUsageInfoPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin/aws/info/super"
        element={
          <MainLayout>
            <AwsUsageDashboard />
          </MainLayout>
        }
      />
      {/* <Route
        path="/admin/usage-service/info"
        element={
          <MainLayout>
            <ServiceUsageDashboard />
          </MainLayout>
        }
      ></Route> */}
    </Routes>
  );
}
