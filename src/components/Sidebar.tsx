// src/components/Sidebar.tsx
import { Box, VStack, Text, HStack, Icon } from "@chakra-ui/react";
import { FiUsers, FiBarChart2, FiDatabase, FiSettings } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  organizationName: string;
}

export default function Sidebar({ organizationName }: SidebarProps) {
  const location = useLocation();

  const menuItemStyle = (path: string) => ({
    px: 3,
    py: 2,
    rounded: "md",
    spacing: 3,
    bg: location.pathname === path ? "blue.50" : "transparent",
    color: location.pathname === path ? "blue.600" : "gray.700",
    _hover: { bg: "blue.50", color: "blue.600" },
  });

  const menus = [
    { label: "사용자 목록", path: "/users", icon: FiUsers },
    { label: "통계", path: "/users/stastics", icon: FiBarChart2 },
    { label: "사용량", path: "/subscription-usage", icon: FiDatabase },
    { label: "기관 정보 수정", path: "/organization/edit", icon: FiSettings },
  ];

  return (
    <Box
      w="240px"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      p={6}
      display="flex"
      flexDirection="column"
    >
      {/* 기관명 */}
      <Text fontSize="xl" fontWeight="bold" mb={8}>
        {organizationName}
      </Text>

      {/* 메뉴 */}
      <VStack align="stretch" spacing={2}>
        {menus.map((menu) => (
          <Link key={menu.path} to={menu.path}>
            <HStack {...menuItemStyle(menu.path)}>
              <Icon as={menu.icon} />
              <Text>{menu.label}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
