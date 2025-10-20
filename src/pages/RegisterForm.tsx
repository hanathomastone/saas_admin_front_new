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

interface AdminForm {
  adminLoginIdentifier: string;
  adminName: string;
  adminPhoneNumber: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AdminForm>({
    adminLoginIdentifier: "",
    adminName: "",
    adminPhoneNumber: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );

  const boxPadding = useBreakpointValue({ base: 6, md: 10 });
  const boxWidth = useBreakpointValue({ base: "90%", sm: "450px" });

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
        title: "입력 필요",
        description: "모든 항목을 입력해주세요.",
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
          title: "가입 실패",
          description: res.data.rtMsg || "서버 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "서버 통신 오류",
        description: "API 요청 중 문제가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={4}>
      <Box
        w={boxWidth}
        bg="white"
        p={boxPadding}
        borderRadius="xl"
        boxShadow="0 0 15px rgba(0, 0, 0, 0.08)"
        border="1px solid"
        borderColor="gray.200"
      >
        {/* 로고 */}
        <Flex direction="column" align="center" mb={10}>
          <Image
            src="/images/DentiGlobal.png"
            alt="DentiGlobal Logo"
            h="65px"
            mb={4}
          />
          <Heading size="lg" color="gray.800" fontWeight="bold">
            관리자 회원가입
          </Heading>
        </Flex>

        {/* 입력 폼 */}
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontWeight="semibold">아이디</FormLabel>
            <Input
              name="adminLoginIdentifier"
              value={form.adminLoginIdentifier}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              h="50px"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">이름</FormLabel>
            <Input
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              h="50px"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold">핸드폰 번호</FormLabel>
            <Input
              name="adminPhoneNumber"
              value={form.adminPhoneNumber}
              onChange={handleChange}
              placeholder="010-0000-0000"
              h="50px"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
              }}
            />
          </FormControl>

          {/* 버튼 영역 */}
          <HStack spacing={4} mt={6}>
            <Button
              colorScheme="blue"
              w="50%"
              h="55px"
              fontSize="lg"
              onClick={handleSubmit}
              isLoading={loading}
            >
              가입하기
            </Button>
            <Button
              w="50%"
              h="55px"
              fontSize="lg"
              bg="gray.300"
              _hover={{ bg: "gray.400" }}
              onClick={() => navigate(-1)}
            >
              이전화면
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* ✅ 임시 비밀번호 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={4}>
          <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
            관리자 계정이 생성되었습니다.
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" pb={6}>
            <Text mb={3} fontSize="md" color="gray.700">
              발급된 임시 비밀번호는 아래와 같습니다.
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {generatedPassword}
            </Text>
            <Text mt={4} fontSize="sm" color="gray.500">
              로그인 후 반드시 비밀번호를 변경하세요.
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
              로그인 페이지로 이동
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
