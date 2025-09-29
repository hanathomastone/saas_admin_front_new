// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
// });

// // 로그인 API
// export const login = (
//   userType: "admin" | "user",
//   loginId: string,
//   password: string
// ) => api.post("/login", { userType, loginId, password });

// // 대시보드 데이터 API (예시)
// // - 사용자 요약 정보 불러오기
// export const getDashboardSummary = () => api.get("/dashboard/summary");

// // - 콘텐츠 카드 목록 불러오기
// export const getDashboardContents = () => api.get("/dashboard/contents");

// // 요청마다 토큰 자동 추가
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
