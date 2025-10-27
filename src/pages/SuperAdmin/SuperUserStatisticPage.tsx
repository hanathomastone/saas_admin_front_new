import {
  Box,
  Heading,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/api";

interface OrgStatistic {
  organizationId: number;
  organizationName: string;
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  newUsers: number;
}

const COLORS = ["#4C6EF5", "#F783AC", "#51CF66", "#FF922B"];

export default function SuperUserStatisticPage() {
  const [stats, setStats] = useState<OrgStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/statistic/all");
      const result = res.data.response ?? res.data;
      setStats(result);
      console.log("📊 Stats data:", result);
    } catch (err) {
      console.error("❌ 전체 통계 조회 실패:", err);
      toast({
        title: "통계 조회 실패",
        description: "서버에서 데이터를 가져오지 못했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="70vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  const totalSummary = {
    totalUsers: stats.reduce((a, c) => a + c.totalUsers, 0),
    maleUsers: stats.reduce((a, c) => a + c.maleUsers, 0),
    femaleUsers: stats.reduce((a, c) => a + c.femaleUsers, 0),
    newUsers: stats.reduce((a, c) => a + c.newUsers, 0),
  };

  const genderPieData = [
    { name: "남성", value: totalSummary.maleUsers },
    { name: "여성", value: totalSummary.femaleUsers },
  ];

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={8} size="lg" color="blue.700">
        전체 기관 사용자 대시보드
      </Heading>

      {/* ✅ 요약 카드 */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
        <SummaryCard
          title="전체 사용자"
          value={totalSummary.totalUsers}
          color="blue.500"
        />
        <SummaryCard
          title="남성 사용자"
          value={totalSummary.maleUsers}
          color="teal.500"
        />
        <SummaryCard
          title="여성 사용자"
          value={totalSummary.femaleUsers}
          color="pink.500"
        />
        <SummaryCard
          title="신규 가입 (30일)"
          value={totalSummary.newUsers}
          color="orange.500"
        />
      </SimpleGrid>

      {/* ✅ 그래프 영역 */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
        {/* BarChart */}
        <Card shadow="md" bg="white" border="1px solid #EDF2F7">
          <CardHeader fontWeight="bold" color="gray.700">
            기관별 전체 사용자 & 신규가입자 수
          </CardHeader>
          <CardBody minH="320px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="organizationName"
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalUsers" fill="#4C6EF5" name="전체 사용자" />
                <Bar dataKey="newUsers" fill="#51CF66" name="신규가입 (30일)" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* PieChart */}
        <Card shadow="md" bg="white" border="1px solid #EDF2F7">
          <CardHeader fontWeight="bold" color="gray.700">
            전체 성별 비율
          </CardHeader>
          <CardBody minH="320px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genderPieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* ✅ 테이블 */}
      <Box bg="white" rounded="md" shadow="sm" p={4} overflowX="auto">
        <Heading size="md" mb={4} color="gray.700">
          기관별 상세 통계
        </Heading>
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>기관명</Th>
              <Th isNumeric>전체 사용자</Th>
              <Th isNumeric>남성</Th>
              <Th isNumeric>여성</Th>
              <Th isNumeric>신규가입(30일)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.map((org) => (
              <Tr key={org.organizationId}>
                <Td fontWeight="medium">{org.organizationName}</Td>
                <Td isNumeric>{org.totalUsers}</Td>
                <Td isNumeric color="blue.600">
                  {org.maleUsers}
                </Td>
                <Td isNumeric color="pink.600">
                  {org.femaleUsers}
                </Td>
                <Td isNumeric fontWeight="semibold" color="green.600">
                  {org.newUsers}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

/** ✅ 요약 카드 컴포넌트 */
function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <Card bg="white" shadow="sm" border="1px solid #E2E8F0">
      <CardBody textAlign="center">
        <Text fontSize="sm" color="gray.500">
          {title}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color={color ?? "gray.800"}>
          {value.toLocaleString()}
        </Text>
      </CardBody>
    </Card>
  );
}
