import { useState } from 'react';
import { Box, Flex, Heading, Button, Spacer, Link } from '@chakra-ui/react';

export default function NavBar({ isAuthenticated, onLogin, onLogout }) {
  return (
    <Flex as="nav" bg="teal.500" color="white" p={4} align="center">
      <Heading size="md">My App</Heading>
      <Spacer />
      <Link href="/" p={2} _hover={{ textDecoration: 'none', bg: 'teal.600' }}>Home</Link>
      <Link href="/about" p={2} _hover={{ textDecoration: 'none', bg: 'teal.600' }}>About</Link>
      {isAuthenticated ? (
        <Button onClick={onLogout} colorScheme="teal" variant="outline" ml={4}>
          Logout
        </Button>
      ) : (
        <Button onClick={onLogin} colorScheme="teal" variant="outline" ml={4}>
          Login
        </Button>
      )}
    </Flex>
  );
}