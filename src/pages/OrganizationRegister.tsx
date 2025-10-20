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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [form, setForm] = useState({
    organizationName: "",
    organizationPhoneNumber: "",
    subscriptionPlanId: 0,
  });

  // const [_cycle, setCycle] = useState<"year" | "month">("month");
  const [createdOrg, setCreatedOrg] = useState<CreatedOrganization | null>(
    null
  );

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ 구독상품 목록 불러오기
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/admin/subscriptions/all");
        setPlans(response.data);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast({
          title: "구독상품 조회 실패",
          description:
            err.response?.data?.message || "서버 오류가 발생했습니다.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [toast]);

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
        title: "모든 항목을 입력해주세요.",
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
        "서버 오류가 발생했습니다.";
      toast({
        title: "등록 실패",
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
    >
      {/* 로고 및 제목 */}
      <VStack spacing={2} mb={10}>
        <Heading color="blue.600" fontWeight="bold" fontSize="3xl">
          DentiGlobal
        </Heading>
        <Text fontSize="lg" fontWeight="semibold">
          기관 등록
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

        {/* 구독상품 */}
        <Box w="100%" textAlign="center">
          <Text fontWeight="semibold" mt={4}>
            구독상품
          </Text>

          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            mt={2}
            // onChange={(index) => setCycle(index === 0 ? "year" : "month")}
          >
            <TabList justifyContent="center">
              <Tab>연간 요금제</Tab>
              <Tab>월간 요금제</Tab>
            </TabList>

            <TabPanels>
              {/* 연간 요금제 */}
              <TabPanel>
                <SimpleGrid columns={3} spacing={4} mt={4}>
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
                          최대 {p.maxSuccessResponses.toLocaleString()}건
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* 월간 요금제 */}
              <TabPanel>
                <SimpleGrid columns={3} spacing={4} mt={4}>
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
                          최대 {p.maxSuccessResponses.toLocaleString()}건
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
          <Button colorScheme="blue" w="150px" onClick={handleRegister}>
            등록하기
          </Button>
          <Button w="150px" colorScheme="gray" onClick={() => navigate(-1)}>
            이전화면
          </Button>
        </HStack>
      </VStack>

      {/* ✅ 등록 완료 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent p={3}>
          <ModalHeader textAlign="center" color="blue.600">
            기관 등록 완료 🎉
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" py={4}>
            {createdOrg && (
              <>
                <Text fontWeight="bold" mb={2}>
                  {createdOrg.organizationName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  구독 상품: {createdOrg.subscriptionPlanName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  시작일: {createdOrg.subscriptionStartDate?.slice(0, 10)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  갱신일: {createdOrg.usageResetDate?.slice(0, 10)}
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={() => navigate("/admin/users")}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
