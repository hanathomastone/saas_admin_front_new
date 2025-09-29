// src/pages/UsagePage.tsx
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from "@chakra-ui/react";

// 📌 더미 데이터 (추후 API 연동 필요)
const subscriptionInfo = {
  plan: "Medium",
  totalResponses: 5000,
  usedResponses: 3120,
};

const userData = [
  { id: "user001", name: "홍길동", totalResponses: 100, usedResponses: 23 },
  { id: "user002", name: "김영희", totalResponses: 200, usedResponses: 78 },
  { id: "user003", name: "이철수", totalResponses: 150, usedResponses: 99 },
];

export default function UsagePage() {
  const { plan, totalResponses, usedResponses } = subscriptionInfo;
  const remaining = totalResponses - usedResponses;

  return (
    <Box p={6}>
      {/* ✅ 구독상품 정보 섹션 */}
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          구독 정보
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat
            p={4}
            shadow="sm"
            border="1px"
            borderColor="gray.200"
            rounded="md"
            bg="white"
          >
            <StatLabel>구독상품</StatLabel>
            <StatNumber>{plan}</StatNumber>
          </Stat>
          <Stat
            p={4}
            shadow="sm"
            border="1px"
            borderColor="gray.200"
            rounded="md"
            bg="white"
          >
            <StatLabel>전체 응답 수</StatLabel>
            <StatNumber>{totalResponses}</StatNumber>
          </Stat>
          <Stat
            p={4}
            shadow="sm"
            border="1px"
            borderColor="gray.200"
            rounded="md"
            bg="white"
          >
            <StatLabel>남은 응답 수</StatLabel>
            <StatNumber>{remaining}</StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>

      {/* ✅ 사용자별 사용량 섹션 */}
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          사용자별 서비스 이용 현황
        </Text>
        <Box bg="white" p={4} rounded="md" shadow="sm">
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>사용자 ID</Th>
                <Th>이름</Th>
                <Th isNumeric>전체 응답 수</Th>
                <Th isNumeric>사용한 응답 수</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userData.map((u) => (
                <Tr key={u.id}>
                  <Td>{u.id}</Td>
                  <Td>{u.name}</Td>
                  <Td isNumeric>{u.totalResponses}</Td>
                  <Td isNumeric>{u.usedResponses}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
