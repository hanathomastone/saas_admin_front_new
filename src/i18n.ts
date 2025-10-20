import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// ✅ 다국어 JSON은 public/locales/{lang}/translation.json 에 있어야 함
// 예: public/locales/ko/translation.json, en, vi ...

i18n
  .use(Backend) // JSON 파일을 HTTP로 불러옴
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // React에 연결
  .init({
    fallbackLng: "ko", // 기본 언어
    supportedLngs: ["ko", "en", "vi"], // 지원 언어 목록
    debug: import.meta.env.MODE === "development",

    interpolation: {
      escapeValue: false, // React는 자동 escaping 처리함
    },

    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // JSON 경로
    },
  });

export default i18n;
