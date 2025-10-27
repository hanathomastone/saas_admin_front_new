import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Button,
  Spinner,
  Progress,
  useColorModeValue,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import SubscriptionChangeModal from "../components/SubscriptionChangeModal";

/** ✅ 일반 관리자용 구독정보 */
interface UserItem {
  userId: number;
  userName: string;
  successCount: number;
}

interface SubscriptionInfo {
  organizationId: number;
  organizationName: string;
  planName: string;
  planCycle: string;
  price: number;
  maxSuccessResponses: number;
  totalSuccessCount: number;
  remainingCount: number;
  usageRate: number;
  subscriptionStartDate?: string | null;
  usageResetDate?: string | null;
  users: UserItem[];
}

/** ✅ 슈퍼관리자용 구독정보 */
interface SuperSubscriptionInfo {
  id: number;
  organizationName: string;
  planName: string;
  planCycle: string;
  maxSuccessResponses: number;
  successCount: number;
  usageRate: number;
  periodStart: string;
  periodEnd: string;
  active: boolean;
}

export default function SubscriptionUsagePage() {
  const { t } = useTranslation();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [superList, setSuperList] = useState<SuperSubscriptionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgCard = useColorModeValue("white", "gray.800");
  const textGray = useColorModeValue("gray.600", "gray.300");

  /** ✅ 구독 정보 조회 */
  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      const role = localStorage.getItem("adminIsSuper");
      setIsSuperAdmin(role === "Y");

      if (role === "Y") {
        // ✅ 슈퍼관리자: 전체 기관 구독정보
        const res = await api.get<SuperSubscriptionInfo[]>(
          "/admin/organization/organization"
        );
        setSuperList(res.data);
      } else {
        // ✅ 일반관리자: 본인 기관 구독정보
        const res = await api.get<SubscriptionInfo>("/admin/statistic/me");
        setInfo(res.data);
      }
    } catch (err) {
      console.error("❌ 구독정보 불러오기 실패:", err);
      toast({
        title: t("subscriptionUsage.toast.failTitle"),
        description: t("subscriptionUsage.toast.failMsg"),
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
  const handlePlanChange = async (subscriptionPlanId: number) => {
    try {
      const organizationId =
        info?.organizationId ?? localStorage.getItem("organizationId");

      if (!organizationId) {
        toast({
          title: t("subscriptionUsage.toast.orgErrorTitle"),
          description: t("subscriptionUsage.toast.orgErrorMsg"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const res = await api.put(
        `/admin/subscriptions/organization/${organizationId}/${subscriptionPlanId}`
      );
      const updated = res.data?.response ?? res.data;

      toast({
        title: t("subscriptionUsage.toast.changeSuccessTitle"),
        description: t("subscriptionUsage.toast.changeSuccessMsg", {
          plan: updated.subscriptionPlanName,
        }),
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setInfo((prev) =>
        prev
          ? {
              ...prev,
              planName: updated.subscriptionPlanName ?? prev.planName,
              subscriptionStartDate:
                updated.subscriptionStartDate ?? prev.subscriptionStartDate,
              usageResetDate: updated.usageResetDate ?? prev.usageResetDate,
              totalSuccessCount: updated.successCount ?? 0,
              remainingCount:
                (prev.maxSuccessResponses ?? 0) - (updated.successCount ?? 0),
              usageRate: 0,
              users:
                prev.users?.map((u) => ({
                  ...u,
                  successCount: 0,
                })) ?? [],
            }
          : prev
      );

      onClose();
    } catch (err) {
      console.error("❌ 구독 변경 실패:", err);
      toast({
        title: t("subscriptionUsage.toast.changeFailTitle"),
        description: t("subscriptionUsage.toast.changeFailMsg"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr.split(".")[0]).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  /** ✅ 슈퍼관리자 화면 */
  if (isSuperAdmin) {
    return (
      <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
        <Heading mb={6} size="lg">
          전체 기관 구독 현황
        </Heading>
        <Table variant="simple" bg="white" rounded="md" shadow="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>기관명</Th>
              <Th>상품명</Th>
              <Th>주기</Th>
              <Th>최대 응답수</Th>
              <Th>사용 횟수</Th>
              <Th>사용률</Th>
              <Th>시작일</Th>
              <Th>종료일</Th>
              <Th>활성</Th>
            </Tr>
          </Thead>
          <Tbody>
            {superList.map((item) => (
              <Tr key={item.id}>
                <Td>{item.organizationName}</Td>
                <Td>{item.planName || "-"}</Td>
                <Td>{item.planCycle}</Td>
                <Td>{item.maxSuccessResponses}</Td>
                <Td>{item.successCount}</Td>
                <Td>{(item.usageRate * 100).toFixed(1)}%</Td>
                <Td>{formatDate(item.periodStart)}</Td>
                <Td>{formatDate(item.periodEnd)}</Td>
                <Td>{item.active ? "✅" : "❌"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  }

  /** ✅ 일반관리자 화면 (기존 유지) */
  if (!info) return null;

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={6} size="lg">
        {t("subscriptionUsage.title")}
      </Heading>
      <Box
        bg={bgCard}
        p={{ base: 4, md: 8 }}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          mb={6}
          gap={3}
        >
          <Box>
            <Heading size="md" mb={1}>
              {t("subscriptionUsage.subTitle")}
            </Heading>
            <Text fontSize="sm" color={textGray}>
              {t("subscriptionUsage.desc")}
            </Text>
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            {t("subscriptionUsage.changeBtn")}
          </Button>
        </Flex>

        {/* ✅ 기존 일반 관리자 UI 유지 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <InfoBox
            title={t("subscriptionUsage.currentPlan")}
            value={info.planName?.toUpperCase() ?? "-"}
            color="blue.600"
          />
          <InfoBox
            title={t("subscriptionUsage.planCycle")}
            value={
              info.planCycle === "monthly"
                ? t("subscriptionUsage.monthly")
                : t("subscriptionUsage.yearly")
            }
            color="green.600"
          />
          <InfoBox
            title={t("subscriptionUsage.price")}
            value={`${info.price?.toLocaleString() ?? 0} 원`}
            color="teal.600"
          />
        </SimpleGrid>

        {/* ✅ 사용자별 응답 현황 */}
        <Box mt={10}>
          <Heading size="md" mb={4}>
            {t("subscriptionUsage.userStats")}
          </Heading>
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>{t("subscriptionUsage.userName")}</Th>
                <Th textAlign="right">{t("subscriptionUsage.responses")}</Th>
                <Th textAlign="right">{t("subscriptionUsage.ratio")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {info.users?.map((user) => {
                const userRate =
                  info.totalSuccessCount > 0
                    ? (user.successCount / info.totalSuccessCount) * 100
                    : 0;
                return (
                  <Tr key={user.userId}>
                    <Td fontWeight="medium">{user.userName}</Td>
                    <Td textAlign="right">{user.successCount}</Td>
                    <Td>
                      <Box>
                        <Progress
                          value={userRate}
                          colorScheme={
                            userRate < 30
                              ? "blue"
                              : userRate < 70
                              ? "yellow"
                              : "red"
                          }
                          rounded="md"
                          height="6px"
                          w="100%"
                        />
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          textAlign="right"
                          mt={1}
                        >
                          {userRate.toFixed(1)}%
                        </Text>
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

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

/** ✅ InfoBox 컴포넌트 그대로 사용 */
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
