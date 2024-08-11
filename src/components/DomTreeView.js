// src/components/DomTreeView.js
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

export default function DomTreeView({ html, css, js }) {
  const [domTree, setDomTree] = useState('');

  useEffect(() => {
    const generateDOMTree = () => {
      const doc = new DOMParser().parseFromString(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>${html}</body>
          <script>${js}</script>
        </html>
      `, 'text/html');
      setDomTree(formatDOMTree(doc.documentElement));
    };

    generateDOMTree();
  }, [html, css, js]);

  const formatDOMTree = (node, indent = 0) => {
    let tree = `${' '.repeat(indent)}<${node.nodeName.toLowerCase()}`;

    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        tree += ` ${attr.name}="${attr.value}"`;
      });
    }
    tree += '>';

    if (node.childNodes.length) {
      tree += '\n';
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          tree += formatDOMTree(child, indent + 2) + '\n';
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          tree += `${' '.repeat(indent + 2)}${child.textContent.trim()}\n`;
        }
      });
      tree += `${' '.repeat(indent)}</${node.nodeName.toLowerCase()}>`;
    } else {
      tree += `</${node.nodeName.toLowerCase()}>`;
    }

    return tree;
  };

  return (
    <Box
      p={4}
      fontFamily="monospace"
      bg="gray.900"
      color="white"
      whiteSpace="pre-wrap"
      overflowX="auto"
      height="100%"
    >
      {domTree}
    </Box>
  );
}
