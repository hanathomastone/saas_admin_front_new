import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Image,
  Heading,
  useToast,
  useBreakpointValue,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface AdminForm {
  adminLoginIdentifier: string;
  adminName: string;
  adminPhoneNumber: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AdminForm>({
    adminLoginIdentifier: "",
    adminName: "",
    adminPhoneNumber: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );

  /** ✅ 반응형 설정 */
  const boxPadding = useBreakpointValue({ base: 6, md: 10 });
  const boxWidth = useBreakpointValue({ base: "90%", sm: "450px" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const buttonHeight = useBreakpointValue({ base: "45px", md: "55px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.adminLoginIdentifier ||
      !form.adminName ||
      !form.adminPhoneNumber
    ) {
      toast({
        title: t("register.requiredTitle"),
        description: t("register.requiredDesc"),
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/admin/account", form);

      if (res.data.rt === 200) {
        const tempPassword = res.data.response.adminPassword;
        setGeneratedPassword(tempPassword);
        onOpen();
      } else {
        toast({
          title: t("register.failTitle"),
          description: res.data.rtMsg || t("register.serverError"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t("register.networkErrorTitle"),
        description: t("register.networkErrorDesc"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, blue.50, white)"
      px={4}
    >
      <Box
        w={boxWidth}
        bg="white"
        p={boxPadding}
        borderRadius="2xl"
        boxShadow="0 4px 15px rgba(0, 0, 0, 0.08)"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* ✅ 로고 */}
        <Flex direction="column" align="center" mb={10}>
          <Image
            src="/images/DentiGlobal.png"
            alt="DentiGlobal Logo"
            h={{ base: "50px", md: "65px" }}
            mb={4}
          />
          <Heading size={headingSize} color="gray.800" fontWeight="bold">
            {t("register.title")}
          </Heading>
        </Flex>

        {/* ✅ 입력 폼 */}
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontWeight="semibold">{t("register.idLabel")}</FormLabel>
            <Input
              name="adminLoginIdentifier"
              value={form.adminLoginIdentifier}
              onChange={handleChange}
              placeholder={t("register.idPlaceholder")}
              h={buttonHeight}
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">
              {t("register.nameLabel")}
            </FormLabel>
            <Input
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
              placeholder={t("register.namePlaceholder")}
              h={buttonHeight}
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">
              {t("register.phoneLabel")}
            </FormLabel>
            <Input
              name="adminPhoneNumber"
              value={form.adminPhoneNumber}
              onChange={handleChange}
              placeholder={t("register.phonePlaceholder")}
              h={buttonHeight}
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          {/* ✅ 버튼 영역 */}
          <HStack spacing={4} mt={6}>
            <Button
              colorScheme="blue"
              w="50%"
              h={buttonHeight}
              fontSize="lg"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {t("register.submitButton")}
            </Button>
            <Button
              w="50%"
              h={buttonHeight}
              fontSize="lg"
              bg="gray.300"
              _hover={{ bg: "gray.400" }}
              onClick={() => navigate(-1)}
            >
              {t("register.backButton")}
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* ✅ 임시 비밀번호 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={4}>
          <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
            {t("register.modalTitle")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" pb={6}>
            <Text mb={3} fontSize="md" color="gray.700">
              {t("register.tempPasswordDesc")}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {generatedPassword}
            </Text>
            <Text mt={4} fontSize="sm" color="gray.500">
              {t("register.changePasswordNotice")}
            </Text>
            <Button
              mt={6}
              colorScheme="blue"
              w="100%"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              {t("register.goToLogin")}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
