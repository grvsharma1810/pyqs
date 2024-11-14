import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { PYQ } from "./types";
import { MultiSelect, Option } from "chakra-multiselect";
import { PyqsTable } from "./PyqsTable";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import pyq_json from "./pyqs_4.json"

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

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
console.log(pyq_json)
export const Filter = () => {
  const [pyqs] = useState<Array<PYQ>>(pyq_json);


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

  // const readFile = async () => {
  //   const [fileHandle] = await window.showOpenFilePicker();
  //   const file = await fileHandle.getFile();
  //   const file = readFileSync('./assets/pyqs_4.json', 'utf-8');
  //   const pvqs = JSON.parse(await file.text());
  //   setPyqs(pvqs);
  // };

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

  // if (pyqs.length === 0) {
  //   return (
  //     <Box
  //       display="flex"
  //       height="100vh"
  //       alignItems="center"
  //       justifyContent="center"
  //     >
  //       <Button size="lg" colorScheme="teal" onClick={readFile}>
  //         Select File
  //       </Button>
  //     </Box>
  //   );
  // }

  return (
    <Box p={5} position="relative">
      <Box borderRadius={10} backgroundColor="blackAlpha.600" p={4} mb={5}>
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PyqsTable pyq={filteredPyqs} />
      </ThemeProvider>
    </Box>
  );
};
