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
import { Student } from "../../types";

interface AssignmentScoreEntryComponentProps {
  students: Student[];
  componentName: string; // Should be "ASSIGNMENT"
  onScoresChange: (scores: any) => void;
  initialScores?: any;
}

// Convert number to words function
const numberToWords = (num: number): string => {
  const ones = [
    "",
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

  if (num === 0) return "Zero";

  if (num < 20) return ones[num];

  if (num < 100) {
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  }

  return "Number too large";
};

const AssignmentScoreEntryComponent: React.FC<
  AssignmentScoreEntryComponentProps
> = ({ students, componentName, onScoresChange, initialScores = {} }) => {
  // State for student scores
  const [scores, setScores] = useState<{ [studentId: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  // The max marks for assignment is 10 with passing threshold of 4
  const maxMarks = 10;
  const passingThreshold = 4;

  // Initialize scores from initial data if provided
  useEffect(() => {
    if (initialScores && Object.keys(initialScores).length > 0) {
      try {
        const initialStudentScores: { [studentId: string]: number } = {};
        Object.keys(initialScores).forEach((studentId) => {
          initialStudentScores[studentId] =
            initialScores[studentId].obtainedMarks || 0;
        });
        setScores(initialStudentScores);
      } catch (err) {
        console.error("Error parsing initial scores:", err);
        setError("Error loading initial scores");
      }
    }
  }, [initialScores]);

  // Handle score change for a student
  const handleScoreChange = (studentId: string, value: number) => {
    try {
      // Validate value is within range
      const validValue = Math.max(0, Math.min(maxMarks, value));

      // Update scores state
      setScores((prev) => ({
        ...prev,
        [studentId]: validValue,
      }));

      // Update parent component
      const updatedScores: any = {};
      students.forEach((student) => {
        const id = student._id;
        const obtainedMarks = id === studentId ? validValue : scores[id] || 0;

        updatedScores[id] = {
          componentName: "ASSIGNMENT",
          maxMarks: maxMarks,
          obtainedMarks: obtainedMarks,
        };
      });

      onScoresChange(updatedScores);
    } catch (err) {
      console.error("Error updating score:", err);
      setError("Failed to update score");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h6">Internals/Assignment</Typography>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Description */}
      <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>
        - Faculty enters the internal score under Out_of_10 for each student
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>SNo.</TableCell>
              <TableCell>Academic_Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>ENo.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell align="center">Out_of_10 (pass 4)</TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              const score = scores[student._id] || 0;
              const isPassing = score >= passingThreshold;

              return (
                <TableRow key={student._id} hover>
                  <TableCell>{studentIndex + 1}</TableCell>
                  <TableCell>{student.academicYear}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={score}
                      onChange={(e) =>
                        handleScoreChange(student._id, Number(e.target.value))
                      }
                      inputProps={{
                        min: 0,
                        max: maxMarks,
                        style: { textAlign: "center" },
                      }}
                      size="small"
                      sx={{
                        width: 70,
                        "& input": {
                          color: isPassing ? "green" : "red",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{numberToWords(score)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignmentScoreEntryComponent;
