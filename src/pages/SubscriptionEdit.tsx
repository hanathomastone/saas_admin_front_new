import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Badge,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Switch,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

interface PlanItem {
  id: number;
  name: string;
  type: "monthly" | "yearly";
  price: number;
  maxSuccessResponses: number;
}

interface CurrentSubscription {
  organizationId: number;
  organizationName: string;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  planCycle: "monthly" | "yearly";
}

export default function SubscriptionEditPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CurrentSubscription | null>(
    null
  );
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  // ✅ 플랜 데이터 및 현재 구독 정보 불러오기
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/admin/subscription/plans");
        setPlans(res.data.response || []);
      } catch (err) {
        console.error("❌ 플랜 불러오기 실패:", err);
      }
    };

    const fetchCurrent = async () => {
      try {
        const res = await api.get("/admin/subscription/usage");
        setCurrentPlan({
          organizationId: res.data.response.organizationId,
          organizationName: res.data.response.organizationName,
          subscriptionPlanId: res.data.response.subscriptionPlanId,
          subscriptionPlanName: res.data.response.planName,
          planCycle: res.data.response.planCycle,
        });
      } catch (err) {
        console.error("❌ 현재 구독 정보 불러오기 실패:", err);
      }
    };

    fetchPlans();
    fetchCurrent();
  }, []);

  // ✅ 선택한 플랜 변경 요청
  const handleConfirmChange = async () => {
    if (!selectedPlan || !currentPlan) return;
    try {
      await api.post(
        `/organizations/${currentPlan.organizationId}/subscription/${selectedPlan.id}`
      );
      toast({
        title: "구독 변경 완료",
        description: `${selectedPlan.name} 플랜으로 변경되었습니다.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      navigate("/admin/subscription/usage");
    } catch (error) {
      console.log(error);
      toast({
        title: "구독 변경 실패",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  // ✅ 모달 열기
  const handleSelectPlan = (plan: PlanItem) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const filteredPlans = plans.filter((p) => p.type === cycle);

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">구독 상품 변경</Heading>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" color="gray.600">
            {cycle === "monthly" ? "월간 보기" : "연간 보기"}
          </Text>
          <Switch
            colorScheme="blue"
            isChecked={cycle === "yearly"}
            onChange={() =>
              setCycle(cycle === "monthly" ? "yearly" : "monthly")
            }
          />
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {filteredPlans.map((plan) => {
          const isCurrent =
            currentPlan &&
            currentPlan.subscriptionPlanName === plan.name &&
            currentPlan.planCycle === plan.type;

          return (
            <Box
              key={plan.id}
              bg={bgCard}
              p={6}
              rounded="xl"
              shadow="md"
              border="2px solid"
              borderColor={isCurrent ? "blue.400" : borderColor}
              transition="all 0.2s"
              _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
            >
              <Flex justify="space-between" align="center" mb={3}>
                <Heading size="md">{plan.name.toUpperCase()}</Heading>
                {isCurrent && (
                  <Badge colorScheme="blue" fontSize="sm">
                    현재 구독 중
                  </Badge>
                )}
              </Flex>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {plan.price.toLocaleString()}원
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {plan.type === "monthly" ? "월 구독" : "연 구독"}
              </Text>

              <Box bg="gray.50" p={3} rounded="md" mb={4}>
                <Text fontSize="sm" color="gray.600">
                  최대 응답 수:{" "}
                  <b>{plan.maxSuccessResponses.toLocaleString()}</b> 회
                </Text>
              </Box>

              {!isCurrent ? (
                <Button
                  w="full"
                  colorScheme="blue"
                  onClick={() => handleSelectPlan(plan)}
                >
                  선택하기
                </Button>
              ) : (
                <Button w="full" colorScheme="gray" disabled>
                  현재 구독 중
                </Button>
              )}
            </Box>
          );
        })}
      </SimpleGrid>

      {/* 🔔 변경 확인 모달 */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              구독 변경 확인
            </AlertDialogHeader>
            <AlertDialogBody>
              {selectedPlan &&
                `${selectedPlan.name.toUpperCase()} 플랜으로 변경하시겠습니까?`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmChange} ml={3}>
                변경하기
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
