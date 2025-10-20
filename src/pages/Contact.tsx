import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  Icon,
  Select,
} from "@chakra-ui/react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function ContactPage() {
  return (
    <Box maxW="1200px" mx="auto" p={8}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10}>
        {/* 왼쪽 영역 */}
        <GridItem>
          <VStack align="start" spacing={6}>
            <HStack>
              <Icon as={MdEmail} boxSize={6} color="blue.500" />
              <Box>
                <Text fontWeight="bold">Email</Text>
                <Text>example@thomastone.co.kr</Text>
              </Box>
            </HStack>

            <HStack>
              <Icon as={MdPhone} boxSize={6} color="blue.500" />
              <Box>
                <Text fontWeight="bold">Phone</Text>
                <Text>+0123456789, +9876543210</Text>
              </Box>
            </HStack>

            <HStack align="start">
              <Icon as={MdLocationOn} boxSize={6} color="blue.500" mt={1} />
              <Box>
                <Text fontWeight="bold">Office location</Text>
                <Text>
                  충청남도 천안시 단대로 119 단국대학교 산학협력관 407호
                </Text>
              </Box>
            </HStack>

            {/* 구글 지도 */}
            <Box w="100%" h="300px" borderRadius="md" overflow="hidden" mt={4}>
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/?entry=ttu&g_ep=EgoyMDI1MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Box>
          </VStack>
        </GridItem>

        {/* 오른쪽 영역 (문의 폼) */}
        <GridItem>
          <Heading size="md" mb={6}>
            Leave a message
          </Heading>
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Box flex="1">
                <Text fontWeight="semibold">Fname</Text>
                <Input placeholder="Thomastone" />
              </Box>
              <Box flex="1">
                <Text fontWeight="semibold">Lname</Text>
                <Input placeholder="Thomastone" />
              </Box>
            </HStack>

            <Box>
              <Text fontWeight="semibold">Email</Text>
              <Input placeholder="example@thomastone.co.kr" />
            </Box>

            <Box>
              <Text fontWeight="semibold">Phone</Text>
              <Input placeholder="07089087061" />
            </Box>

            <Box>
              <Text fontWeight="semibold">Country</Text>
              <Select placeholder="Select country">
                <option value="usa">USA</option>
                <option value="uk">UK</option>
                <option value="korea">Korea</option>
                <option value="vietnam">Vietnam</option>
              </Select>
            </Box>

            <Box>
              <Text fontWeight="semibold">Message</Text>
              <Textarea placeholder="Write your message..." rows={5} />
            </Box>

            <Button colorScheme="blue" alignSelf="flex-start">
              Send Message
            </Button>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
