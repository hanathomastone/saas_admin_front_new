import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  Spinner,
  useToast,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import api from "../api/api";

interface OralCheckStat {
  oralCheckResultType: string;
  count: number;
  countHealthy: number;
  countGood: number;
  countAttention: number;
  countDanger: number;
}

interface StatisticResponse {
  organizationName: string;
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  newUsers: number;
  oralCheckStats: OralCheckStat[];
}

export default function UserStatisticsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatisticResponse | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const COLORS = ["#4F9BFF", "#FF9DB1"];

  // ✅ 통계 데이터 불러오기
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await api.get<StatisticResponse>(
        `/admin/statistic/org/users?${params}`
      );
      setData(res.data);
    } catch (error) {
      console.error("❌ 통계 조회 실패:", error);
      toast({
        title: t("userStats.toast.fail"),
        description: t("userStats.toast.failDetail"),
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // ✅ 빠른 기간 선택
  const handleQuickSelect = (days: number | "all") => {
    const now = new Date();
    if (days === "all") {
      setStartDate("");
      setEndDate("");
      return;
    }
    const start = new Date();
    start.setDate(now.getDate() - days);
    setStartDate(start.toISOString().slice(0, 10));
    setEndDate(now.toISOString().slice(0, 10));
  };

  if (loading || !data) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  // ✅ 그래프 데이터 구성
  const genderData = [
    { name: t("userStats.gender.male"), value: data.maleUsers },
    { name: t("userStats.gender.female"), value: data.femaleUsers },
  ];

  const manRate = (data.maleUsers / data.totalUsers) * 100 || 0;
  const womanRate = (data.femaleUsers / data.totalUsers) * 100 || 0;

  const oralStat = data.oralCheckStats[0] || {
    countHealthy: 0,
    countGood: 0,
    countAttention: 0,
    countDanger: 0,
  };

  const gumStatusData = [
    { name: t("userStats.gum.healthy"), value: oralStat.countHealthy },
    { name: t("userStats.gum.good"), value: oralStat.countGood },
    { name: t("userStats.gum.attention"), value: oralStat.countAttention },
    { name: t("userStats.gum.danger"), value: oralStat.countDanger },
  ];

  return (
    <Box bg="gray.50" minH="100vh" p={{ base: 4, md: 8 }}>
      {/* 🔍 검색 조건 */}
      <Box
        bg="white"
        p={6}
        rounded="lg"
        shadow="md"
        mb={8}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
          <Text fontWeight="bold" fontSize="md">
            {t("userStats.period.title")}
          </Text>

          <Flex gap={2} flexWrap="wrap">
            <Button size="sm" onClick={() => handleQuickSelect(0)}>
              {t("userStats.period.today")}
            </Button>
            <Button size="sm" onClick={() => handleQuickSelect(7)}>
              {t("userStats.period.week")}
            </Button>
            <Button size="sm" onClick={() => handleQuickSelect(30)}>
              {t("userStats.period.month")}
            </Button>
            <Button size="sm" onClick={() => handleQuickSelect(90)}>
              {t("userStats.period.quarter")}
            </Button>
            <Button size="sm" onClick={() => handleQuickSelect(365)}>
              {t("userStats.period.year")}
            </Button>
            <Button size="sm" onClick={() => handleQuickSelect("all")}>
              {t("userStats.period.all")}
            </Button>

            <Input
              type="date"
              w="150px"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Text>~</Text>
            <Input
              type="date"
              w="150px"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t("common.reset")}
            </Button>
            <Button colorScheme="blue" onClick={fetchStatistics}>
              {t("common.search")}
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* 📊 상단 요약 */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
        mb={6}
        alignItems="stretch"
      >
        {/* 전체 남녀 가입률 */}
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4} textAlign="center">
            {t("userStats.genderDistribution")}
          </Heading>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 80 : 100}
                dataKey="value"
                label
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* 가입자 수 카드 */}
        <Grid gap={4}>
          <Box bg="white" rounded="lg" shadow="sm" p={6} textAlign="center">
            <Text fontWeight="bold">{t("userStats.totalUsers")}</Text>
            <Text fontSize="2xl" fontWeight="bold" mt={2}>
              {data.totalUsers}
            </Text>
          </Box>

          <Box bg="white" rounded="lg" shadow="sm" p={6} textAlign="center">
            <Text fontWeight="bold">{t("userStats.maleUsers")}</Text>
            <Text fontSize="2xl" color="blue.500" fontWeight="bold" mt={2}>
              {data.maleUsers} ({manRate.toFixed(1)}%)
            </Text>
          </Box>

          <Box bg="white" rounded="lg" shadow="sm" p={6} textAlign="center">
            <Text fontWeight="bold">{t("userStats.femaleUsers")}</Text>
            <Text fontSize="2xl" color="pink.500" fontWeight="bold" mt={2}>
              {data.femaleUsers} ({womanRate.toFixed(1)}%)
            </Text>
          </Box>
        </Grid>
      </Grid>

      {/* 하단 구강검사 상태 그래프 */}
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="md" mb={4}>
          {t("userStats.gumDistribution")}
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gumStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F9BFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
