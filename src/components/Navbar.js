import { Flex, Box, Button, Heading } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Box>
        <Heading size="lg">Real-Time Code Editor</Heading>
      </Box>
      <Box>
        {session ? (
          <Button onClick={() => signOut()} colorScheme="teal" variant="outline">
            Logout
          </Button>
        ) : (
          <Button href="/login" colorScheme="teal" variant="outline">
            Login
          </Button>
        )}
      </Box>
    </Flex>
  );
}
