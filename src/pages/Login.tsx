import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api"; // ✅ axios 클라이언트
import { AxiosError } from "axios";
export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        loginId: id,
        password: password,
        userType: "USER",
      });

      // ✅ 로그인 성공 시에만 실행
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userName", res.data.userName);
      localStorage.setItem("userId", res.data.userId);

      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("로그인 실패:", error);

      if (error.response?.status === 401) {
        setError("아이디 혹은 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // 새로고침해도 유지
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={6}>
      <Box w="100%" maxW="400px">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          {/* 뒤로가기 버튼 */}
          <Button
            variant="ghost"
            p={0}
            minW="auto"
            onClick={() => console.log("뒤로가기")}
          >
            <Image src="/images/back.png" alt="뒤로가기" w="14px" h="14px" />
          </Button>

          {/* 언어 선택 */}
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            w="120px"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            fontSize="sm"
            textAlign="center"
            iconSize="16px"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </Select>
        </Flex>

        {/* Dentix 로고 */}
        <Image
          src="/images/denti_x.png"
          alt="Dentix Logo"
          mx="auto"
          mb={8}
          h="40px"
        />

        {/* Tabs */}
        <Tabs variant="unstyled" align="center" mb={6}>
          <TabList borderBottom="1px solid" borderColor="gray.200">
            <Tab
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
              }}
              flex="1"
            >
              {t("personal_member")}
            </Tab>
            <Tab
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
              }}
              flex="1"
              color="gray.400"
            >
              {t("admin_member")}
            </Tab>
          </TabList>
        </Tabs>

        {/* Input Fields */}
        <Box mb={4}>
          <FormControl>
            <FormLabel>{t("id")}</FormLabel>
            <Input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onFocus={() => handleFocus("id")}
              onBlur={handleBlur}
              borderColor={focusedField === "id" ? "red.400" : "gray.300"}
              focusBorderColor="red.400"
              _hover={{
                borderColor: focusedField === "id" ? "red.400" : "gray.400",
              }}
            />
          </FormControl>
        </Box>

        <Box mb={6}>
          <FormControl>
            <FormLabel>{t("password")}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("pw")}
              onBlur={handleBlur}
              borderColor={focusedField === "pw" ? "red.400" : "gray.300"}
              focusBorderColor="red.400"
              _hover={{
                borderColor: focusedField === "pw" ? "red.400" : "gray.400",
              }}
            />
          </FormControl>
        </Box>

        {/* Login Button */}
        <Button
          colorScheme="blue"
          w="100%"
          h="50px"
          mb={4}
          onClick={handleLogin}
        >
          {t("login")}
        </Button>

        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}

        {/* Footer Links */}
        <Flex justify="center" gap={4} mt={4} fontSize="sm" color="gray.500">
          <RouterLink to="/register/verify">
            <Text as="span" color="blue.500" cursor="pointer">
              {t("register")}
            </Text>
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/find-password">
            <Text as="span" color="blue.500" cursor="pointer">
              {t("find_password")}
            </Text>
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/contact" state={{ from: "login" }}>
            <Text as="span" color="blue.500" cursor="pointer">
              {t("contact")}
            </Text>
          </RouterLink>
        </Flex>
      </Box>
    </Flex>
  );
}
