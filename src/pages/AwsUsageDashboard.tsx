import {
  Box,
  Grid,
  Heading,
  Spinner,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Select,
  Flex,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/api";

interface MetricPoint {
  timestamp: string;
  value: number;
}

interface ResourceMetric {
  resourceType: string;
  metricName: string;
  points: MetricPoint[];
}

interface AwsMetricsResponse {
  metrics: ResourceMetric[];
}
type RangeType = "1h" | "6h" | "24h";
export default function AwsMetricsDashboard() {
  const toast = useToast();
  const [data, setData] = useState<AwsMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeType>("1h");

  // ✅ 단위 변환 함수
  const formatValue = (metric: string, value: number) => {
    if (value === 0 || value == null) return "0";
    if (metric.includes("CPU") || metric.includes("Memory")) {
      return `${value.toFixed(2)}%`;
    }
    if (metric.includes("Network")) {
      return value > 1024 * 1024
        ? `${(value / 1024 / 1024).toFixed(2)} MB`
        : `${(value / 1024).toFixed(2)} KB`;
    }
    if (metric.includes("Storage") || metric.includes("BucketSize")) {
      return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
    return value.toFixed(2);
  };

  // ✅ 평균 계산 함수
  const getAverage = (points: MetricPoint[]) => {
    if (!points || points.length === 0) return 0;
    const sum = points.reduce((acc, p) => acc + p.value, 0);
    return sum / points.length;
  };

  // ✅ 데이터 요청
  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const res = await api.get("/api/aws/metrics/summary", {
          params: {
            ec2InstanceId: "i-00de45ec7525e7e38",
            rdsInstanceId: "aurora-denti-global-dev",
            s3BucketName: "denti-global-singapore",
            range: range, // (백엔드가 지원하지 않아도 무시됨)
          },
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
        toast({
          title: "AWS 메트릭 조회 실패",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [range]);

  // ✅ 로딩 중
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>AWS 리소스 현황 불러오는 중...</Text>
      </Box>
    );
  }

  // ✅ 데이터 없음
  if (!data || !data.metrics || data.metrics.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text>표시할 데이터가 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">AWS 리소스 현황 대시보드</Heading>

        {/* ✅ 조회 기간 선택 */}
        <Select
          w="150px"
          value={range}
          onChange={(e) => setRange(e.target.value as RangeType)}
        >
          <option value="1h">최근 1시간</option>
          <option value="6h">최근 6시간</option>
          <option value="24h">최근 24시간</option>
        </Select>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        {data.metrics.map((metric, idx) => {
          const chartData = metric.points.map((p) => ({
            time: new Date(p.timestamp).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: p.value,
          }));

          const avg = getAverage(metric.points);
          const avgDisplay = formatValue(metric.metricName, avg);

          return (
            <Card key={idx} boxShadow="md" borderRadius="xl" p={2}>
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" fontSize="lg">
                    {metric.resourceType} — {metric.metricName}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    평균: {avgDisplay}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis
                        tickFormatter={(v) =>
                          metric.metricName.includes("Network")
                            ? `${(v / 1024).toFixed(0)}K`
                            : v.toFixed(0)
                        }
                      />
                      <Tooltip
                        formatter={(v) =>
                          formatValue(metric.metricName, v as number)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3182CE"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">데이터가 없습니다.</Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          );
        })}
      </Grid>
    </Box>
  );
}
