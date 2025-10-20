// src/pages/UserUsagePage.tsx
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserItem {
  userId: number;
  userName: string;
  userPhoneNumber: string;
  organizationName: string;
  serviceName: string;
  successCount: number;
}

export default function UserUsagePage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (type: "ALL" | "PLAQUE" | "PERIODONTAL") => {
    setIsLoading(true);
    try {
      const url =
        type === "ALL"
          ? "/admin/users/usage"
          : `/admin/users/usage?serviceName=${type}`;
      const res = await api.get(url);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ 사용자 정보 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("ALL");
  }, []);

  const handleTabChange = (index: number) => {
    const types: ("ALL" | "PLAQUE" | "PERIODONTAL")[] = [
      "ALL",
      "PLAQUE",
      "PERIODONTAL",
    ];
    fetchUsers(types[index]);
  };

  const sortedUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.successCount - a.successCount)
      .slice(0, 10);
  }, [users]);

  // const bgCard = useColorModeValue("white", "gray.800");

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Heading mb={6} size="lg">
        사용자별 사용량
      </Heading>

      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        onChange={handleTabChange}
      >
        <TabList mb={4}>
          <Tab>전체</Tab>
          <Tab>플라그 (PLAQUE)</Tab>
          <Tab>치주염 (PERIODONTAL)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UsagePanel isLoading={isLoading} sortedUsers={sortedUsers} />
          </TabPanel>
          <TabPanel>
            <UsagePanel isLoading={isLoading} sortedUsers={sortedUsers} />
          </TabPanel>
          <TabPanel>
            <UsagePanel isLoading={isLoading} sortedUsers={sortedUsers} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

function UsagePanel({
  isLoading,
  sortedUsers,
}: {
  isLoading: boolean;
  sortedUsers: UserItem[];
}) {
  const bgCard = useColorModeValue("white", "gray.800");
  return (
    <>
      {isLoading ? (
        <Flex justify="center" align="center" h="300px">
          <Spinner />
        </Flex>
      ) : (
        <>
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
              사용자별 사용량 (TOP 10)
            </Heading>
            <Box height={{ base: "300px", md: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedUsers}>
                  <XAxis dataKey="userName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successCount" fill="#4680FF" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box
            bg={bgCard}
            p={6}
            rounded="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.100"
          >
            <Heading size="sm" mb={4}>
              사용자 상세 사용량 (TOP 10)
            </Heading>
            <Table size="sm">
              <Thead bg="gray.100">
                <Tr>
                  <Th>순위</Th>
                  <Th>이름</Th>
                  <Th>전화번호</Th>
                  <Th>소속 기관</Th>
                  <Th>서비스명</Th>
                  <Th isNumeric>응답 성공 횟수</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedUsers.map((user, i) => (
                  <Tr key={user.userId}>
                    <Td>{i + 1}</Td>
                    <Td>{user.userName}</Td>
                    <Td>{user.userPhoneNumber || "-"}</Td>
                    <Td>{user.organizationName}</Td>
                    <Td>{user.serviceName}</Td>
                    <Td isNumeric>{user.successCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
    </>
  );
}
