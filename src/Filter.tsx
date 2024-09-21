import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { PYQ } from "./types";
import { MultiSelect, Option } from "chakra-multiselect";

const getFilterOptions = (pyqs: Array<PYQ>) => {
  const paperOptions = Array.from(new Set(pyqs.map((pyq) => pyq.Paper))).map(
    (paper) => ({
      label: paper,
      value: paper,
    })
  );

  const subjectOptions = Array.from(
    new Set(pyqs.map((pyq) => pyq.Subject))
  ).map((subject) => ({
    label: subject,
    value: subject,
  }));

  const topicOptions = Array.from(
    new Set(pyqs.flatMap((pyq) => pyq.Topic))
  ).map((topic) => ({
    label: topic,
    value: topic,
  }));

  const syllabusOptions = Array.from(
    new Set(pyqs.map((pyq) => pyq.Syllabus))
  ).map((syllabus) => ({
    label: syllabus,
    value: syllabus,
  }));

  return {
    paper: paperOptions,
    subject: subjectOptions,
    topic: topicOptions,
    syllabus: syllabusOptions,
  };
};

export const Filter = () => {
  const [pyqs, setPyqs] = useState<Array<PYQ>>([]);

  const [filters, setFilters] = useState<{
    paper: Array<Option>;
    subject: Array<Option>;
    topic: Array<Option>;
    syllabus: Array<Option>;
  }>({
    paper: [],
    subject: [],
    topic: [],
    syllabus: [],
  });

  const filterOptions = useMemo(() => getFilterOptions(pyqs), [pyqs]);

  const handleFilterChange = (
    filterType: keyof typeof filters,
    selectedOptions: Array<Option>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: selectedOptions,
    }));
  };

  const readFile = async () => {
    // @ts-expect-error check
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const pvqs = JSON.parse(await file.text());
    setPyqs(pvqs);
  };

  const filteredPyqs = pyqs.filter((pyq) => {
    if (
      filters.paper.length > 0 &&
      !filters.paper.some((option) => option.value === pyq.Paper)
    ) {
      return false;
    }

    if (
      filters.subject.length > 0 &&
      !filters.subject.some((option) => option.value === pyq.Subject)
    ) {
      return false;
    }

    if (
      filters.topic.length > 0 &&
      !filters.topic.some((option) =>
        pyq.Topic.includes(option.value as string)
      )
    ) {
      return false;
    }

    if (
      filters.syllabus.length > 0 &&
      !filters.syllabus.some((option) => option.value === pyq.Syllabus)
    ) {
      return false;
    }

    return true;
  });

  if (pyqs.length === 0) {
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
    <Box p={5} position="relative">
      <Box borderRadius={10} backgroundColor="gray.900" p={4} mb={5}>
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          <GridItem w="100%">
            <MultiSelect
              options={filterOptions.paper}
              value={filters.paper}
              label="Paper"
              onChange={(selectedOptions) =>
                // @ts-expect-error check
                handleFilterChange("paper", selectedOptions)
              }
            />
          </GridItem>
          <GridItem w="100%">
            <MultiSelect
              options={filterOptions.subject}
              value={filters.subject}
              label="Subject"
              onChange={(selectedOptions) =>
                // @ts-expect-error check
                handleFilterChange("subject", selectedOptions)
              }
            />
          </GridItem>
          <GridItem w="100%">
            <MultiSelect
              options={filterOptions.topic}
              value={filters.topic}
              label="Topic"
              onChange={(selectedOptions) =>
                // @ts-expect-error check
                handleFilterChange("topic", selectedOptions)
              }
            />
          </GridItem>
          <GridItem w="100%">
            <MultiSelect
              options={filterOptions.syllabus}
              value={filters.syllabus}
              label="Syllabus"
              onChange={(selectedOptions) =>
                // @ts-expect-error check
                handleFilterChange("syllabus", selectedOptions)
              }
            />
          </GridItem>
        </Grid>
      </Box>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <TableCaption>End of results</TableCaption>
          <Thead>
            <Tr>
              <Th>Paper</Th>
              <Th>Subject</Th>
              <Th isNumeric>Year</Th>
              <Th isNumeric>Marks</Th>
              <Th>Topic</Th>
              <Th>Syllabus</Th>
              <Th>Question</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPyqs.map((pyq) => (
              <Tr key={pyq.id}>
                <Td>{pyq.Paper}</Td>
                <Td>{pyq.Subject}</Td>
                <Td isNumeric>{pyq.Year}</Td>
                <Td isNumeric>{pyq.Marks}</Td>
                <Td>{pyq.Topic.join(", ")}</Td>
                <Td>{pyq.Syllabus}</Td>
                <Td>{pyq.Question}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
