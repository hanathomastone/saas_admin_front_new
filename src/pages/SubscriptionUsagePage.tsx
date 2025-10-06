import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
  SimpleGrid,
  Button,
  Spinner,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

interface UserItem {
  userId: number;
  userName: string;
  successCount: number;
}

interface SubscriptionInfo {
  organizationName: string;
  planName: string;
  planCycle: string;
  price: number;
  maxSuccessResponses: number;
  totalSuccessCount: number;
  remainingCount: number;
  usageRate: number;
  users: UserItem[];
}

export default function SubscriptionUsagePage() {
  const [data, setData] = useState<SubscriptionInfo | null>(null);
  const navigate = useNavigate();

  const blueShades = [
    "#E9F0FF",
    "#DAE6FF",
    "#B5CCFF",
    "#90B3FF",
    "#6B99FF",
    "#4680FF",
    "#2281DF",
    "#1C76DA",
    "#176CD6",
    "#0D59CF",
  ];

  const bgCard = useColorModeValue("white", "gray.800");
  const textGray = useColorModeValue("gray.600", "gray.300");

  // ✅ 구독 정보 불러오기
  useEffect(() => {
    api
      .get<{ response: SubscriptionInfo }>("/subscription/info")
      .then((res) => setData(res.data.response))
      .catch((err) => console.error("❌ 구독정보 불러오기 실패:", err));
  }, []);

  // ✅ 구독상품 변경 페이지로 이동
  const handleChangePlan = () => {
    navigate("/admin/subscription/edit");
  };

  if (!data) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  // ✅ 사용자 상위 10명 기준 정렬
  const sortedUsers = [...data.users]
    .sort((a, b) => b.successCount - a.successCount)
    .slice(0, 10);

  // ✅ 색상 점진 적용 (상위 사용자가 진한 색)
  const getColor = (index: number): string => {
    if (sortedUsers.length <= 1) return blueShades[blueShades.length - 1];
    const reversedIndex =
      blueShades.length - 1 - Math.floor((index / 9) * (blueShades.length - 1));
    return blueShades[reversedIndex];
  };

  interface BarShapeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
  }

  const CustomBarShape = (props: BarShapeProps) => {
    const { x, y, width, height, index } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getColor(index)}
        rx={4}
      />
    );
  };

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={6} size="lg">
        구독 정보
      </Heading>

      {/* 📦 구독 요약 카드 */}
      <Box
        bg={bgCard}
        p={6}
        rounded="xl"
        shadow="sm"
        mb={8}
        border="1px solid"
        borderColor="gray.100"
      >
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {data.organizationName}
        </Text>
        <Text color={textGray} mb={1}>
          요금제: <b>{data.planName}</b> ({data.planCycle})
        </Text>
        <Text color={textGray} mb={1}>
          월 요금: <b>{data.price.toLocaleString()}원</b>
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
          <Box
            bg="blue.50"
            p={4}
            rounded="md"
            border="1px solid"
            borderColor="blue.100"
          >
            <Text fontWeight="bold" color="blue.700">
              구독 상품
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              {data.planName.toUpperCase()}
            </Text>
          </Box>

          <Box
            bg="green.50"
            p={4}
            rounded="md"
            border="1px solid"
            borderColor="green.100"
          >
            <Text fontWeight="bold" color="green.700">
              구독 기간
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="green.600">
              {data.planCycle === "monthly" ? "월간" : "연간"}
            </Text>
          </Box>

          <Box
            bg="purple.50"
            p={4}
            rounded="md"
            border="1px solid"
            borderColor="purple.100"
          >
            <Text fontWeight="bold" color="purple.700">
              총 구독량 / 잔여 구독량
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="purple.600">
              {data.maxSuccessResponses.toLocaleString()} /{" "}
              {data.remainingCount.toLocaleString()}
            </Text>
          </Box>
        </SimpleGrid>

        <Button colorScheme="blue" mt={6} onClick={handleChangePlan}>
          구독 상품 변경하기
        </Button>
      </Box>

      {/* 📊 사용자별 사용량 */}
      <Box
        bg={bgCard}
        p={6}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        mb={8}
      >
        <Heading size="md" mb={4}>
          사용자별 사용량 (상위 10명)
        </Heading>

        <Box height={{ base: "300px", md: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedUsers}>
              <XAxis dataKey="userName" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="successCount"
                shape={(props: unknown) => {
                  const barProps = props as BarShapeProps;
                  return <CustomBarShape {...barProps} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* 📋 사용자별 사용량 테이블 */}
      <Box
        bg={bgCard}
        p={6}
        rounded="xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <Heading size="sm" mb={4}>
          사용자 상세 사용량 (상위 10명)
        </Heading>

        <Table size="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>순위</Th>
              <Th>이름</Th>
              <Th isNumeric>응답 성공 횟수</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedUsers.map((user, i) => (
              <Tr key={user.userId}>
                <Td>{i + 1}</Td>
                <Td>{user.userName}</Td>
                <Td isNumeric>{user.successCount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
