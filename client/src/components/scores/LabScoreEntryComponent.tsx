// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Grid,
//   Button,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { Student } from "../../types";

// interface LabSession {
//   date: string;
//   maxMarks: number;
//   scores: {
//     [studentId: string]: number;
//   };
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // Should be "LAB"
//   onScoresChange: (scores: any) => void;
//   initialScores?: any;
// }

// // Convert number to words function
// const numberToWords = (num: number): string => {
//   const ones = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   if (num === 0) return "Zero";

//   if (num < 20) return ones[num];

//   if (num < 100) {
//     return (
//       tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
//     );
//   }

//   return "Number too large";
// };

// const LabScoreEntryComponent: React.FC<LabScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   // State for lab sessions
//   const [labSessions, setLabSessions] = useState<LabSession[]>([
//     {
//       date: new Date().toISOString().split("T")[0],
//       maxMarks: 10,
//       scores: {},
//     },
//     {
//       date: new Date().toISOString().split("T")[0],
//       maxMarks: 10,
//       scores: {},
//     },
//   ]);

//   const [error, setError] = useState<string | null>(null);

//   // Initialize scores from initial data if provided
//   useEffect(() => {
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       // If we have initial data, we need to transform it to our format
//       try {
//         // This is a simplified approach and might need adjustment based on your data structure
//         const sessionsFromInitial = Object.keys(initialScores).flatMap(
//           (studentId) => {
//             const studentScore = initialScores[studentId];
//             if (!studentScore || !Array.isArray(studentScore.sessions))
//               return [];

//             return studentScore.sessions.map((session) => ({
//               date: session.date,
//               maxMarks: session.maxMarks || 10,
//               studentId,
//               score: session.obtainedMarks || 0,
//             }));
//           }
//         );

//         // Group by date to consolidate sessions
//         const sessionsByDate = sessionsFromInitial.reduce((acc, curr) => {
//           if (!acc[curr.date]) {
//             acc[curr.date] = {
//               date: curr.date,
//               maxMarks: curr.maxMarks,
//               scores: {},
//             };
//           }
//           acc[curr.date].scores[curr.studentId] = curr.score;
//           return acc;
//         }, {} as Record<string, LabSession>);

//         setLabSessions(Object.values(sessionsByDate));
//       } catch (err) {
//         console.error("Error parsing initial scores:", err);
//         setError("Error loading initial scores");
//       }
//     }
//   }, [initialScores]);

//   // Add a new lab session
//   const handleAddSession = () => {
//     setLabSessions([
//       ...labSessions,
//       {
//         date: new Date().toISOString().split("T")[0],
//         maxMarks: 10,
//         scores: {},
//       },
//     ]);
//   };

//   // Remove a lab session
//   const handleRemoveSession = (indexToRemove: number) => {
//     if (labSessions.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     setLabSessions(labSessions.filter((_, index) => index !== indexToRemove));

//     // Update parent component with new scores
//     updateParentScores(
//       labSessions.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   // Handle date change for a session
//   const handleDateChange = (index: number, newDate: string) => {
//     const updatedSessions = [...labSessions];
//     updatedSessions[index].date = newDate;
//     setLabSessions(updatedSessions);

//     // Update parent component
//     updateParentScores(updatedSessions);
//   };

//   // Handle score change for a student in a specific session
//   const handleScoreChange = (
//     sessionIndex: number,
//     studentId: string,
//     value: number
//   ) => {
//     try {
//       const updatedSessions = [...labSessions];

//       // Ensure the scores object exists
//       if (!updatedSessions[sessionIndex].scores) {
//         updatedSessions[sessionIndex].scores = {};
//       }

//       // Set the student's score for this session, ensuring it's between 0 and max (10)
//       updatedSessions[sessionIndex].scores[studentId] = Math.max(
//         0,
//         Math.min(value, 10)
//       );

//       setLabSessions(updatedSessions);

//       // Update parent component
//       updateParentScores(updatedSessions);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   // Calculate total score for a student across all sessions
//   const calculateStudentTotal = (studentId: string): number => {
//     if (labSessions.length === 0) return 0;

//     // Calculate the average of session scores, scaled to 30
//     const sumOfScores = labSessions.reduce((total, session) => {
//       return total + (session.scores[studentId] || 0);
//     }, 0);

//     // Calculate average and scale to 30
//     const average = sumOfScores / labSessions.length;
//     const scaledScore = (average / 10) * 30;

//     return Math.round(scaledScore);
//   };

//   // Update the parent component with transformed scores
//   const updateParentScores = (sessions: LabSession[]) => {
//     const transformedScores: any = {};

//     students.forEach((student) => {
//       const studentSessions = sessions.map((session) => ({
//         date: session.date,
//         maxMarks: 10,
//         obtainedMarks: session.scores[student._id] || 0,
//       }));

//       const totalObtained = calculateStudentTotal(student._id);

//       transformedScores[student._id] = {
//         componentName: "LAB",
//         sessions: studentSessions,
//         maxMarks: 30,
//         totalObtained: totalObtained,
//       };
//     });

//     onScoresChange(transformedScores);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">LAB</Typography>
//         </Grid>
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           sx={{ display: "flex", justifyContent: "flex-end" }}
//         >
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleAddSession}
//             size="small"
//           >
//             Add Lab Session
//           </Button>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Description */}
//       <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>
//         - Faculty enters score under each dd/mm/yyyy out of 10 marks..each
//         dd/mm/yyyy is considered as one session
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>
//         - Out_of_30 is the average of the scores of all the sessions converted
//         to 30
//       </Typography>

//       <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic_Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>ENo.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>

//               {labSessions.map((session, index) => (
//                 <TableCell key={`session-${index}`} align="center">
//                   <TextField
//                     type="date"
//                     value={session.date}
//                     onChange={(e) => handleDateChange(index, e.target.value)}
//                     size="small"
//                     InputProps={{ sx: { fontSize: "0.875rem" } }}
//                   />
//                   {labSessions.length > 2 && (
//                     <IconButton
//                       size="small"
//                       color="error"
//                       onClick={() => handleRemoveSession(index)}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   )}
//                 </TableCell>
//               ))}

//               <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => (
//               <TableRow key={student._id} hover>
//                 <TableCell>{studentIndex + 1}</TableCell>
//                 <TableCell>{student.academicYear}</TableCell>
//                 <TableCell>{student.program}</TableCell>
//                 <TableCell>{student.registrationNumber}</TableCell>
//                 <TableCell>{student.name}</TableCell>
//                 <TableCell>{student.semester}</TableCell>

//                 {labSessions.map((session, sessionIndex) => (
//                   <TableCell
//                     key={`${student._id}-session-${sessionIndex}`}
//                     align="center"
//                   >
//                     <TextField
//                       type="number"
//                       value={session.scores[student._id] || 0}
//                       onChange={(e) =>
//                         handleScoreChange(
//                           sessionIndex,
//                           student._id,
//                           Number(e.target.value)
//                         )
//                       }
//                       inputProps={{
//                         min: 0,
//                         max: 10,
//                         style: { textAlign: "center" },
//                       }}
//                       size="small"
//                       sx={{ width: 60 }}
//                     />
//                   </TableCell>
//                 ))}

//                 <TableCell align="center">
//                   <Typography
//                     variant="body1"
//                     fontWeight="bold"
//                     color={
//                       calculateStudentTotal(student._id) >= 15
//                         ? "success.main"
//                         : "error.main"
//                     }
//                   >
//                     {calculateStudentTotal(student._id)}
//                   </Typography>
//                 </TableCell>

//                 <TableCell>
//                   {numberToWords(calculateStudentTotal(student._id))}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

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
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Student } from "../../types";

interface LabSession {
  date: string;
  scores: {
    [studentId: string]: number;
  };
}

interface LabScoreEntryComponentProps {
  students: Student[];
  componentName: string; // Should be "LAB"
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

const LabScoreEntryComponent: React.FC<LabScoreEntryComponentProps> = ({
  students,
  componentName,
  onScoresChange,
  initialScores = {},
}) => {
  // State for lab sessions
  const [labSessions, setLabSessions] = useState<LabSession[]>([
    {
      date: new Date().toISOString().split("T")[0],
      scores: {},
    },
    {
      date: new Date().toISOString().split("T")[0],
      scores: {},
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  // Initialize scores from initial data if provided
  useEffect(() => {
    if (initialScores && Object.keys(initialScores).length > 0) {
      try {
        // This is a simplified approach and might need adjustment based on your data structure
        const sessionsFromInitial: LabSession[] = [];

        // Extract unique dates from all student sessions
        const allDates = new Set<string>();

        Object.values(initialScores).forEach((scoreData: any) => {
          if (scoreData?.sessions && Array.isArray(scoreData.sessions)) {
            scoreData.sessions.forEach((session: any) => {
              if (session.date) {
                allDates.add(session.date);
              }
            });
          }
        });

        // Create sessions for each date
        Array.from(allDates).forEach((date) => {
          sessionsFromInitial.push({
            date,
            scores: {},
          });
        });

        // If we have dates, use them; otherwise use default
        if (sessionsFromInitial.length > 0) {
          // Fill in scores for each student for each session
          Object.entries(initialScores).forEach(
            ([studentId, scoreData]: [string, any]) => {
              if (scoreData?.sessions && Array.isArray(scoreData.sessions)) {
                scoreData.sessions.forEach((session: any) => {
                  const sessionIndex = sessionsFromInitial.findIndex(
                    (s) => s.date === session.date
                  );
                  if (sessionIndex >= 0) {
                    sessionsFromInitial[sessionIndex].scores[studentId] =
                      session.obtainedMarks || 0;
                  }
                });
              }
            }
          );

          setLabSessions(sessionsFromInitial);
        }
      } catch (err) {
        console.error("Error parsing initial scores:", err);
        setError("Error loading initial scores");
      }
    }
  }, [initialScores]);

  // Add a new lab session
  const handleAddSession = () => {
    setLabSessions((prevSessions) => [
      ...prevSessions,
      {
        date: new Date().toISOString().split("T")[0],
        scores: {},
      },
    ]);
  };

  // Remove a lab session
  const handleRemoveSession = (indexToRemove: number) => {
    if (labSessions.length <= 2) {
      setError("You must have at least two lab sessions");
      return;
    }

    setLabSessions((prevSessions) =>
      prevSessions.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle date change for a session
  const handleDateChange = (index: number, newDate: string) => {
    setLabSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      updatedSessions[index] = {
        ...updatedSessions[index],
        date: newDate,
      };
      return updatedSessions;
    });
  };

  // Handle score change for a student in a specific session
  const handleScoreChange = (
    sessionIndex: number,
    studentId: string,
    value: number
  ) => {
    try {
      // Ensure value is between 0 and 10
      const validValue = Math.max(0, Math.min(10, value));

      setLabSessions((prevSessions) => {
        const updatedSessions = [...prevSessions];

        // Create a new scores object to avoid mutation
        updatedSessions[sessionIndex] = {
          ...updatedSessions[sessionIndex],
          scores: {
            ...updatedSessions[sessionIndex].scores,
            [studentId]: validValue,
          },
        };

        return updatedSessions;
      });

      // Update parent component with transformed scores
      updateParentScores();
    } catch (err) {
      console.error("Error updating score:", err);
      setError("Failed to update score");
    }
  };

  // Calculate total score for a student across all sessions
  const calculateStudentTotal = (studentId: string): number => {
    if (labSessions.length === 0) return 0;

    // Calculate the average of session scores, scaled to 30
    const sumOfScores = labSessions.reduce((total, session) => {
      return total + (session.scores[studentId] || 0);
    }, 0);

    // Calculate average and scale to 30
    const average = sumOfScores / labSessions.length;
    const scaledScore = (average / 10) * 30;

    return Math.round(scaledScore);
  };

  // Update the parent component with transformed scores
  const updateParentScores = () => {
    const transformedScores: any = {};

    students.forEach((student) => {
      const studentSessions = labSessions.map((session) => ({
        date: session.date,
        maxMarks: 10,
        obtainedMarks: session.scores[student._id] || 0,
      }));

      const totalObtained = calculateStudentTotal(student._id);

      transformedScores[student._id] = {
        componentName: "LAB",
        sessions: studentSessions,
        maxMarks: 30,
        totalObtained: totalObtained,
      };
    });

    onScoresChange(transformedScores);
  };

  // Update parent whenever sessions change
  useEffect(() => {
    updateParentScores();
  }, [labSessions]);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">LAB</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSession}
            size="small"
          >
            Add Lab Session
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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

              {labSessions.map((session, index) => (
                <TableCell key={`session-${index}`} align="center">
                  <TextField
                    type="date"
                    value={session.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    size="small"
                    InputProps={{ sx: { fontSize: "0.875rem" } }}
                  />
                  {labSessions.length > 2 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveSession(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              ))}

              <TableCell align="center">Out_of_30 (pass 15)</TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => (
              <TableRow key={student._id} hover>
                <TableCell>{studentIndex + 1}</TableCell>
                <TableCell>{student.academicYear}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.registrationNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.semester}</TableCell>

                {labSessions.map((session, sessionIndex) => (
                  <TableCell
                    key={`${student._id}-session-${sessionIndex}`}
                    align="center"
                  >
                    <TextField
                      type="number"
                      value={session.scores[student._id] || 0}
                      onChange={(e) =>
                        handleScoreChange(
                          sessionIndex,
                          student._id,
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: 10,
                        style: { textAlign: "center" },
                      }}
                      size="small"
                      sx={{ width: 60 }}
                    />
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color={
                      calculateStudentTotal(student._id) >= 15
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {calculateStudentTotal(student._id)}
                  </Typography>
                </TableCell>

                <TableCell>
                  {numberToWords(calculateStudentTotal(student._id))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LabScoreEntryComponent;
