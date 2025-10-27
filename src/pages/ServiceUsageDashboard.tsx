import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Card,
  CardBody,
  Center,
  Spinner,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface UsageItem {
  userId: number;
  userName: string;
  userPhoneNumber: string;
  organizationName: string;
  serviceName: string;
  successCount: number;
}

export default function ServiceUsageByUser() {
  const { t } = useTranslation();
  const [data, setData] = useState<UsageItem[]>([]);
  const [filteredData, setFilteredData] = useState<UsageItem[]>([]);
  const [selectedService, setSelectedService] = useState<
    "ALL" | "PLAQUE" | "PERIODONTAL"
  >("ALL");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const COLORS = ["#3182CE", "#E53E3E"];

  const paddingX = useBreakpointValue({ base: 4, md: 8 });

  useEffect(() => {
    fetchOrganizationAndUsage();
  }, []);

  const fetchOrganizationAndUsage = async () => {
    try {
      const orgRes = await api.get("/admin/statistic/me");
      const orgName = orgRes.data.organizationName;
      setOrganizationName(orgName);

      const usageRes = await api.get("/admin/users/usage");
      const allData: UsageItem[] = usageRes.data;

      const orgFiltered = allData.filter(
        (item) => item.organizationName === orgName
      );

      setData(orgFiltered);
      setFilteredData(orgFiltered);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "❌ 데이터 조회 실패:",
          error.response?.data || error.message
        );
      } else {
        console.error("❌ 알 수 없는 에러:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (service: "ALL" | "PLAQUE" | "PERIODONTAL") => {
    setSelectedService(service);
    if (service === "ALL") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.serviceName === service));
    }
  };

  if (loading) {
    return (
      <Center minH="80vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!organizationName) {
    return (
      <Center minH="80vh">
        <Text color="gray.500">{t("usage.noOrg")}</Text>
      </Center>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Center minH="80vh">
        <Text color="gray.500">{t("usage.noData")}</Text>
      </Center>
    );
  }

  const aggregated = Object.values(
    filteredData.reduce((acc, curr) => {
      if (!acc[curr.userName]) {
        acc[curr.userName] = { userName: curr.userName, successCount: 0 };
      }
      acc[curr.userName].successCount += curr.successCount;
      return acc;
    }, {} as Record<string, { userName: string; successCount: number }>)
  );

  const pieData = Object.values(
    data.reduce((acc, curr) => {
      if (!acc[curr.serviceName]) {
        acc[curr.serviceName] = { name: curr.serviceName, value: 0 };
      }
      acc[curr.serviceName].value += curr.successCount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return (
    <Box p={paddingX} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Heading size="lg">
          {organizationName} {t("usage.title")}
        </Heading>

        {/* ✅ 서비스별 비율 (PieChart) */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              {t("usage.chartTitle")}
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ✅ 서비스 필터 버튼 */}
        <ButtonGroup flexWrap="wrap">
          <Button
            colorScheme={selectedService === "ALL" ? "blue" : "gray"}
            onClick={() => handleFilterChange("ALL")}
          >
            {t("usage.all")}
          </Button>
          <Button
            colorScheme={selectedService === "PLAQUE" ? "blue" : "gray"}
            onClick={() => handleFilterChange("PLAQUE")}
          >
            {t("usage.plaque")}
          </Button>
          <Button
            colorScheme={selectedService === "PERIODONTAL" ? "blue" : "gray"}
            onClick={() => handleFilterChange("PERIODONTAL")}
          >
            {t("usage.periodontal")}
          </Button>
        </ButtonGroup>

        {/* ✅ 사용자별 사용량 BarChart */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              {t("usage.barChartTitle")}
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={aggregated.slice(0, 10)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="userName" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="successCount"
                  fill="#3182CE"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ✅ 상세 테이블 */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              {t("usage.tableTitle")}
            </Heading>
            <Table variant="simple" fontSize={{ base: "sm", md: "md" }}>
              <Thead bg="gray.100">
                <Tr>
                  <Th>{t("usage.rank")}</Th>
                  <Th>{t("usage.name")}</Th>
                  <Th>{t("usage.phone")}</Th>
                  <Th>{t("usage.org")}</Th>
                  <Th>{t("usage.service")}</Th>
                  <Th>{t("usage.count")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.slice(0, 10).map((item, index) => (
                  <Tr key={`${item.userId}-${item.serviceName}`}>
                    <Td>{index + 1}</Td>
                    <Td>{item.userName}</Td>
                    <Td>{item.userPhoneNumber || "-"}</Td>
                    <Td>{item.organizationName}</Td>
                    <Td>{item.serviceName}</Td>
                    <Td>{item.successCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
