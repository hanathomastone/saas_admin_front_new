import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/api";

/** ✅ 데이터 타입 정의 */
interface OrganizationSubscription {
  organizationId: number;
  organizationName: string;
  organizationPhoneNumber: string;
  subscriptionPlanId: number;
  subscriptionPlanName: string;
  usageResetDate: string | null;
  subscriptionStartDate: string | null;
  successCount: number;
}

export default function SuperSubscriptionPage() {
  const [data, setData] = useState<OrganizationSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  /** ✅ 날짜 포맷 함수 */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  /** ✅ 데이터 불러오기 */
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<OrganizationSubscription[]>(
        "/admin/organization/organization"
      );
      setData(res.data);
    } catch (err) {
      console.error("❌ 구독정보 불러오기 실패:", err);
      toast({
        title: "구독정보 조회 실패",
        description: "서버에서 데이터를 가져오는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="70vh"
      >
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading size="lg" mb={6}>
        전체 기관 구독정보
      </Heading>

      {data.length === 0 ? (
        <Text textAlign="center" color="gray.500" mt={10}>
          등록된 기관 구독정보가 없습니다.
        </Text>
      ) : (
        <Box overflowX="auto" bg="white" p={4} rounded="md" shadow="sm">
          <Table variant="simple" size="md">
            <Thead bg="gray.100">
              <Tr>
                <Th textAlign="center">기관 ID</Th>
                <Th>기관명</Th>
                <Th>전화번호</Th>
                <Th>구독상품</Th>
                <Th>시작일</Th>
                <Th>리셋일</Th>
                <Th isNumeric>성공 응답 수</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((org) => (
                <Tr key={org.organizationId} _hover={{ bg: "gray.50" }}>
                  <Td textAlign="center" fontWeight="semibold">
                    {org.organizationId}
                  </Td>
                  <Td>{org.organizationName}</Td>
                  <Td>{org.organizationPhoneNumber}</Td>
                  <Td fontWeight="medium" color="blue.600">
                    {org.subscriptionPlanName.toUpperCase()}
                  </Td>
                  <Td>{formatDate(org.subscriptionStartDate)}</Td>
                  <Td>{formatDate(org.usageResetDate)}</Td>
                  <Td isNumeric fontWeight="bold">
                    {org.successCount}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
