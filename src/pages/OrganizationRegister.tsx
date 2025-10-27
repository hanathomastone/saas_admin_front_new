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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Card,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
  Center,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface Plan {
  id: number;
  planName: string;
  planCycle: "monthly" | "yearly";
  price: number;
  maxSuccessResponses: number;
  planSort: number;
}

interface CreatedOrganization {
  organizationId: number;
  organizationName: string;
  organizationPhoneNumber: string;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  usageResetDate: string;
  subscriptionStartDate: string;
  successCount: number;
}

export default function OrganizationRegister() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [form, setForm] = useState({
    organizationName: "",
    organizationPhoneNumber: "",
    subscriptionPlanId: 0,
  });

  const [createdOrg, setCreatedOrg] = useState<CreatedOrganization | null>(
    null
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 반응형 설정 */
  const boxPadding = useBreakpointValue({ base: 6, md: 10 });
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl" });
  const buttonWidth = useBreakpointValue({ base: "130px", md: "150px" });
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3 });

  // ✅ 구독상품 목록 불러오기
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/admin/subscriptions/all");
        setPlans(response.data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast({
          title: t("organization.planLoadFailTitle"),
          description:
            err.response?.data?.message || t("organization.serverError"),
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [toast, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 기관 등록
  const handleRegister = async () => {
    if (
      !form.organizationName ||
      !form.organizationPhoneNumber ||
      !form.subscriptionPlanId
    ) {
      toast({
        title: t("organization.requiredWarning"),
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      const response = await api.post("/organizations", form);
      setCreatedOrg(response.data);
      onOpen();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message ||
        err.message ||
        t("organization.serverError");
      toast({
        title: t("organization.registerFail"),
        description: message,
        status: "error",
      });
    }
  };

  // ✅ 로딩 표시
  if (loading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // ✅ 요금제 구분
  const yearlyPlans = plans.filter((p) => p.planCycle === "yearly");
  const monthlyPlans = plans.filter((p) => p.planCycle === "monthly");

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
      py={10}
      px={4}
    >
      {/* 로고 및 제목 */}
      <VStack spacing={2} mb={10} textAlign="center">
        <Heading color="blue.600" fontWeight="bold" fontSize={headingSize}>
          DentiGlobal
        </Heading>
        <Text fontSize="lg" fontWeight="semibold">
          {t("organization.registerTitle")}
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

        {/* 전화번호 */}
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

        {/* 구독상품 */}
        <Box w="100%" textAlign="center">
          <Text fontWeight="semibold" mt={4}>
            {t("organization.subscriptionLabel")}
          </Text>

          <Tabs variant="soft-rounded" colorScheme="blue" mt={2}>
            <TabList justifyContent="center">
              <Tab>{t("organization.yearlyPlanTab")}</Tab>
              <Tab>{t("organization.monthlyPlanTab")}</Tab>
            </TabList>

            <TabPanels>
              {/* 연간 요금제 */}
              <TabPanel>
                <SimpleGrid columns={columns} spacing={4} mt={4}>
                  {yearlyPlans.map((p) => (
                    <Card
                      key={p.id}
                      border={
                        form.subscriptionPlanId === p.id
                          ? "2px solid #3182ce"
                          : "1px solid #e2e8f0"
                      }
                      cursor="pointer"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          subscriptionPlanId: p.id,
                        }))
                      }
                      _hover={{ transform: "scale(1.03)", boxShadow: "md" }}
                    >
                      <CardBody textAlign="center">
                        <Text fontWeight="bold" fontSize="md">
                          {p.planName.toUpperCase()}
                        </Text>
                        <Text fontSize="xl" color="blue.600" mt={1}>
                          ₩{p.price.toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {t("organization.maxCount", {
                            countText: p.maxSuccessResponses.toLocaleString(),
                          })}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* 월간 요금제 */}
              <TabPanel>
                <SimpleGrid columns={columns} spacing={4} mt={4}>
                  {monthlyPlans.map((p) => (
                    <Card
                      key={p.id}
                      border={
                        form.subscriptionPlanId === p.id
                          ? "2px solid #3182ce"
                          : "1px solid #e2e8f0"
                      }
                      cursor="pointer"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          subscriptionPlanId: p.id,
                        }))
                      }
                      _hover={{ transform: "scale(1.03)", boxShadow: "md" }}
                    >
                      <CardBody textAlign="center">
                        <Text fontWeight="bold" fontSize="md">
                          {p.planName.toUpperCase()}
                        </Text>
                        <Text fontSize="xl" color="blue.600" mt={1}>
                          ₩{p.price.toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {t("organization.maxCount", {
                            count: p.maxSuccessResponses,
                          })}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* 버튼 */}
        <HStack spacing={4} mt={8}>
          <Button colorScheme="blue" w={buttonWidth} onClick={handleRegister}>
            {t("organization.registerButton")}
          </Button>
          <Button
            w={buttonWidth}
            colorScheme="gray"
            onClick={() => navigate(-1)}
          >
            {t("organization.prevButton")}
          </Button>
        </HStack>
      </VStack>

      {/* ✅ 등록 완료 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent p={3}>
          <ModalHeader textAlign="center" color="blue.600">
            {t("organization.registerSuccessTitle")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" py={4}>
            {createdOrg && (
              <>
                <Text fontWeight="bold" mb={2}>
                  {createdOrg.organizationName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {t("organization.planName", {
                    name: createdOrg.subscriptionPlanName,
                  })}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {t("organization.startDate")}:{" "}
                  {createdOrg.subscriptionStartDate?.slice(0, 10)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {t("organization.renewalDate")}:{" "}
                  {createdOrg.usageResetDate?.slice(0, 10)}
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={() => navigate("/admin/users")}>
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
