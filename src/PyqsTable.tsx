import { Box } from "@chakra-ui/react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { PYQ } from "./types";

const getTableRows = (data?: PYQ[]): GridRowsProp => {
  if (!data) return [];

  return data.map((pyq: PYQ) => ({
    id: pyq.id,
    paper: pyq.Paper,
    subject: pyq.Subject,
    year: pyq.Year,
    marks: pyq.Marks,
    topics: pyq.Topic.join(", "),
    syllabus: pyq.Syllabus,
    question: pyq.Question,
  }));
};

const columns: GridColDef[] = [
  { field: "year", headerName: "Year", width: 100 },
  { field: "question", headerName: "Question", width: 500 },
  { field: "paper", headerName: "Paper", width: 80 },
  { field: "subject", headerName: "Subject", width: 150 },
  { field: "marks", headerName: "Marks", width: 70 },
  { field: "topics", headerName: "Topics", width: 200 },
  { field: "syllabus", headerName: "Syllabus", width: 500 },
];

export const PyqsTable = ({ pyq }: { pyq: PYQ[] }) => {
  const rows = getTableRows(pyq);

  return (
    <Box width="100%" height="600px" paddingBottom={4}>
      <DataGrid
        getRowHeight={() => "auto"}
        rows={rows}
        columns={columns}
      />
    </Box>
  );
};
