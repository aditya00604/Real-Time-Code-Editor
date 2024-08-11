"use client";
import { useState } from 'react';
import { Box, Flex, Button, VStack, Heading } from '@chakra-ui/react';
import CodeEditor from '@/components/CodeEditor';
import PreviewPane from '@/components/PreviewPane';


export default function HomePage() {
  const [html, setHtml] = useState('<h1>Hello, World!</h1>');
  const [css, setCss] = useState('h1 { color: red; }');
  const [js, setJs] = useState('console.log("Hello, World!");');

  return (
    <Flex direction="row" h="100vh">
      <Box flex="1" p={4} borderRight="1px" borderColor="gray.200">
        <Heading mb={4}>Real-Time Code Editor</Heading>
        <VStack spacing={4} align="stretch">
          <CodeEditor language="html" code={html} setCode={setHtml} />
          <CodeEditor language="css" code={css} setCode={setCss} />
          <CodeEditor language="js" code={js} setCode={setJs} />
        </VStack>
      </Box>
      <Box flex="1" p={4}>
        <PreviewPane html={html} css={css} js={js} />
      </Box>
    </Flex>
  );
}
