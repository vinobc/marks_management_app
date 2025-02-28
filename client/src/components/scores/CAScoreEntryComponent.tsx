import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Student {
  id: string;
  _id?: string;
  registrationNumber: string;
  name: string;
  program: string;
  semester: number;
  academicYear: string;
}

interface QuestionScores {
  a: number;
  b: number;
  c: number;
  d: number;
  total: number;
}

interface StudentScores {
  I: QuestionScores;
  II: QuestionScores;
  III: QuestionScores;
  IV: QuestionScores;
  V: QuestionScores;
  outOf50: number;
  outOf20: number;
}

interface StudentScoreMap {
  [studentId: string]: StudentScores;
}

interface CAScoreEntryComponentProps {
  students: Student[];
  componentName: string; // e.g., "CA1", "CA2"
  onScoresChange: (scores: any) => void;
  initialScores?: any;
}

// Max marks for each question part
const DEFAULT_MAX_MARKS = {
  I: { a: 3, b: 3, c: 2, d: 2 },
  II: { a: 4, b: 4, c: 1, d: 1 },
  III: { a: 3, b: 3, c: 2, d: 2 },
  IV: { a: 3, b: 2, c: 3, d: 2 },
  V: { a: 4, b: 3, c: 2, d: 1 },
};

// Function to convert number to words
const numberToWords = (num: number): string => {
  const units = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num < 0) return "Negative " + numberToWords(Math.abs(num));
  if (num < 20) return units[num];
  if (num < 100) {
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "")
    );
  }

  // For simplicity we're only handling up to 99, but you can extend this
  return "Number too large";
};

const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
  students,
  componentName,
  onScoresChange,
  initialScores,
}) => {
  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [studentScores, setStudentScores] = useState<StudentScoreMap>({});

  // Initialize scores with default values
  useEffect(() => {
    const initialStudentScores: StudentScoreMap = {};

    students.forEach((student) => {
      // Check if we have initial scores for this student
      if (initialScores && initialScores[student.id]) {
        initialStudentScores[student.id] = initialScores[student.id];
      } else {
        // Create default score structure for each student
        initialStudentScores[student.id] = {
          I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          outOf50: 0,
          outOf20: 0,
        };
      }
    });

    setStudentScores(initialStudentScores);
  }, [students, initialScores]);

  // Handle score change for a specific question part
  const handleScoreChange = (
    studentId: string,
    questionNum: "I" | "II" | "III" | "IV" | "V",
    part: "a" | "b" | "c" | "d",
    value: number
  ) => {
    // Make sure value is a number between 0 and the max for this part
    const maxValue = DEFAULT_MAX_MARKS[questionNum][part];
    const validValue = Math.max(0, Math.min(maxValue, value));

    setStudentScores((prev) => {
      const updatedScores = { ...prev };

      // Update the specific part score
      updatedScores[studentId][questionNum][part] = validValue;

      // Recalculate the question total
      updatedScores[studentId][questionNum].total =
        updatedScores[studentId][questionNum].a +
        updatedScores[studentId][questionNum].b +
        updatedScores[studentId][questionNum].c +
        updatedScores[studentId][questionNum].d;

      // Recalculate Out_of_50
      updatedScores[studentId].outOf50 =
        updatedScores[studentId].I.total +
        updatedScores[studentId].II.total +
        updatedScores[studentId].III.total +
        updatedScores[studentId].IV.total +
        updatedScores[studentId].V.total;

      // Recalculate Out_of_20 (converting from 50 to 20)
      updatedScores[studentId].outOf20 = Math.round(
        (updatedScores[studentId].outOf50 * 20) / 50
      );

      // Notify parent component about score changes
      onScoresChange(updatedScores);

      return updatedScores;
    });
  };

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6">{componentName} Score Entry</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Test Date"
              value={testDate}
              onChange={(newDate) => setTestDate(newDate)}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: "100%", overflowX: "auto" }}
      >
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" rowSpan={2}>
                SNo.
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Academic Year
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Program
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Enrollment No.
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Name
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Semester
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Q.No.
              </TableCell>
              <TableCell align="center" colSpan={4}>
                Parts
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Total
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Out of 50
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Out of 20 (pass 8)
              </TableCell>
              <TableCell align="center" rowSpan={2}>
                Marks in Words
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" width="60px">
                a
              </TableCell>
              <TableCell align="center" width="60px">
                b
              </TableCell>
              <TableCell align="center" width="60px">
                c
              </TableCell>
              <TableCell align="center" width="60px">
                d
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => {
              // Get scores for this student
              const scores = studentScores[student.id] || {
                I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                outOf50: 0,
                outOf20: 0,
              };

              // Generate rows for questions I-V
              const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
                "I",
                "II",
                "III",
                "IV",
                "V",
              ];

              return questions.map((question, qIndex) => (
                <TableRow
                  key={`${student.id}-${question}`}
                  sx={{
                    backgroundColor: qIndex === 0 ? "#f8f9fa" : "inherit",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  {/* Only show student info in the first question row */}
                  {qIndex === 0 && (
                    <>
                      <TableCell align="center" rowSpan={5}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {student.academicYear}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {student.program}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {student.registrationNumber}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {student.name}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {student.semester}
                      </TableCell>
                    </>
                  )}
                  <TableCell align="center">{question}</TableCell>

                  {/* Score input cells */}
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={scores[question].a}
                      onChange={(e) =>
                        handleScoreChange(
                          student.id,
                          question,
                          "a",
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: DEFAULT_MAX_MARKS[question].a,
                        style: { textAlign: "center", width: "40px" },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={scores[question].b}
                      onChange={(e) =>
                        handleScoreChange(
                          student.id,
                          question,
                          "b",
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: DEFAULT_MAX_MARKS[question].b,
                        style: { textAlign: "center", width: "40px" },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={scores[question].c}
                      onChange={(e) =>
                        handleScoreChange(
                          student.id,
                          question,
                          "c",
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: DEFAULT_MAX_MARKS[question].c,
                        style: { textAlign: "center", width: "40px" },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={scores[question].d}
                      onChange={(e) =>
                        handleScoreChange(
                          student.id,
                          question,
                          "d",
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: DEFAULT_MAX_MARKS[question].d,
                        style: { textAlign: "center", width: "40px" },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{scores[question].total}</TableCell>

                  {/* Only show total scores in the last question row */}
                  {qIndex === 4 && (
                    <>
                      <TableCell align="center" rowSpan={5}>
                        {scores.outOf50}
                      </TableCell>
                      <TableCell
                        align="center"
                        rowSpan={5}
                        sx={{
                          color: scores.outOf20 >= 8 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {scores.outOf20}
                      </TableCell>
                      <TableCell align="center" rowSpan={5}>
                        {numberToWords(scores.outOf20)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CAScoreEntryComponent;
