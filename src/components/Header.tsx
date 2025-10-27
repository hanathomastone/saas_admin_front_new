import { Flex, Text, Button, Spacer, Select, HStack } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [pageTitle, setPageTitle] = useState("");
  const [language, setLanguage] = useState(i18n.language || "ko");

  useEffect(() => {
    // ✅ 페이지 제목 다국어 적용
    switch (location.pathname) {
      case "/dashboard":
        setPageTitle(t("header.dashboard"));
        break;
      case "/admin/users":
        setPageTitle(t("header.userManage"));
        break;
      case "/admin/subscription/usage":
        setPageTitle(t("header.subscription"));
        break;
      case "/admin/users/statistic":
        setPageTitle(t("header.userStatistic"));
        break;
      default:
        setPageTitle("");
    }
  }, [location.pathname, t]);

  // ✅ 언어 변경 핸들러
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let lang = e.target.value;
    // ✅ 'ko-KR' → 'ko'로 정규화
    if (lang.startsWith("ko")) lang = "ko";
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Flex
      h="60px"
      bg="white"
      align="center"
      px={6}
      borderBottom="1px solid"
      borderColor="gray.200"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      {/* ✅ 페이지 제목 */}
      <Text fontSize="lg" fontWeight="bold">
        {pageTitle}
      </Text>

      <Spacer />

      {/* ✅ 언어 선택 & 로그아웃 버튼 */}
      <HStack spacing={4}>
        <Select
          size="sm"
          w="120px"
          value={language}
          onChange={handleLanguageChange}
          borderColor="gray.300"
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </Select>

        <Button size="sm" colorScheme="red" onClick={handleLogout}>
          {t("header.logout")}
        </Button>
      </HStack>
    </Flex>
  );
}
