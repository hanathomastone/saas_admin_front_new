import {
  Box,
  Heading,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Progress,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../../api/api";

interface OrganizationUsage {
  organizationId: number;
  organizationName: string;
  planName: string;
  maxSuccessResponses: number;
  successCount: number;
  remainingCount: number;
  usageRate: number;
}

export default function SuperOrganizationUsagePage() {
  const [data, setData] = useState<OrganizationUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // ✅ 모든 Hook은 최상단에서 선언
  const cardBg = useColorModeValue("white", "gray.800");
  const chartColor = useColorModeValue("#3182CE", "#63B3ED");

  /** ✅ 기관별 사용량 조회 */
  const fetchUsage = async () => {
    try {
      const res = await api.get("/admin/organization/usage");
      const result = res.data?.response ?? res.data;
      setData(result);
    } catch (err) {
      console.error("❌ 기관별 사용량 불러오기 실패:", err);
      toast({
        title: "데이터 로드 실패",
        description: "기관별 사용량 정보를 불러오는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={6} size="lg">
        기관별 사용량 현황
      </Heading>

      {/* ✅ 그래프 영역 */}
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
        mb={10}
      >
        <Heading size="md" mb={4}>
          기관별 사용량 그래프
        </Heading>
        <Box h="350px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="organizationName" />
              <YAxis />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="usageRate" fill={chartColor} name="사용률(%)" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* ✅ 상세 테이블 */}
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Heading size="md" mb={4}>
          기관별 사용량 상세
        </Heading>

        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>기관명</Th>
              <Th>플랜명</Th>
              <Th isNumeric>최대 응답 수</Th>
              <Th isNumeric>사용 수</Th>
              <Th isNumeric>남은 수</Th>
              <Th isNumeric>사용률</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((org) => (
              <Tr key={org.organizationId}>
                <Td fontWeight="medium">{org.organizationName}</Td>
                <Td>{org.planName}</Td>
                <Td isNumeric>{org.maxSuccessResponses.toLocaleString()}</Td>
                <Td isNumeric>{org.successCount.toLocaleString()}</Td>
                <Td isNumeric>{org.remainingCount.toLocaleString()}</Td>
                <Td isNumeric>
                  <Box>
                    <Progress
                      value={org.usageRate}
                      colorScheme={
                        org.usageRate < 30
                          ? "green"
                          : org.usageRate < 70
                          ? "yellow"
                          : "red"
                      }
                      rounded="md"
                      h="6px"
                      mb={1}
                    />
                    <Text fontSize="sm" color="gray.600">
                      {org.usageRate.toFixed(2)}%
                    </Text>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
