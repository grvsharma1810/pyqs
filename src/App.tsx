import { Box, Button, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";

type PYQ = {
  Paper: string;
  Subject: string;
  Syllabus: string;
  Topic: string[];
  Year: number;
  Marks: number;
  Question: string;
  id: string;
};

function App() {
  const [fileHandle, setFileHandle] = useState<unknown>(null);
  const [pyqs, setPyqs] = useState<Array<PYQ>>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [syllabus, setSyllabus] = useState("");
  const [topic, setTopic] = useState("");

  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSyllabusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSyllabus(event.target.value);
    setIsSaved(false);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(event.target.value);
    setIsSaved(false);
  };

  const readFile = async () => {
    // @ts-expect-error check
    const [fileHandle] = await window.showOpenFilePicker();
    setFileHandle(fileHandle);
    const file = await fileHandle.getFile();
    const pvqs = JSON.parse(await file.text());
    setPyqs(pvqs);
    setSyllabus(pvqs[currentQuestion].Syllabus);
    setTopic(pvqs[currentQuestion].Topic.join(", "));
  };

  const handleNext = () => {
    if (currentQuestion < pyqs.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSyllabus(pyqs[currentQuestion].Syllabus);
      setTopic(pyqs[currentQuestion].Topic.join(", "));
    }
  };
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSyllabus(pyqs[currentQuestion].Syllabus);
      setTopic(pyqs[currentQuestion].Topic.join(", "));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    pyqs[currentQuestion].Syllabus = syllabus;
    pyqs[currentQuestion].Topic = topic.split(",").map((t) => t.trim());

    const contents = JSON.stringify(pyqs);
    // @ts-expect-error check
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
    setIsSaving(false);
    setIsSaved(true);
  };

  if (!fileHandle || pyqs.length === 0) {
    return (
      <Box
        display="flex"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Button size="lg" colorScheme="teal" onClick={readFile}>
          Select File
        </Button>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="80%">
        <form>
          <Stack rowGap={10}>
            <Text fontSize="3xl">
              {currentQuestion + 1}. {pyqs[currentQuestion].Question}
            </Text>

            <Stack>
              <Text fontSize="md" fontWeight={800}>
                Syllabus
              </Text>
              <Input
                placeholder="Syllabus"
                size="lg"
                value={syllabus}
                onChange={handleSyllabusChange}
              />
            </Stack>

            <Stack>
              <Text fontSize="md" fontWeight={800}>
                Topic
              </Text>
              <Textarea
                placeholder="Syllabus"
                size="lg"
                value={topic}
                onChange={handleTopicChange}
              />
            </Stack>

            <Box display="flex" justifyContent="flex-end" columnGap={5}>
              <Button size="lg" onClick={handlePrevious}>
                Previous
              </Button>
              <Button size="lg" onClick={handleNext}>
                Next
              </Button>
              <Button
                size="lg"
                variant="solid"
                colorScheme="teal"
                onClick={handleSave}
                isLoading={isSaving}
                isDisabled={isSaved}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default App;
