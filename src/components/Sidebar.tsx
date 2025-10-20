import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  Image,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiLogOut,
  FiUser,
  FiPieChart,
  FiBook,
  FiBarChart2,
} from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const organizationName = localStorage.getItem("organizationName") || "기관명";

  const menuItems = [
    { label: "사용자 관리", icon: FiUsers, path: "/admin/users" },
    { label: "사용자 통계", icon: FiPieChart, path: "/admin/users/statistic" },
    { label: "구독정보", icon: FiBook, path: "/admin/subscription/usage" },
    {
      label: "사용량 정보",
      icon: FiBarChart2,
      path: "/admin/subscription/users",
    },
  ];

  return (
    <Box
      w={isMobile ? "70px" : "260px"}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      p={5}
      transition="0.3s ease"
      overflowY="auto"
    >
      <Flex direction="column" align="center" justify="center" mb={8}>
        <Image
          src="/images/DentiGlobal.png"
          alt="Company Logo"
          h="50px"
          mb={2}
        />
      </Flex>

      {/* 아바타 + 기관명 (클릭 시 이동) */}
      <Flex
        align="center"
        mb={6}
        gap={3}
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        p={2}
        borderRadius="md"
        onClick={() => navigate("/admin/organization/edit")}
      >
        <Box
          bg="blue.100"
          borderRadius="full"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiUser} color="blue.500" boxSize={5} />
        </Box>
        {!isMobile && (
          <Box>
            <Text fontWeight="bold">{organizationName}</Text>
            <Text fontSize="xs" color="gray.500">
              Administrator
            </Text>
          </Box>
        )}
      </Flex>

      <Divider mb={5} />

      <VStack align="stretch" spacing={1}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <Flex
                align="center"
                p={3}
                borderRadius="md"
                bg={isActive ? "blue.50" : "transparent"}
                color={isActive ? "blue.600" : "gray.700"}
                fontWeight={isActive ? "bold" : "normal"}
                _hover={{ bg: "blue.50", color: "blue.600" }}
                transition="0.2s"
              >
                <Icon as={item.icon} mr={3} />
                {!isMobile && <Text>{item.label}</Text>}
              </Flex>
            </Link>
          );
        })}
      </VStack>

      <Divider my={5} />

      <Flex
        align="center"
        p={3}
        borderRadius="md"
        color="gray.600"
        _hover={{ bg: "gray.100" }}
        mt="auto"
        cursor="pointer"
      >
        <Icon as={FiLogOut} mr={3} />
        {!isMobile && <Text>로그아웃</Text>}
      </Flex>
    </Box>
  );
}
