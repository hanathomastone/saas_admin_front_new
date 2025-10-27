import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
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
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState("ko");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("admin");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  /** ✅ 반응형 설정 */
  const boxPadding = useBreakpointValue({ base: 4, md: 8 });
  const logoSize = useBreakpointValue({ base: "45px", md: "60px" });
  const buttonHeight = useBreakpointValue({ base: "45px", md: "50px" });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });

  /** ✅ 저장된 언어 불러오기 */
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  /** ✅ 언어 변경 */
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  /** ✅ 로그인 요청 */
  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        loginId: id,
        password: password,
        userType: activeTab,
      });

      if (res.data.rt) {
        setError(res.data.rtMsg || t("login.errorMsg"));
        toast({
          title: t("login.errorTitle"),
          description: res.data.rtMsg || t("login.errorMsg"),
          status: "error",
          duration: 2500,
        });
        return;
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      if (activeTab === "user") {
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("userId", res.data.userId.toString());
        navigate("/dashboard");
      } else {
        localStorage.setItem("adminName", res.data.adminName);
        localStorage.setItem("adminId", res.data.adminId.toString());
        localStorage.setItem(
          "organizationName",
          res.data.organizationName || ""
        );
        localStorage.setItem("adminLoginIdentifier", id);
        localStorage.setItem("adminIsSuper", res.data.adminIsSuper);
        if (res.data.isFirstLogin === "Y") {
          navigate("/register/organization");
        } else {
          navigate("/admin/users");
        }
      }

      toast({
        title: t("login.successTitle"),
        description: t("login.successMsg", {
          name: res.data.adminName || res.data.userName,
        }),
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("❌ 로그인 오류:", err);
      setError(t("login.networkError"));
      toast({
        title: t("login.errorTitle"),
        description: t("login.networkError"),
        status: "error",
        duration: 2000,
      });
    }
  };

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  /** ✅ 회원가입 이동 */
  const handleRegister = () => navigate("/register");

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, blue.50, white)"
      px={boxPadding}
    >
      <Box
        w="100%"
        maxW="500px"
        bg="white"
        p={boxPadding}
        borderRadius="2xl"
        boxShadow="0 4px 15px rgba(0, 0, 0, 0.08)"
        border="1px solid"
        borderColor="gray.100"
      >
        {/* ✅ Header: 언어 선택 */}
        <Flex justify="flex-end" mb={4}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            w="120px"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            fontSize="sm"
            textAlign="center"
          >
            <option value="ko">{t("common.korean")}</option>
            <option value="en">{t("common.english")}</option>
            <option value="vi">{t("common.vietnamese")}</option>
          </Select>
        </Flex>

        {/* ✅ 로고 */}
        <Image
          src="/images/DentiGlobal.png"
          alt="DentiGlobal Logo"
          mx="auto"
          mb={8}
          h={logoSize}
        />

        {/* ✅ Tabs: 개인 / 관리자 */}
        <Tabs
          variant="unstyled"
          align="center"
          mb={6}
          defaultIndex={1}
          onChange={(index) => setActiveTab(index === 0 ? "user" : "admin")}
        >
          <TabList borderBottom="1px solid" borderColor="gray.200">
            <Tab
              flex="1"
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
                fontWeight: "semibold",
              }}
            >
              {t("login.userTab")}
            </Tab>
            <Tab
              flex="1"
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
                fontWeight: "semibold",
              }}
            >
              {t("login.adminTab")}
            </Tab>
          </TabList>
        </Tabs>

        {/* ✅ 로그인 폼 */}
        <Box mb={4}>
          <FormControl>
            <FormLabel fontSize={fontSize}>{t("login.idLabel")}</FormLabel>
            <Input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onFocus={() => handleFocus("id")}
              onBlur={handleBlur}
              borderColor={focusedField === "id" ? "blue.400" : "gray.300"}
              focusBorderColor="blue.400"
              _hover={{
                borderColor: focusedField === "id" ? "blue.400" : "gray.400",
              }}
              placeholder={t("login.idPlaceholder")}
            />
          </FormControl>
        </Box>

        <Box mb={6}>
          <FormControl>
            <FormLabel fontSize={fontSize}>
              {t("login.passwordLabel")}
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("pw")}
              onBlur={handleBlur}
              borderColor={focusedField === "pw" ? "blue.400" : "gray.300"}
              focusBorderColor="blue.400"
              _hover={{
                borderColor: focusedField === "pw" ? "blue.400" : "gray.400",
              }}
              placeholder={t("login.passwordPlaceholder")}
            />
          </FormControl>
        </Box>

        {/* ✅ 로그인 버튼 */}
        <Button
          w="100%"
          h={buttonHeight}
          fontSize={fontSize}
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, blue.600)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, blue.500, blue.700)",
            boxShadow: "md",
          }}
          borderRadius="md"
          onClick={handleLogin}
          mb={3}
        >
          {t("login.loginButton")}
        </Button>

        {/* ✅ 회원가입 버튼 */}
        <Button
          w="100%"
          h={buttonHeight}
          fontSize={fontSize}
          fontWeight="medium"
          bg="white"
          color="blue.600"
          border="1px solid"
          borderColor="blue.400"
          _hover={{
            bg: "blue.50",
            borderColor: "blue.500",
          }}
          borderRadius="md"
          onClick={handleRegister}
          mb={3}
        >
          {t("login.registerButton")}
        </Button>

        {/* ✅ 에러 메시지 */}
        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}

        {/* ✅ Footer */}
        <Flex justify="center" gap={4} mt={4} fontSize="sm" color="gray.500">
          <RouterLink to="/contact" state={{ from: "login" }}>
            <Text as="span" color="blue.500" cursor="pointer">
              {t("footer.contact")}
            </Text>
          </RouterLink>
        </Flex>
      </Box>
    </Flex>
  );
}
