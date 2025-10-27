import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Heading,
  VStack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Switch,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

/** ✅ 구독 플랜 정보 타입 */
interface Plan {
  id: number; // subscriptionPlanId
  planName: string; // small | growth | midsize 등
  planCycle: "monthly" | "yearly";
  price: number;
  maxSuccessResponses: number;
  planSort: number;
}

/** ✅ Props */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string; // 현재 구독중인 플랜명
  onConfirm: (planId: number) => Promise<void>; // ✅ 단일 인자만 받음
}

/** ✅ 구독 변경 모달 */
export default function SubscriptionChangeModal({
  isOpen,
  onClose,
  currentPlan,
  onConfirm,
}: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  /** ✅ 플랜 목록 그룹화 (월간/연간) */
  const groupedPlans = useMemo(() => {
    const map: Record<
      string,
      { monthly?: Plan; yearly?: Plan; sort?: number }
    > = {};
    plans.forEach((p) => {
      if (!map[p.planName]) map[p.planName] = {};
      map[p.planName][p.planCycle] = p;
      if (p.planCycle === "monthly") map[p.planName].sort = p.planSort;
    });
    return Object.entries(map)
      .map(([name, pair]) => ({ name, ...pair }))
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }, [plans]);

  /** ✅ 모달 열릴 때 플랜 목록 조회 */
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api
      .get<Plan[]>("/subscription/info/all")
      .then((res) => setPlans(res.data))
      .catch(() =>
        toast({
          title: "플랜 정보 로드 실패",
          description: "구독 서비스 정보를 불러올 수 없습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(() => setLoading(false));
  }, [isOpen, toast]);

  /** ✅ 구독 변경 실행 */
  const handleChangePlan = async () => {
    if (!selectedPlan) return;
    setIsSaving(true);
    try {
      await onConfirm(selectedPlan.id); // ✅ 단일 인자만 전달
      onClose();
    } catch (err) {
      console.error("❌ 구독 변경 실패:", err);
      toast({
        title: "구독 변경 실패",
        description: "서버와 통신 중 문제가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  /** ✅ 렌더링 */
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        {/* ------------------- HEADER ------------------- */}
        <ModalHeader>
          구독 상품 변경
          <HStack spacing={3} ml={4}>
            <Text fontSize="sm" color={!isYearly ? "blue.600" : "gray.500"}>
              월간
            </Text>
            <Switch
              colorScheme="blue"
              isChecked={isYearly}
              onChange={(e) => {
                setIsYearly(e.target.checked);
                setSelectedPlan(null); // ✅ 토글 시 선택 초기화
              }}
            />
            <Text fontSize="sm" color={isYearly ? "blue.600" : "gray.500"}>
              연간
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        {/* ------------------- BODY ------------------- */}
        <ModalBody>
          {loading ? (
            <Center py={20}>
              <Spinner size="lg" color="blue.500" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {groupedPlans.map((group) => {
                const plan = isYearly ? group.yearly : group.monthly;
                if (!plan) return null;

                const isCurrent = plan.planName === currentPlan;
                const isSelected = selectedPlan?.id === plan.id;

                return (
                  <Box
                    key={plan.id}
                    borderWidth="1px"
                    borderRadius="xl"
                    p={6}
                    textAlign="center"
                    bg={
                      isCurrent ? "gray.100" : isSelected ? "blue.50" : "white"
                    }
                    borderColor={isSelected ? "blue.400" : "gray.200"}
                    opacity={isCurrent ? 0.6 : 1}
                    cursor={isCurrent ? "not-allowed" : "pointer"}
                    pointerEvents={isCurrent ? "none" : "auto"}
                    transition="0.2s"
                    _hover={{
                      transform: !isCurrent ? "translateY(-3px)" : "none",
                      boxShadow: !isCurrent ? "md" : "none",
                    }}
                    onClick={() => !isCurrent && setSelectedPlan(plan)}
                  >
                    <VStack spacing={3}>
                      <Heading
                        size="sm"
                        color="gray.600"
                        textTransform="capitalize"
                      >
                        {plan.planName}
                      </Heading>

                      <Heading size="2xl" color="blue.600">
                        {plan.price.toLocaleString()}{" "}
                        <Text as="span" fontSize="md" color="gray.500">
                          원 / {isYearly ? "연" : "월"}
                        </Text>
                      </Heading>

                      <Text fontSize="sm" color="gray.600">
                        최대 {plan.maxSuccessResponses.toLocaleString()}회 사용
                        가능
                      </Text>

                      {plan.planName === "growth" && (
                        <Text color="orange.500" fontWeight="bold">
                          인기 플랜 ⭐
                        </Text>
                      )}

                      <Button
                        colorScheme={isCurrent ? "gray" : "blue"}
                        mt={4}
                        w="full"
                        isDisabled={isCurrent}
                      >
                        {isCurrent ? "현재 이용중" : "선택"}
                      </Button>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </ModalBody>

        {/* ------------------- FOOTER ------------------- */}
        <ModalFooter>
          <Flex w="full" justify="flex-end" gap={3}>
            <Button onClick={onClose}>취소</Button>
            <Button
              colorScheme="blue"
              onClick={handleChangePlan}
              isDisabled={!selectedPlan || isSaving}
              isLoading={isSaving}
              loadingText="변경 중..."
            >
              {selectedPlan
                ? `${selectedPlan.planName} (${
                    isYearly ? "연간" : "월간"
                  })로 변경`
                : "플랜 선택"}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
