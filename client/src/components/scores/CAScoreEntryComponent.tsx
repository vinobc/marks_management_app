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
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Student } from "../../types";
import { CourseType } from "../../types";
import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";
import ErrorBoundary from "./ErrorBoundary";

interface DetailedScore {
  [studentId: string]: {
    I: { a: number; b: number; c: number; d: number; total: number };
    II: { a: number; b: number; c: number; d: number; total: number };
    III: { a: number; b: number; c: number; d: number; total: number };
    IV: { a: number; b: number; c: number; d: number; total: number };
    V: { a: number; b: number; c: number; d: number; total: number };
    outOf50: number;
    outOf20: number;
  };
}

interface CAScoreEntryComponentProps {
  students: Student[];
  componentName: string;
  courseType: CourseType;
  onScoresChange: (scores: DetailedScore) => void;
  initialScores?: DetailedScore;
}

const numberToWords = (num: number): string => {
  const numStr = num.toString();
  const digits = numStr.split("");
  const words = digits.map((digit) => {
    switch (digit) {
      case "0":
        return "ZERO";
      case "1":
        return "ONE";
      case "2":
        return "TWO";
      case "3":
        return "THREE";
      case "4":
        return "FOUR";
      case "5":
        return "FIVE";
      case "6":
        return "SIX";
      case "7":
        return "SEVEN";
      case "8":
        return "EIGHT";
      case "9":
        return "NINE";
      default:
        return "";
    }
  });
  return words.join(" ");
};

export const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
  students,
  componentName,
  courseType,
  onScoresChange,
  initialScores = {},
}) => {
  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [scores, setScores] = useState<DetailedScore>(initialScores);
  const [error, setError] = useState<string | null>(null);

  const scaleConfig = getComponentScale(courseType, componentName);
  const maxMarks = scaleConfig.maxMarks;
  const passingMarks = scaleConfig.passingMarks;

  useEffect(() => {
    if (initialScores && Object.keys(initialScores).length > 0) {
      try {
        const formattedScores: DetailedScore = {};
        Object.keys(initialScores).forEach((studentId) => {
          const studentScore = initialScores[studentId];
          formattedScores[studentId] = {
            I: studentScore.I || { a: 0, b: 0, c: 0, d: 0, total: 0 },
            II: studentScore.II || { a: 0, b: 0, c: 0, d: 0, total: 0 },
            III: studentScore.III || { a: 0, b: 0, c: 0, d: 0, total: 0 },
            IV: studentScore.IV || { a: 0, b: 0, c: 0, d: 0, total: 0 },
            V: studentScore.V || { a: 0, b: 0, c: 0, d: 0, total: 0 },
            outOf50: studentScore.outOf50 || 0,
            outOf20: studentScore.outOf20 || 0,
          };
        });
        setScores(formattedScores);
      } catch (error) {
        console.error("Error parsing initial scores:", error);
        setError("Error loading initial scores");
      }
    } else {
      const newScores: DetailedScore = {};
      (students || []).forEach((student) => {
        if (student && student._id) {
          newScores[student._id] = {
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
      setScores(newScores);
    }
  }, [students, initialScores]);

  const handleScoreChange = (
    studentId: string,
    question: "I" | "II" | "III" | "IV" | "V",
    part: "a" | "b" | "c" | "d",
    value: number
  ) => {
    if (!studentId) {
      console.error("Missing studentId in handleScoreChange");
      return;
    }
    try {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        setError("Please enter a valid positive number");
        return;
      }

      setScores((prev) => {
        // Make a deep copy of the previous scores object
        const newScores = JSON.parse(JSON.stringify(prev));

        // Ensure the student object exists
        if (!newScores[studentId]) {
          newScores[studentId] = {
            I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
            II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
            III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
            IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
            V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
            outOf50: 0,
            outOf20: 0,
          };
        }

        // Ensure the question object exists
        if (!newScores[studentId][question]) {
          newScores[studentId][question] = { a: 0, b: 0, c: 0, d: 0, total: 0 };
        }

        // Update the specific part
        newScores[studentId][question][part] = numValue;

        // Recalculate question total
        newScores[studentId][question].total =
          (newScores[studentId][question].a || 0) +
          (newScores[studentId][question].b || 0) +
          (newScores[studentId][question].c || 0) +
          (newScores[studentId][question].d || 0);

        // Recalculate outOf50
        newScores[studentId].outOf50 =
          (newScores[studentId].I?.total || 0) +
          (newScores[studentId].II?.total || 0) +
          (newScores[studentId].III?.total || 0) +
          (newScores[studentId].IV?.total || 0) +
          (newScores[studentId].V?.total || 0);

        // Recalculate outOf20 (or whatever the scaled value is)
        newScores[studentId].outOf20 = convertCAScore(
          newScores[studentId].outOf50,
          courseType,
          componentName
        );

        // Update parent component with the new scores
        onScoresChange(newScores);

        return newScores;
      });

      setError(null);
    } catch (err) {
      console.error("Error updating score:", err);
      setError("Failed to update score");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{componentName} Score Entry</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Test Date"
              value={testDate}
              onChange={(newDate) => setTestDate(newDate)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", width: "100%" }}
      >
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Academic_Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Enrollment No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Q.No.</TableCell>
              <TableCell align="center">a</TableCell>
              <TableCell align="center">b</TableCell>
              <TableCell align="center">c</TableCell>
              <TableCell align="center">d</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Out_of_50</TableCell>
              <TableCell align="center">
                Out_of_{maxMarks} (pass {passingMarks})
              </TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              if (!student || !student._id) return null;

              // Safety check - ensure this student has a score record
              if (!scores[student._id]) {
                // If no score exists for this student, initialize it
                scores[student._id] = {
                  I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  outOf50: 0,
                  outOf20: 0,
                };
              }

              const studentScore = scores[student._id];
              const scaledScore = studentScore.outOf20 || 0;
              const isPassing = scaledScore >= passingMarks;

              const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
                "I",
                "II",
                "III",
                "IV",
                "V",
              ];

              // Return a fragment containing all rows for this student
              return (
                <React.Fragment key={`student-${student._id}`}>
                  {questions.map((questionNo, questionIndex) => {
                    // Safety check for each question
                    if (!studentScore[questionNo]) {
                      studentScore[questionNo] = {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        total: 0,
                      };
                    }

                    return (
                      <TableRow key={`${student._id}-${questionNo}`}>
                        {/* Student info cells - only on first row */}
                        {questionIndex === 0 && (
                          <>
                            <TableCell rowSpan={5}>
                              {studentIndex + 1}
                            </TableCell>
                            <TableCell rowSpan={5}>
                              {student.academicYear}
                            </TableCell>
                            <TableCell rowSpan={5}>{student.program}</TableCell>
                            <TableCell rowSpan={5}>
                              {student.registrationNumber}
                            </TableCell>
                            <TableCell rowSpan={5}>{student.name}</TableCell>
                            <TableCell rowSpan={5}>
                              {student.semester}
                            </TableCell>
                          </>
                        )}

                        {/* Question number */}
                        <TableCell>{questionNo}</TableCell>

                        {/* Question parts inputs */}
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={studentScore[questionNo].a || 0}
                            onChange={(e) =>
                              handleScoreChange(
                                student._id,
                                questionNo,
                                "a",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            size="small"
                            sx={{ width: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={studentScore[questionNo].b || 0}
                            onChange={(e) =>
                              handleScoreChange(
                                student._id,
                                questionNo,
                                "b",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            size="small"
                            sx={{ width: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={studentScore[questionNo].c || 0}
                            onChange={(e) =>
                              handleScoreChange(
                                student._id,
                                questionNo,
                                "c",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            size="small"
                            sx={{ width: 60 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={studentScore[questionNo].d || 0}
                            onChange={(e) =>
                              handleScoreChange(
                                student._id,
                                questionNo,
                                "d",
                                Number(e.target.value)
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            size="small"
                            sx={{ width: 60 }}
                          />
                        </TableCell>

                        {/* Question total */}
                        <TableCell align="center">
                          {studentScore[questionNo].total || 0}
                        </TableCell>

                        {/* Student totals - only on first row */}
                        {questionIndex === 0 && (
                          <>
                            <TableCell align="center" rowSpan={5}>
                              {studentScore.outOf50 || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              rowSpan={5}
                              sx={{
                                color: isPassing
                                  ? "success.main"
                                  : "error.main",
                                fontWeight: "bold",
                              }}
                            >
                              {scaledScore}
                            </TableCell>
                            <TableCell rowSpan={5}>
                              {numberToWords(scaledScore)}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Wrap the component with ErrorBoundary at export
const WrappedCAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = (
  props
) => (
  <ErrorBoundary
    fallback={
      <Paper
        elevation={3}
        sx={{
          p: 3,
          m: 2,
          backgroundColor: "#fff8f8",
          borderLeft: "4px solid #f44336",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" paragraph>
          There was an error in the CA Score Entry component.
        </Typography>
      </Paper>
    }
  >
    <CAScoreEntryComponent {...props} />
  </ErrorBoundary>
);

export default WrappedCAScoreEntryComponent;
