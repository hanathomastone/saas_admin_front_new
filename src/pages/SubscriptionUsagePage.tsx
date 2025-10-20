// src/pages/SubscriptionUsagePage.tsx
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Button,
  Spinner,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/api";
import SubscriptionChangeModal from "../components/SubscriptionChangeModal";

interface SubscriptionInfo {
  id?: number;
  organizationId?: number;
  organizationName: string;
  planName: string;
  planCycle: string;
  price: number;
  maxSuccessResponses: number;
  totalSuccessCount: number;
  remainingCount: number;
  usageRate: number;
  subscriptionStartDate?: string;
  usageResetDate?: string;
}

export default function SubscriptionUsagePage() {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgCard = useColorModeValue("white", "gray.800");
  const textGray = useColorModeValue("gray.600", "gray.300");

  /** ✅ 구독 정보 조회 */
  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ response: SubscriptionInfo }>(
        "/subscription/info"
      );
      setInfo(res.data.response);
    } catch (err) {
      console.error("❌ 구독정보 불러오기 실패:", err);
      toast({
        title: "데이터 불러오기 실패",
        description: "서버에서 구독 정보를 불러오지 못했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  /** ✅ 구독 변경 */
  const handlePlanChange = async (
    subscriptionPlanId: number,
    planName: string,
    cycle: "monthly" | "yearly"
  ) => {
    try {
      const organizationId =
        info?.organizationId || Number(localStorage.getItem("organizationId"));
      await api.put(
        `/organizations/${organizationId}/subscription/${subscriptionPlanId}`
      );
      toast({
        title: "구독 변경 완료",
        description: `${planName} (${
          cycle === "monthly" ? "월간" : "연간"
        }) 플랜으로 변경되었습니다.`,
        status: "success",
      });
      await fetchInfo();
      onClose();
    } catch (err) {
      console.error("❌ 구독 변경 실패:", err);
      toast({
        title: "오류 발생",
        description: "구독 변경 중 문제가 발생했습니다.",
        status: "error",
      });
    }
  };

  if (isLoading || !info) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={6} size="lg">
        구독 정보
      </Heading>

      <Box
        bg={bgCard}
        p={8}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="md" mb={1}>
              구독 정보
            </Heading>
            <Text fontSize="sm" color={textGray}>
              현재 구독 상품 및 사용 현황
            </Text>
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            구독 상품 변경하기
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <InfoBox
            title="현재 구독 상품"
            value={info.planName.toUpperCase()}
            color="blue.600"
          />
          <InfoBox
            title="구독 기간"
            value={info.planCycle === "monthly" ? "월간" : "연간"}
            color="green.600"
          />
          <InfoBox
            title="구독 요금"
            value={`${info.price.toLocaleString()} 원`}
            color="teal.600"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
          <InfoBox
            title="제공량"
            value={info.maxSuccessResponses?.toLocaleString() ?? "-"}
          />
          <InfoBox
            title="사용량"
            value={info.totalSuccessCount?.toLocaleString() ?? "-"}
            color="orange.600"
          />
          <InfoBox
            title="잔여량"
            value={info.remainingCount?.toLocaleString() ?? "-"}
            color="purple.600"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
          <InfoBox
            title="사용률"
            value={`${info.usageRate?.toFixed(1) ?? 0}%`}
            color="blue.600"
          />
          <InfoBox
            title="구독 시작일"
            value={
              info.subscriptionStartDate
                ? new Date(info.subscriptionStartDate).toLocaleDateString()
                : "-"
            }
          />
          <InfoBox
            title="갱신일"
            value={
              info.usageResetDate
                ? new Date(info.usageResetDate).toLocaleDateString()
                : "-"
            }
          />
        </SimpleGrid>

        <SubscriptionChangeModal
          isOpen={isOpen}
          onClose={onClose}
          currentPlan={info.planName}
          onConfirm={handlePlanChange}
        />
      </Box>
    </Box>
  );
}

function InfoBox({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Box
      p={5}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
      textAlign="center"
    >
      <Text fontWeight="medium" color="gray.600">
        {title}
      </Text>
      <Text fontSize="xl" fontWeight="bold" color={color || "gray.800"}>
        {value}
      </Text>
    </Box>
  );
}
