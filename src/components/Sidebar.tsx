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
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiLogOut,
  FiUser,
  FiPieChart,
  FiBook,
  FiBarChart2,
  FiCpu,
} from "react-icons/fi"; // ✅ AWS 메뉴용 아이콘 (FiCpu)

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // ✅ localStorage 값 가져오기
  const organizationName = localStorage.getItem("organizationName") || "기관명";
  const adminLoginIdentifier =
    localStorage.getItem("adminLoginIdentifier") || "Admin ID";
  const adminIsSuper = (localStorage.getItem("adminIsSuper") ?? "")
    .toString()
    .toUpperCase();

  const isSuper = ["Y", "TRUE", "1"].includes(adminIsSuper);

  /** ✅ 메뉴 이동 핸들러들 */
  const handleSubscriptionClick = () => {
    if (isSuper) navigate("/admin/subscription/super");
    else navigate("/admin/subscription/usage");
  };

  const handleStatisticClick = () => {
    if (isSuper) navigate("/admin/users/statistic/super");
    else navigate("/admin/users/statistic");
  };

  const handleUsageClick = () => {
    if (isSuper) navigate("/admin/organization/usage");
    else navigate("/admin/subscription/usage");
  };

  const handleAwsInfoClick = () => {
    navigate("/admin/aws/info/super");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /** ✅ 메뉴 리스트 */
  const menuItems = [
    { label: "사용자 관리", icon: FiUsers, path: "/admin/users" },
    { label: "사용자 통계", icon: FiPieChart, onClick: handleStatisticClick },
    { label: "구독정보", icon: FiBook, onClick: handleSubscriptionClick },
    { label: "사용량 정보", icon: FiBarChart2, onClick: handleUsageClick },

    // ✅ (추가) 슈퍼관리자 전용 메뉴
    ...(isSuper
      ? [
          {
            label: "AWS 리소스 현황",
            icon: FiCpu,
            onClick: handleAwsInfoClick,
            isSuperOnly: true,
          },
        ]
      : []),
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
      {/* ✅ 로고 */}
      <Flex direction="column" align="center" justify="center" mb={8}>
        <Image
          src="/images/DentiGlobal.png"
          alt="Company Logo"
          h="50px"
          mb={2}
        />
      </Flex>

      {/* ✅ 관리자 정보 */}
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
          bg="blue.50"
          borderRadius="full"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="sm"
        >
          <Icon as={FiUser} color="blue.500" boxSize={5} />
        </Box>

        {!isMobile && (
          <Box lineHeight="1.2">
            <Text fontWeight="semibold" fontSize="md" color="blue.700">
              {organizationName}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {adminLoginIdentifier}
            </Text>
          </Box>
        )}
      </Flex>

      <Divider mb={5} />

      {/* ✅ 메뉴 리스트 */}
      <VStack align="stretch" spacing={1}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path && location.pathname.startsWith(item.path));

          // ✅ 슈퍼관리자 전용 메뉴는 일반관리자에게 숨김
          if (item.isSuperOnly && !isSuper) return null;

          return (
            <Flex
              key={item.label}
              align="center"
              p={3}
              borderRadius="md"
              bg={isActive ? "blue.50" : "transparent"}
              color={isActive ? "blue.600" : "gray.700"}
              fontWeight={isActive ? "bold" : "normal"}
              _hover={{ bg: "blue.50", color: "blue.600" }}
              transition="0.2s"
              cursor="pointer"
              onClick={item.onClick || (() => navigate(item.path!))}
            >
              <Icon as={item.icon} mr={3} />
              {!isMobile && <Text>{item.label}</Text>}
            </Flex>
          );
        })}
      </VStack>

      <Divider my={5} />

      {/* ✅ 로그아웃 */}
      <Flex
        align="center"
        p={3}
        borderRadius="md"
        color="gray.600"
        _hover={{ bg: "gray.100" }}
        mt="auto"
        cursor="pointer"
        onClick={handleLogout}
      >
        <Icon as={FiLogOut} mr={3} />
        {!isMobile && <Text>로그아웃</Text>}
      </Flex>
    </Box>
  );
}
