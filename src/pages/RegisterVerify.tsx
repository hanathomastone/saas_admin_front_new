import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
  VStack,
  useBreakpointValue,
  Select,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api";

type VerifyForm = {
  organizationName: string;
  organizationPhoneNumber: string;
};

export default function RegisterVerify() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<VerifyForm>({
    organizationName: "",
    organizationPhoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ko");

  const boxPadding = useBreakpointValue({ base: 8, md: 10 });
  const boxWidth = useBreakpointValue({ base: "90%", sm: "480px" });

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerify = async () => {
    if (!form.organizationName || !form.organizationPhoneNumber) {
      toast({
        title: "입력 필요",
        description: "기관명과 전화번호를 모두 입력해주세요.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      // ✅ GET 요청 시 params로 전달해야 함
      const res = await api.get("/organizations/check-duplicate", {
        params: form,
      });

      const isDuplicate = res.data?.response ?? false;

      if (isDuplicate) {
        toast({
          title: "이미 가입된 기관입니다.",
          description: "로그인 페이지로 이동합니다.",
          status: "info",
          duration: 2500,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: "확인 완료",
          description: "회원가입 페이지로 이동합니다.",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        navigate("/register", { state: form });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "확인 실패",
        description: "서버와의 통신 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={4}>
      <Box
        w={boxWidth}
        bg="white"
        p={boxPadding}
        borderRadius="xl"
        boxShadow="0 0 20px rgba(0, 0, 0, 0.08)"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* 언어 선택 */}
        <Flex justify="flex-end" mb={4}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            w="130px"
            border="1px solid"
            borderColor="gray.300"
            fontSize="sm"
            borderRadius="md"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </Select>
        </Flex>

        {/* 로고 */}
        <Flex direction="column" align="center" mb={10}>
          <Image
            src="/images/DentiGlobal.png"
            alt="DentiGlobal Logo"
            h="65px"
            mb={4}
          />
          <Heading size="lg" color="gray.800" fontWeight="bold">
            기관 정보 확인
          </Heading>
        </Flex>

        {/* 입력 필드 */}
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="semibold" fontSize="md">
              기관명
            </FormLabel>
            <Input
              name="organizationName" // ✅ 수정됨
              value={form.organizationName}
              onChange={handleChange}
              placeholder="기관명을 입력하세요"
              size="lg"
              h="55px"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" fontSize="md">
              전화번호
            </FormLabel>
            <Input
              name="organizationPhoneNumber" // ✅ 수정됨
              value={form.organizationPhoneNumber}
              onChange={handleChange}
              placeholder="전화번호를 입력하세요"
              size="lg"
              h="55px"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            w="100%"
            h="55px"
            onClick={handleVerify}
            isLoading={loading}
            mt={2}
            fontSize="lg"
          >
            확인
          </Button>
        </VStack>

        <Text
          textAlign="center"
          fontSize="md"
          color="gray.600"
          mt={8}
          lineHeight="tall"
        >
          이미 계정이 있으신가요?{" "}
          <Text
            as="span"
            color="blue.500"
            fontWeight="semibold"
            cursor="pointer"
            onClick={() => navigate("/login")}
          >
            로그인하기
          </Text>
        </Text>
      </Box>
    </Flex>
  );
}
