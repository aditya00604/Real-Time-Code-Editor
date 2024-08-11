"use client";
import { useState, useRef } from 'react';
import { Box, Flex, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Input, Button } from '@chakra-ui/react';
import CodeEditor from '@/components/CodeEditor';
import PreviewPane from '@/components/PreviewPane';

export default function HomePage() {
  const [html, setHtml] = useState('<h1>Hello, World!</h1>');
  const [css, setCss] = useState('h1 { color: red; }');
  const [js, setJs] = useState('console.log("Hello, World!");');
  const [activeTab, setActiveTab] = useState('html');
  const [suggestion, setSuggestion] = useState('');
  const [isSuggestionVisible, setSuggestionVisible] = useState(false);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const dividerRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        parseHTMLContent(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid HTML file.');
    }
  };

  const parseHTMLContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    const bodyContent = Array.from(doc.body.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE && !['STYLE', 'SCRIPT'].includes(node.nodeName))
      .map(node => node.outerHTML)
      .join('');
    setHtml(bodyContent);

    const styleTags = Array.from(doc.querySelectorAll('style'));
    const cssContent = styleTags.map(style => style.innerHTML).join('\n');
    setCss(cssContent);

    const scriptTags = Array.from(doc.querySelectorAll('script'));
    const jsContent = scriptTags.map(script => script.innerHTML).join('\n');
    setJs(jsContent);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startLeftWidth = leftPanelRef.current.getBoundingClientRect().width;

    const handleMouseMove = (e) => {
      const newWidth = startLeftWidth + (e.clientX - startX);
      const minWidth = 100;
      const maxWidth = window.innerWidth - 200;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        leftPanelRef.current.style.flexBasis = `${newWidth}px`;
        rightPanelRef.current.style.flexBasis = `calc(100% - ${newWidth}px - ${dividerRef.current.offsetWidth}px)`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTabChange = (index) => {
    const tabs = ['html', 'css', 'js'];
    setActiveTab(tabs[index]);
  };

  const handleContentUpload = () => {
    let content = '';
    if (activeTab === 'html') {
      content = html;
    } else if (activeTab === 'css') {
      content = css;
    } else if (activeTab === 'js') {
      content = js;
    }

    console.log(`Sending ${activeTab} content to backend:`, content);
  };

  const handleAISuggestion = async () => {
    let content = '';
    if (activeTab === 'html') {
      content = html;
    } else if (activeTab === 'css') {
      content = css;
    } else if (activeTab === 'js') {
      content = js;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, type: activeTab }),
    });

    const { suggestion } = await response.json();
    setSuggestion(suggestion);
    setSuggestionVisible(true);
  };

  const handleKeyDown = (event) => {
    if (isSuggestionVisible) {
      if (event.key === 'ArrowRight') {
        event.preventDefault(); // Prevent default ArrowRight behavior
        if (activeTab === 'html') {
          setHtml((prevHtml) => prevHtml + suggestion);
        } else if (activeTab === 'css') {
          setCss((prevCss) => prevCss + suggestion);
        } else if (activeTab === 'js') {
          setJs((prevJs) => prevJs + suggestion);
        }
        setSuggestionVisible(false);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault(); // Prevent default ArrowLeft behavior
        setSuggestionVisible(false); // Discard the suggestion
      }
    }
  };

  return (
    <Flex direction="row" h="100vh" overflow="hidden" borderWidth="1px" borderColor="gray.200">
      <Box
        ref={leftPanelRef}
        flex="0 1 40%"
        p={4}
        borderRight="1px"
        borderColor="gray.300"
        overflow="auto"
        display="flex"
        flexDirection="column"
        onKeyDown={handleKeyDown}
        tabIndex={0} // Make the box focusable to capture key events
      >
        <Heading mb={4} fontSize="2xl" color="teal.600">Real-Time Code Editor</Heading>
        <Input
          id="file-input"
          type="file"
          accept=".html"
          onChange={handleFileUpload}
          mb={4}
          placeholder="Upload HTML file"
          borderColor="gray.300"
        />
        <Tabs variant="solid-rounded" height="calc(100% - 80px)" onChange={handleTabChange}>
          <TabList>
            <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'teal.500' }}>HTML</Tab>
            <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'teal.500' }}>CSS</Tab>
            <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'teal.500' }}>JavaScript</Tab>
          </TabList>
          <TabPanels height="calc(100% - 40px)">
            <TabPanel p={0} height="100%">
              <CodeEditor language="html" code={html} setCode={setHtml} />
              {isSuggestionVisible && (
                <Box
                  position="absolute"
                  bg="rgba(0, 0, 0, 0.1)"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.300"
                  top="10px"
                  left="10px"
                  zIndex={10}
                >
                  {suggestion}
                </Box>
              )}
            </TabPanel>
            <TabPanel p={0} height="100%">
              <CodeEditor language="css" code={css} setCode={setCss} />
              {isSuggestionVisible && (
                <Box
                  position="absolute"
                  bg="rgba(0, 0, 0, 0.1)"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.300"
                  top="10px"
                  left="10px"
                  zIndex={10}
                >
                  {suggestion}
                </Box>
              )}
            </TabPanel>
            <TabPanel p={0} height="100%">
              <CodeEditor language="js" code={js} setCode={setJs} />
              {isSuggestionVisible && (
                <Box
                  position="absolute"
                  bg="rgba(0, 0, 0, 0.1)"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.300"
                  top="10px"
                  left="10px"
                  zIndex={10}
                >
                  {suggestion}
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button 
          mt={4} 
          onClick={handleAISuggestion}
          colorScheme="teal"
          width="100%"
          borderRadius="md"
          boxShadow="md"
          _hover={{ boxShadow: 'lg' }}
        >
          Get AI Suggestion
        </Button>
      </Box>
      <Box
        ref={dividerRef}
        w="4px"
        bg="gray.300"
        cursor="ew-resize"
        onMouseDown={handleMouseDown}
        h="100%"
      />
      <Box
        ref={rightPanelRef}
        flex="1"
        p={4}
        overflow="hidden"
        position="relative"
        display="flex"
        flexDirection="column"
        borderLeft="1px"
        borderColor="gray.300"
      >
        <PreviewPane html={html} css={css} js={js} />
      </Box>
    </Flex>
  );
}
