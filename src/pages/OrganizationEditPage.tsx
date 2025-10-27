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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface OrganizationDetail {
  organizationId: number;
  organizationName: string;
  organizationPhoneNumber: string;
}

export default function OrganizationEdit() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();

  const [form, setForm] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /** ✅ 반응형 설정 */
  const boxPadding = useBreakpointValue({ base: 6, md: 10 });
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
  const buttonWidth = useBreakpointValue({ base: "120px", md: "150px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgRes = await api.get("/admin/organization/my");

        if (!orgRes.data || !orgRes.data.organizationId) {
          toast({
            title: t("organization.noDataTitle"),
            description: t("organization.noDataDesc"),
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
          title: t("organization.loadErrorTitle"),
          description:
            err.response?.data?.message || t("organization.serverError"),
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast, navigate, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!form) return;

    if (!form.organizationName || !form.organizationPhoneNumber) {
      toast({
        title: t("organization.requiredWarning"),
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
        title: t("organization.updateSuccess"),
        status: "success",
        duration: 2000,
      });
      navigate(-1);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message ||
        err.message ||
        t("organization.serverError");
      toast({
        title: t("organization.updateFail"),
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

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      minH="100vh"
      bg="gray.50"
      pt={16}
      px={4}
    >
      {/* ✅ 상단 제목 */}
      <VStack spacing={1} mb={8}>
        <Heading color="blue.600" fontWeight="bold" fontSize={headingSize}>
          {form.organizationName}
        </Heading>
        <Text fontSize="lg" fontWeight="semibold">
          {t("organization.editTitle")}
        </Text>
      </VStack>

      {/* ✅ 입력 폼 */}
      <VStack
        spacing={5}
        w="full"
        maxW="500px"
        bg="white"
        rounded="2xl"
        boxShadow="md"
        p={boxPadding}
      >
        {/* 기관명 */}
        <Box w="100%">
          <Text mb={1} fontWeight="medium">
            {t("organization.nameLabel")}
          </Text>
          <Input
            name="organizationName"
            placeholder={t("organization.namePlaceholder")}
            value={form.organizationName}
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </Box>

        {/* 기관 전화번호 */}
        <Box w="100%">
          <Text mb={1} fontWeight="medium">
            {t("organization.phoneLabel")}
          </Text>
          <Input
            name="organizationPhoneNumber"
            placeholder={t("organization.phonePlaceholder")}
            value={form.organizationPhoneNumber}
            onChange={handleChange}
            focusBorderColor="blue.400"
          />
        </Box>

        {/* 버튼 영역 */}
        <HStack spacing={4} mt={8}>
          <Button colorScheme="blue" w={buttonWidth} onClick={handleUpdate}>
            {t("organization.updateButton")}
          </Button>
          <Button
            w={buttonWidth}
            colorScheme="gray"
            onClick={() => navigate(-1)}
          >
            {t("organization.backButton")}
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
}
