import { Textarea } from '@chakra-ui/react';

export default function CodeEditor({ language, code, setCode }) {
  return (
    <Textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder={`Write your ${language.toUpperCase()} code here...`}
      height="80vh"
      resize="none"
      fontFamily="monospace"
      bg="gray.50"
      borderColor="gray.300"
    />
  );
}
