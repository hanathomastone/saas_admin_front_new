// src/components/Header.tsx
import { Box, Flex, Image } from "@chakra-ui/react";

interface HeaderProps {
  companyLogo: string;
}

export default function Header({ companyLogo }: HeaderProps) {
  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" p={4}>
      <Flex align="center">
        {/* 회사 로고 */}
        <Image
          src={companyLogo}
          alt="Company Logo"
          height="30px" // 세로 줄임
          width="auto" // 비율 유지
          mr={6}
        />

        <Flex ml="auto" align="center">
          <Box as="button" color="red.500" fontWeight="medium">
            로그아웃
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
