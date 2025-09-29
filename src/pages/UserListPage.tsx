import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
} from "@chakra-ui/react";
import MainLayout from "../components/MainLayout";

export default function UserListPage() {
  return (
    <MainLayout
      organizationName="테스트 기관"
      companyLogo="/public/images/DentiGlobal.png"
    >
      <Heading mb={6} size="md">
        사용자 목록
      </Heading>

      {/*검색 조건 영역 */}
      <Box
        bg="white"
        p={6}
        rounded="md"
        shadow="sm"
        mb={8}
        maxW="1200px"
        mx="auto"
      >
        <Flex direction="column" gap={6}>
          {/* 검색어 */}
          <Flex align="center" gap={6}>
            <Text w="100px" fontWeight="bold">
              검색어
            </Text>
            <Input placeholder="아이디 혹은 이름" w="300px" />
          </Flex>

          {/* 필터 */}
          <Flex align="center" gap={6}>
            <Text w="100px" fontWeight="bold">
              필터
            </Text>
            <HStack spacing={4}>
              <Select placeholder="잇몸상태" w="150px">
                <option value="건강">건강</option>
                <option value="주의">주의</option>
                <option value="위험">위험</option>
              </Select>
              <Select placeholder="문진표 유형" w="150px">
                <option value="구강검진">구강검진</option>
                <option value="치과진료">치과진료</option>
              </Select>
              <Select placeholder="성별" w="100px">
                <option value="M">남</option>
                <option value="F">여</option>
              </Select>
              <Select placeholder="인증여부" w="120px">
                <option value="yes">예</option>
                <option value="no">아니오</option>
              </Select>
            </HStack>
          </Flex>

          {/* 기간 설정 */}
          <Flex align="center" gap={6}>
            <Text w="100px" fontWeight="bold">
              기간 설정
            </Text>
            <HStack spacing={2}>
              <Button size="sm" variant="outline">
                오늘
              </Button>
              <Button size="sm" variant="outline">
                1주일
              </Button>
              <Button size="sm" variant="outline">
                1개월
              </Button>
              <Button size="sm" variant="outline">
                3개월
              </Button>
              <Button size="sm" variant="outline">
                1년
              </Button>
              <Button size="sm" variant="outline">
                전체
              </Button>
            </HStack>
            <HStack>
              <Input type="date" w="180px" />
              <Text>~</Text>
              <Input type="date" w="180px" />
            </HStack>
          </Flex>

          {/* 버튼 영역 */}
          <Flex justify="flex-end" gap={4} mt={4}>
            <Button colorScheme="gray" variant="outline">
              초기화
            </Button>
            <Button colorScheme="blue">검색</Button>
          </Flex>
        </Flex>
      </Box>

      {/* 검색 결과 테이블 */}
      <Box bg="white" p={6} rounded="md" shadow="sm" maxW="1200px" mx="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold">검색 결과 (총 99,999명)</Text>
          <Select w="150px" defaultValue="50">
            <option value="10">10개씩 보기</option>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
          </Select>
        </Flex>

        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>번호</Th>
              <Th>아이디</Th>
              <Th>이름</Th>
              <Th>문진표 유형</Th>
              <Th>문진표 작성일</Th>
              <Th>잇몸 상태</Th>
              <Th>구강촬영일</Th>
              <Th>구강촬영 병원</Th>
              <Th>인증</Th>
              <Th>상세보기</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <Tr key={i}>
                <Td>{i + 1}</Td>
                <Td>user{i + 1}</Td>
                <Td>홍길동</Td>
                <Td>구강검진</Td>
                <Td>2023-09-01</Td>
                <Td>건강</Td>
                <Td>2023-09-05</Td>
                <Td>서울치과</Td>
                <Td>
                  <Button size="sm" colorScheme="green" variant="outline">
                    인증하기
                  </Button>
                </Td>
                <Td>
                  <Button size="sm" colorScheme="blue" variant="outline">
                    상세보기
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* 페이지네이션 */}
        <Flex justify="center" mt={6} gap={2}>
          <Button size="sm" variant="outline">
            Prev
          </Button>
          <Button size="sm" colorScheme="blue">
            1
          </Button>
          <Button size="sm" variant="outline">
            2
          </Button>
          <Button size="sm" variant="outline">
            3
          </Button>
          <Button size="sm" variant="outline">
            Next
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
