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
import api from "../api"; // ✅ axios 클라이언트

export default function Login() {
  const [language, setLanguage] = useState("ko");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"user" | "admin">("admin"); // ✅ 기본값 관리자
  const navigate = useNavigate();

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
        userType: activeTab, // ✅ 탭 선택값 반영
      });

      // ✅ 로그인 실패 시 처리
      if (res.data.rt) {
        setError(res.data.rtMsg || "로그인 실패");
        return;
      }

      // ✅ 공통 토큰 저장
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // ✅ 개인 회원 로그인 처리
      if (activeTab === "user") {
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("userId", res.data.userId.toString());
        navigate("/admin/users");
      }
      // ✅ 관리자 로그인 처리
      else {
        localStorage.setItem("adminName", res.data.adminName);
        localStorage.setItem("adminId", res.data.adminId.toString());

        // ✅ 첫 로그인 여부 확인
        if (res.data.isFirstLogin === "Y") {
          console.log("첫 로그인 감지 → 기관등록 페이지로 이동");
          navigate("/register/organization");
        } else {
          navigate("/admin/users");
        }
      }
    } catch (err) {
      console.error("로그인 중 오류 발생:", err);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={6}>
      <Box w="100%" maxW="400px">
        {/* Header */}
        <Flex justify="flex-end" align="right" mb={6}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
            <option value="vi">베트남어</option>
          </Select>
        </Flex>

        {/* 로고 */}
        <Image
          src="/images/DentiGlobal.png"
          alt="Dentix Logo"
          mx="auto"
          mb={8}
          h="60px"
        />

        {/* Tabs */}
        <Tabs
          variant="unstyled"
          align="center"
          mb={6}
          defaultIndex={1} // ✅ 기본 선택: 관리자 탭
          onChange={(index) => setActiveTab(index === 0 ? "user" : "admin")}
        >
          <TabList borderBottom="1px solid" borderColor="gray.200">
            <Tab
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
              }}
              flex="1"
            >
              개인 회원
            </Tab>
            <Tab
              _selected={{
                color: "blue.600",
                borderBottom: "2px solid",
                borderColor: "blue.600",
              }}
              flex="1"
            >
              관리자 회원
            </Tab>
          </TabList>
        </Tabs>

        {/* 입력 필드 */}
        <Box mb={4}>
          <FormControl>
            <FormLabel>아이디</FormLabel>
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
            />
          </FormControl>
        </Box>

        <Box mb={6}>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
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
            />
          </FormControl>
        </Box>

        {/* 로그인 버튼 */}
        <Button
          colorScheme="blue"
          w="100%"
          h="50px"
          mb={4}
          onClick={handleLogin}
        >
          로그인
        </Button>

        {/* 에러 메시지 */}
        {error && (
          <Text color="red.500" textAlign="center" mb={4}>
            {error}
          </Text>
        )}

        {/* Footer */}
        <Flex justify="center" gap={4} mt={4} fontSize="sm" color="gray.500">
          <RouterLink to="/register">
            <Text as="span" color="blue.500" cursor="pointer">
              회원가입
            </Text>
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/find-password">
            <Text as="span" color="blue.500" cursor="pointer">
              비밀번호 찾기
            </Text>
          </RouterLink>
          <Text>|</Text>
          <RouterLink to="/contact" state={{ from: "login" }}>
            <Text as="span" color="blue.500" cursor="pointer">
              문의하기
            </Text>
          </RouterLink>
        </Flex>
      </Box>
    </Flex>
  );
}
