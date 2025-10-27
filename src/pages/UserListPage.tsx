import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  useDisclosure,
  Spinner,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import type { i18n as I18nType } from "i18next";

/** ✅ 날짜 입력 커스텀 컴포넌트 (다국어 placeholder 지원) */
function DateInput({
  value,
  onChange,
  i18n,
}: {
  value: string;
  onChange: (val: string) => void;
  i18n: I18nType;
}) {
  const [type, setType] = useState<"text" | "date">("text");

  const getPlaceholder = () => {
    switch (i18n.language) {
      case "ko":
        return "연도-월-일";
      case "vi":
        return "Năm-Tháng-Ngày";
      default:
        return "YYYY-MM-DD";
    }
  };

  return (
    <Input
      type={type}
      onFocus={() => setType("date")}
      onBlur={() => !value && setType("text")}
      placeholder={getPlaceholder()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

interface UserItem {
  userId: number;
  userLoginIdentifier: string;
  userName: string;
  userGender: "M" | "W";
  oralStatus: string | null;
  oralStatusTitle: string | null;
  oralCheckResultTotalType: string | null;
  oralCheckDate: string | null;
  questionnaireDate: string | null;
  questionnaireType?: string | null;
  isVerify: "Y" | "N";
  serviceNames: string[];
}

interface Paging {
  number: number;
  totalPages: number;
  totalElements: number;
}

export default function UserListPage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [filters, setFilters] = useState({
    keyword: "",
    oralStatus: "",
    questionnaireType: "",
    gender: "",
    verify: "",
    startDate: "",
    endDate: "",
  });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [paging, setPaging] = useState<Paging | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState<number | null>(null);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const { onOpen, onClose } = useDisclosure();

  /** ✅ 문진표 유형 매핑 (다국어 가능) */
  const questionnaireTypeMap: Record<string, string> = {
    ADULT_ORAL_MANAGEMENT: t("userList.type.adultOral"),
    ADULT_ORTHO_MANAGEMENT: t("userList.type.adultOrtho"),
    CHILD_ORAL_MANAGEMENT: t("userList.type.childOral"),
    CHILD_ORTHO_MANAGEMENT: t("userList.type.childOrtho"),
  };

  useEffect(() => {
    if (isMobile) onClose();
    else onOpen();
  }, [isMobile]);

  /** ✅ 사용자 목록 조회 */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());

      // ✅ 백엔드 필드명에 맞게
      if (filters.keyword)
        params.append("userIdentifierOrName", filters.keyword);
      if (filters.oralStatus) params.append("oralStatus", filters.oralStatus);
      if (filters.gender) params.append("userGender", filters.gender);
      if (filters.verify) params.append("isVerify", filters.verify);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await api.get(`/admin/user?${params.toString()}`);
      const response = res.data?.response;
      if (!response) throw new Error("Invalid response format");

      setUsers(response.userList || []);
      setPaging(response.paging || null);
    } catch (e) {
      console.error("❌ 사용자 검색 실패:", e);
      toast({
        title: t("common.error"),
        description: t("userList.toast.loadFail"),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  /** ✅ 필터 초기화 */
  const handleReset = () => {
    setFilters({
      keyword: "",
      oralStatus: "",
      questionnaireType: "",
      gender: "",
      verify: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
    fetchUsers();
  };

  /** ✅ 인증 처리 */
  const handleVerifyUser = async (userId: number) => {
    try {
      setVerifyingUserId(userId);
      await api.put(`/admin/user/verify?userId=${userId}`);

      toast({
        title: t("userList.verifySuccessTitle"),
        description: t("userList.verifySuccessDesc"),
        status: "success",
        duration: 2000,
      });

      fetchUsers();
    } catch (err) {
      console.error("❌ 사용자 인증 실패:", err);
      toast({
        title: t("userList.verifyFailTitle"),
        description: t("userList.verifyFailDesc"),
        status: "error",
        duration: 2500,
      });
    } finally {
      setVerifyingUserId(null);
    }
  };

  return (
    <Box p={{ base: 3, md: 6 }} bg="gray.50" minH="100vh">
      {/* 🔍 검색 조건 */}
      <Box
        bg="white"
        p={{ base: 4, md: 6 }}
        rounded="lg"
        shadow="md"
        mb={6}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text fontWeight="bold" fontSize="lg" mb={6}>
          {t("userList.search")}
        </Text>

        {/* 검색어 */}
        <Box mb={6}>
          <Text fontWeight="semibold" mb={2}>
            {t("userList.keyword")}
          </Text>
          <Input
            placeholder={t("userList.placeholder.keyword")}
            value={filters.keyword}
            onChange={(e) =>
              setFilters((f) => ({ ...f, keyword: e.target.value }))
            }
          />
        </Box>

        {/* 필터 */}
        <Box>
          <Text fontWeight="semibold" mb={2}>
            {t("userList.filters.title")}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={4}>
            <Select
              placeholder={t("userList.filters.oralStatus")}
              value={filters.oralStatus}
              onChange={(e) =>
                setFilters((f) => ({ ...f, oralStatus: e.target.value }))
              }
            >
              <option value="HEALTHY">{t("userList.status.healthy")}</option>
              <option value="DANGER">{t("userList.status.danger")}</option>
            </Select>

            <Select
              placeholder={t("userList.filters.questionnaire")}
              value={filters.questionnaireType}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  questionnaireType: e.target.value,
                }))
              }
            >
              <option value="ADULT">{t("userList.type.adult")}</option>
              <option value="CHILD">{t("userList.type.child")}</option>
            </Select>

            <Select
              placeholder={t("userList.filters.gender")}
              value={filters.gender}
              onChange={(e) =>
                setFilters((f) => ({ ...f, gender: e.target.value }))
              }
            >
              <option value="M">{t("userList.gender.male")}</option>
              <option value="W">{t("userList.gender.female")}</option>
            </Select>

            <Select
              placeholder={t("userList.filters.verify")}
              value={filters.verify}
              onChange={(e) =>
                setFilters((f) => ({ ...f, verify: e.target.value }))
              }
            >
              <option value="Y">{t("userList.verify.verified")}</option>
              <option value="N">{t("userList.verify.unverified")}</option>
            </Select>
          </SimpleGrid>

          {/* ✅ 날짜 선택 (커스텀 DateInput 적용) */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            <DateInput
              value={filters.startDate}
              onChange={(val) => setFilters((f) => ({ ...f, startDate: val }))}
              i18n={i18n}
            />
            <DateInput
              value={filters.endDate}
              onChange={(val) => setFilters((f) => ({ ...f, endDate: val }))}
              i18n={i18n}
            />
          </SimpleGrid>

          <Flex justify="flex-end" gap={3}>
            <Button variant="outline" onClick={handleReset}>
              {t("common.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={fetchUsers}>
              {t("userList.searchBtn")}
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* 📋 검색 결과 */}
      <Box
        bg="white"
        p={{ base: 4, md: 6 }}
        rounded="lg"
        shadow="sm"
        overflowX="auto"
      >
        {loading ? (
          <Flex justify="center" align="center" minH="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <>
            <Flex justify="space-between" mb={4} flexWrap="wrap" gap={2}>
              <Text fontWeight="bold">
                {t("userList.result", { count: paging?.totalElements || 0 })}
              </Text>

              <Select
                w="150px"
                size="sm"
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="10">{t("userList.pageSize.10")}</option>
                <option value="30">{t("userList.pageSize.30")}</option>
                <option value="50">{t("userList.pageSize.50")}</option>
              </Select>
            </Flex>

            <Table size="sm" minW="800px">
              <Thead bg="gray.100">
                <Tr>
                  <Th>#</Th>
                  <Th>{t("userList.columns.id")}</Th>
                  <Th>{t("userList.columns.name")}</Th>
                  {!isMobile && <Th>{t("userList.columns.questionnaire")}</Th>}
                  <Th>{t("userList.columns.date")}</Th>
                  {!isMobile && <Th>{t("userList.columns.oralStatus")}</Th>}
                  <Th>{t("userList.columns.verify")}</Th>
                  <Th>{t("userList.columns.services")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, idx) => (
                  <Tr key={user.userId}>
                    <Td>{(page - 1) * size + idx + 1}</Td>
                    <Td>{user.userLoginIdentifier}</Td>
                    <Td>{user.userName}</Td>
                    <Td>
                      {questionnaireTypeMap[user.questionnaireType || ""] ||
                        "-"}
                    </Td>
                    <Td>
                      {user.questionnaireDate
                        ? new Date(user.questionnaireDate).toLocaleDateString(
                            i18n.language
                          )
                        : "-"}
                    </Td>
                    {!isMobile && (
                      <Td>{user.oralCheckResultTotalType || "-"}</Td>
                    )}
                    <Td>
                      {user.isVerify === "Y" ? (
                        <Button
                          size="xs"
                          colorScheme="green"
                          variant="outline"
                          isDisabled
                        >
                          {t("userList.verify.verified")}
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          isLoading={verifyingUserId === user.userId}
                          onClick={() => handleVerifyUser(user.userId)}
                        >
                          {t("userList.verify.action")}
                        </Button>
                      )}
                    </Td>
                    <Td>
                      {user.serviceNames?.length
                        ? user.serviceNames.join(", ")
                        : t("common.noData")}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* ✅ 페이지네이션 */}
            <Flex justify="center" align="center" mt={6} gap={4}>
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                isDisabled={page === 1}
                size="sm"
              >
                {t("userList.pagination.prev")}
              </Button>
              <Text fontWeight="medium">
                {page} / {paging?.totalPages || 1}
              </Text>
              <Button
                onClick={() =>
                  setPage((p) => Math.min(p + 1, paging?.totalPages || 1))
                }
                isDisabled={page === paging?.totalPages}
                size="sm"
              >
                {t("userList.pagination.next")}
              </Button>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
}
