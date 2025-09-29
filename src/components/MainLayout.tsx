// src/components/MainLayout.tsx
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  organizationName: string;
  companyLogo: string;
}

export default function MainLayout({
  children,
  organizationName,
  companyLogo,
}: MainLayoutProps) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar organizationName={organizationName} />

      <Flex direction="column" flex="1">
        <Header companyLogo={companyLogo} />
        <Box p={6} flex="1">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
