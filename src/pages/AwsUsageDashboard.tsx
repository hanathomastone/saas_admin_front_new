import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Select,
  Card,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Text,
  Spinner,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface MetricPoint {
  time: string;
  value: number;
}

export default function AwsUsageDashboard() {
  const [ec2Cpu, setEc2Cpu] = useState<MetricPoint[]>([]);
  const [rdsCpu, setRdsCpu] = useState<MetricPoint[]>([]);
  const [network, setNetwork] = useState<
    { time: string; in: number; out: number }[]
  >([]);
  const [s3, setS3] = useState<{ time: string; size: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("Year");

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ec2, rds, netIn, netOut, s3data] = await Promise.all([
          axios.get<MetricPoint[]>(
            "/api/aws/metrics/ec2/cpu?instanceId=i-00de45ec7525e7e38"
          ),
          axios.get<MetricPoint[]>(
            "/api/aws/metrics/rds/cpu?dbInstanceId=mydb-instance"
          ),
          axios.get<MetricPoint[]>(
            "/api/aws/metrics/ec2/network-in?instanceId=i-00de45ec7525e7e38"
          ),
          axios.get<MetricPoint[]>(
            "/api/aws/metrics/ec2/network-out?instanceId=i-00de45ec7525e7e38"
          ),
          axios.get<MetricPoint[]>(
            "/api/aws/metrics/s3/bucket-size?bucketName=my-s3-bucket"
          ),
        ]);

        const networkMerged = netIn.data.map((item, i) => ({
          time: item.time,
          in: item.value,
          out: netOut.data[i]?.value ?? 0,
        }));

        const s3mapped = s3data.data.map((d) => ({
          time: d.time,
          size: d.value / 1024 ** 3, // bytes → GB
        }));

        setEc2Cpu(ec2.data);
        setRdsCpu(rds.data);
        setNetwork(networkMerged);
        setS3(s3mapped);
      } catch (err) {
        console.error("메트릭 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (t: string) =>
    new Date(t).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });

  // 마지막 값 가져오기
  const lastValue = (arr: MetricPoint[]) =>
    arr.length ? arr[arr.length - 1].value.toFixed(2) : "-";

  const lastGB = (arr: { size: number }[]) =>
    arr.length ? arr.slice(-1)[0].size.toFixed(2) + " GB" : "-";

  return (
    <Box bg="#F7FAFC" minH="100vh" p={10}>
      <Heading mb={8}>AWS Usage Dashboard</Heading>

      {loading ? (
        <Flex align="center" justify="center" h="60vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex flexDir="column" gap={10}>
          {/* 상단 KPI 카드 */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card p={6} borderRadius="xl" shadow="sm" bg="white">
              <Stat>
                <StatLabel>EC2 CPU Utilization</StatLabel>
                <StatNumber color="blue.500" fontSize="2xl">
                  {lastValue(ec2Cpu)}%
                </StatNumber>
              </Stat>
            </Card>

            <Card p={6} borderRadius="xl" shadow="sm" bg="white">
              <Stat>
                <StatLabel>RDS CPU Utilization</StatLabel>
                <StatNumber color="green.500" fontSize="2xl">
                  {lastValue(rdsCpu)}%
                </StatNumber>
              </Stat>
            </Card>

            <Card p={6} borderRadius="xl" shadow="sm" bg="white">
              <Stat>
                <StatLabel>S3 Bucket Size</StatLabel>
                <StatNumber color="orange.400" fontSize="2xl">
                  {lastGB(s3)}
                </StatNumber>
              </Stat>
            </Card>
          </SimpleGrid>

          {/* LINE CHART */}
          <Card p={6} borderRadius="2xl" shadow="sm" bg="white">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Text fontWeight="bold" color="gray.600">
                  LINE CHART
                </Text>
                <Text fontSize="sm" color="gray.500">
                  EC2 & RDS CPU Utilization
                </Text>
              </Box>
              <Select
                w="120px"
                size="sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option>Year</option>
                <option>Month</option>
                <option>Week</option>
              </Select>
            </Flex>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ec2Cpu}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                <XAxis dataKey="time" tickFormatter={formatTime} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  data={ec2Cpu}
                  name="EC2 CPU (%)"
                  stroke="#3182CE"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  data={rdsCpu}
                  name="RDS CPU (%)"
                  stroke="#38A169"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* STACKED BAR CHART */}
          <Card p={6} borderRadius="2xl" shadow="sm" bg="white">
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Text fontWeight="bold" color="gray.600">
                  STACKED BAR CHART
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Network I/O (In/Out) & S3 Bucket Size
                </Text>
              </Box>
              <Select
                w="120px"
                size="sm"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option>Year</option>
                <option>Month</option>
                <option>Week</option>
              </Select>
            </Flex>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={network}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                <XAxis dataKey="time" tickFormatter={formatTime} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="in"
                  name="Network In (Bytes)"
                  stackId="a"
                  fill="#63B3ED"
                />
                <Bar
                  dataKey="out"
                  name="Network Out (Bytes)"
                  stackId="a"
                  fill="#4299E1"
                />
                {/* s3 크기 추가 시 별도 데이터 머지 가능 */}
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Flex>
      )}
    </Box>
  );
}
