import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

// 🎨 색상 정의
const COLORS = {
  male: "#3b82f6",
  female: "#ef4444",
  health: "#22c55e",
  good: "#3b82f6",
  caution: "#facc15",
  danger: "#ef4444",
};

// 🔹 더미 데이터 (추후 API 연동시 교체)
const genderData = [
  { name: "남성", value: 21, color: COLORS.male },
  { name: "여성", value: 8, color: COLORS.female },
];

const oralStatusData = [
  { name: "건강", value: 56, color: COLORS.health },
  { name: "양호", value: 30, color: COLORS.good },
  { name: "주의", value: 18, color: COLORS.caution },
  { name: "위험", value: 12, color: COLORS.danger },
];

const surveyData = [
  { name: "A", value: 80 },
  { name: "B", value: 50 },
  { name: "C", value: 40 },
  { name: "D", value: 30 },
  { name: "E", value: 25 },
  { name: "F", value: 20 },
  { name: "G", value: 15 },
  { name: "H", value: 10 },
  { name: "I", value: 8 },
  { name: "J", value: 6 },
  { name: "K", value: 5 },
];

export default function UserStastics() {
  const [selectedPeriod, setSelectedPeriod] = useState("전체");

  const periodButtons = ["오늘", "1주일", "1개월", "3개월", "1년", "전체"];

  return (
    <VStack align="stretch" spacing={6}>
      {/* 📌 기간 설정 */}
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Flex justify="space-between" mb={4}>
          <Box>
            <Text fontWeight="bold">통계기간설정</Text>
            <Text fontSize="sm" color="gray.500">
              통계일시 | {new Date().toLocaleString()}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPeriod("전체")}
          >
            초기화
          </Button>
        </Flex>
        <HStack spacing={3} wrap="wrap">
          {periodButtons.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={selectedPeriod === p ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setSelectedPeriod(p)}
            >
              {p}
            </Button>
          ))}
          {/* 날짜 선택 (Datepicker 라이브러리 연결 가능) */}
          <Button size="sm" variant="outline">
            yyyy-mm-dd
          </Button>
          <Text>~</Text>
          <Button size="sm" variant="outline">
            yyyy-mm-dd
          </Button>
          <Button size="sm" colorScheme="blue">
            조회
          </Button>
        </HStack>
      </Box>

      {/* 📌 남녀 가입률 */}
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Text fontWeight="bold" mb={2}>
          전체 남녀 가입률
        </Text>
        <Text fontSize="sm" color="gray.500" mb={4}>
          남녀 가입률 산출 기준은 앱 가입일입니다.
        </Text>
        {genderData.length === 0 ? (
          <Flex justify="center" align="center" h="150px">
            <Text color="gray.500">데이터가 없습니다</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {["전체 가입자 수", "남성 가입자 수", "여성 가입자 수"].map(
              (title) => (
                <Box key={title} textAlign="center">
                  <Text fontWeight="semibold" mb={2}>
                    {title}
                  </Text>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number, name: string) =>
                          `${name}: ${val}명`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )
            )}
          </SimpleGrid>
        )}
      </Box>

      {/* 📌 평균 구강상태 */}
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Text fontWeight="bold" mb={2}>
          서비스 이름 내 평균구강 상태는 건강입니다.
        </Text>
        <Text fontSize="sm" color="gray.500" mb={4}>
          전체 구강 촬영 횟수 123회 (환자당 평균 3.2회 촬영)
        </Text>
        {oralStatusData.length === 0 ? (
          <Flex justify="center" align="center" h="150px">
            <Text color="gray.500">데이터가 없습니다</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* 구강상태 순위 */}
            <Box>
              <Text fontWeight="semibold" mb={2}>
                구강상태 순위
              </Text>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={oralStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {oralStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* 구강상태 비율 */}
            <Box>
              <Text fontWeight="semibold" mb={2}>
                구강상태 비율
              </Text>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={oralStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {oralStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        )}
      </Box>

      {/* 📌 평균 문진표 유형 */}
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Text fontWeight="bold" mb={2}>
          서비스 이름 내 가장 많은 유형은 A 유형입니다.
        </Text>
        <Text fontSize="sm" color="gray.500" mb={4}>
          전체 문진 횟수 300회 (환자당 평균 2.5회)
        </Text>
        {surveyData.length === 0 ? (
          <Flex justify="center" align="center" h="150px">
            <Text color="gray.500">데이터가 없습니다</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* 문진결과 유형 순위 */}
            <Box>
              <Text fontWeight="semibold" mb={2}>
                문진결과 유형 순위
              </Text>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={surveyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* 문진결과 유형 비율 */}
            <Box>
              <Text fontWeight="semibold" mb={2}>
                문진결과 유형 비율
              </Text>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={surveyData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {surveyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${(index * 40) % 360},70%,50%)`}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  );
}
