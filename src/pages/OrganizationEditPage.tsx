// src/pages/admin/OrganizationEdit.tsx
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface OrganizationDetail {
  organizationId: number;
  organizationName: string;
  organizationPhoneNumber: string;
}

export default function OrganizationEdit() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 기관 정보 + 구독상품 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgRes] = await Promise.all([
          api.get("/admin/organization/my"),
          // api.get("/admin/subscriptions/all"),
        ]);

        // ✅ 기관 정보가 없으면 등록 페이지로 이동
        if (!orgRes.data || !orgRes.data.organizationId) {
          toast({
            title: "기관 정보가 없습니다.",
            description: "기관 등록 페이지로 이동합니다.",
            status: "info",
            duration: 2000,
            isClosable: true,
          });
          navigate("/register/organization");
          return;
        }

        setForm(orgRes.data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast({
          title: "기관 정보를 불러오지 못했습니다.",
          description:
            err.response?.data?.message || "서버 오류가 발생했습니다.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // ✅ 기관 정보 수정
  const handleUpdate = async () => {
    if (!form) return;

    if (!form.organizationName || !form.organizationPhoneNumber) {
      toast({
        title: "기관명과 전화번호를 입력해주세요.",
        status: "warning",
      });
      return;
    }

    try {
      await api.put(`/organization/${form.organizationId}`, {
        organizationName: form.organizationName,
        organizationPhoneNumber: form.organizationPhoneNumber,
      });
      toast({
        title: "기관 정보가 수정되었습니다.",
        status: "success",
        duration: 2000,
      });
      navigate(-1);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message ||
        err.message ||
        "서버 오류가 발생했습니다.";
      toast({
        title: "수정 실패",
        description: message,
        status: "error",
      });
    }
  };

  if (loading || !form) {
    return (
      <Center minH="100vh" bg="gray.50">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // const currentPlan = plans.find((p) => p.id === form.subscriptionPlanId);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
      py={10}
    >
      {/* 로고 및 제목 */}
      <VStack spacing={2} mb={10}>
        <Heading color="blue.600" fontWeight="bold" fontSize="3xl">
          DentiGlobal
        </Heading>
        <Text fontSize="lg" fontWeight="semibold">
          기관 정보 수정
        </Text>
      </VStack>

      {/* 입력 폼 */}
      <VStack
        spacing={5}
        w="full"
        maxW="500px"
        bg="white"
        rounded="2xl"
        boxShadow="md"
        p={10}
      >
        {/* 기관명 */}
        <Box w="100%">
          <Text mb={1} fontWeight="medium">
            기관명
          </Text>
          <Input
            name="organizationName"
            placeholder="기관명을 입력하세요"
            value={form.organizationName}
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </Box>

        {/* 전화번호 */}
        <Box w="100%">
          <Text mb={1} fontWeight="medium">
            기관 전화번호
          </Text>
          <Input
            name="organizationPhoneNumber"
            placeholder="전화번호를 입력하세요"
            value={form.organizationPhoneNumber}
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </Box>

        {/* 버튼 */}
        <HStack spacing={4} mt={8}>
          <Button colorScheme="blue" w="150px" onClick={handleUpdate}>
            수정하기
          </Button>
          <Button w="150px" colorScheme="gray" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
}
