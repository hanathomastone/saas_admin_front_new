import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api"; // ✅ axios 인스턴스

interface UserItem {
  userId: number;
  userName: string;
  successCount: number;
}

interface UsageData {
  organizationName: string;
  planName: string;
  planCycle: string;
  price: number;
  maxSuccessResponses: number;
  totalSuccessCount: number;
  remainingCount: number;
  usageRate: number;
  subscriptionStartDate: string | null;
  usageResetDate: string | null;
  users: UserItem[];
}

export default function ServiceUsageDashboard() {
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const res = await api.get("/admin/statistic/me"); // ✅ 실제 API 호출
      setData(res.data);
    } catch (error) {
      console.error("사용량 정보 조회 실패:", error);
    }
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Heading size="lg" mb={6}>
        기관 사용량 현황
      </Heading>

      {/* 상단 요약 카드 */}
      {data && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">
                기관명
              </Text>
              <Heading size="md" mt={1}>
                {data.organizationName}
              </Heading>
              <Text fontSize="sm" mt={2} color="gray.500">
                구독 플랜:{" "}
                <Badge colorScheme="blue" ml={2}>
                  {data.planName} ({data.planCycle})
                </Badge>
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">
                사용량
              </Text>
              <Heading size="md" mt={1}>
                {data.totalSuccessCount} / {data.maxSuccessResponses}
              </Heading>
              <Progress
                mt={3}
                value={data.usageRate}
                colorScheme={data.usageRate > 80 ? "red" : "blue"}
                rounded="md"
              />
              <Text fontSize="xs" color="gray.500" mt={2}>
                사용률 {data.usageRate.toFixed(1)}%
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">
                잔여량
              </Text>
              <Heading size="md" mt={1}>
                {data.remainingCount}
              </Heading>
              <Badge
                mt={2}
                colorScheme={data.remainingCount > 0 ? "green" : "red"}
              >
                {data.remainingCount > 0 ? "정상" : "초과"}
              </Badge>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* 사용자별 응답수 테이블 */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            사용자별 응답 현황
          </Heading>

          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>사용자 ID</Th>
                <Th>이름</Th>
                <Th>응답 수</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.users.map((user) => (
                <Tr key={user.userId}>
                  <Td>{user.userId}</Td>
                  <Td>{user.userName}</Td>
                  <Td>{user.successCount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}
