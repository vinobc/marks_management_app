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
//       scores: {},
//     },
//     {
//       date: new Date().toISOString().split("T")[0],
//       scores: {},
//     },
//   ]);

//   const [error, setError] = useState<string | null>(null);

//   // Initialize scores from initial data if provided
//   useEffect(() => {
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       try {
//         // This is a simplified approach and might need adjustment based on your data structure
//         const sessionsFromInitial: LabSession[] = [];

//         // Extract unique dates from all student sessions
//         const allDates = new Set<string>();

//         Object.values(initialScores).forEach((scoreData: any) => {
//           if (scoreData?.sessions && Array.isArray(scoreData.sessions)) {
//             scoreData.sessions.forEach((session: any) => {
//               if (session.date) {
//                 allDates.add(session.date);
//               }
//             });
//           }
//         });

//         // Create sessions for each date
//         Array.from(allDates).forEach((date) => {
//           sessionsFromInitial.push({
//             date,
//             scores: {},
//           });
//         });

//         // If we have dates, use them; otherwise use default
//         if (sessionsFromInitial.length > 0) {
//           // Fill in scores for each student for each session
//           Object.entries(initialScores).forEach(
//             ([studentId, scoreData]: [string, any]) => {
//               if (scoreData?.sessions && Array.isArray(scoreData.sessions)) {
//                 scoreData.sessions.forEach((session: any) => {
//                   const sessionIndex = sessionsFromInitial.findIndex(
//                     (s) => s.date === session.date
//                   );
//                   if (sessionIndex >= 0) {
//                     sessionsFromInitial[sessionIndex].scores[studentId] =
//                       session.obtainedMarks || 0;
//                   }
//                 });
//               }
//             }
//           );

//           setLabSessions(sessionsFromInitial);
//         }
//       } catch (err) {
//         console.error("Error parsing initial scores:", err);
//         setError("Error loading initial scores");
//       }
//     }
//   }, [initialScores]);

//   // Add a new lab session
//   const handleAddSession = () => {
//     setLabSessions((prevSessions) => [
//       ...prevSessions,
//       {
//         date: new Date().toISOString().split("T")[0],
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

//     setLabSessions((prevSessions) =>
//       prevSessions.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   // Handle date change for a session
//   const handleDateChange = (index: number, newDate: string) => {
//     setLabSessions((prevSessions) => {
//       const updatedSessions = [...prevSessions];
//       updatedSessions[index] = {
//         ...updatedSessions[index],
//         date: newDate,
//       };
//       return updatedSessions;
//     });
//   };

//   // Handle score change for a student in a specific session
//   const handleScoreChange = (
//     sessionIndex: number,
//     studentId: string,
//     value: number
//   ) => {
//     try {
//       // Ensure value is between 0 and 10
//       const validValue = Math.max(0, Math.min(10, value));

//       setLabSessions((prevSessions) => {
//         const updatedSessions = [...prevSessions];

//         // Create a new scores object to avoid mutation
//         updatedSessions[sessionIndex] = {
//           ...updatedSessions[sessionIndex],
//           scores: {
//             ...updatedSessions[sessionIndex].scores,
//             [studentId]: validValue,
//           },
//         };

//         return updatedSessions;
//       });

//       // Update parent component with transformed scores
//       updateParentScores();
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
//   const updateParentScores = () => {
//     const transformedScores: any = {};

//     students.forEach((student) => {
//       const studentSessions = labSessions.map((session) => ({
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

//   // Update parent whenever sessions change
//   useEffect(() => {
//     updateParentScores();
//   }, [labSessions]);

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

// // Define the structure exactly as used in DynamicScoreEntry component
// interface LabScore {
//   componentName: string;
//   sessions: {
//     date: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
//   maxMarks: number;
//   totalObtained: number;
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
//   initialScores?: { [studentId: string]: LabScore };
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
//   // Store session dates
//   const [sessionDates, setSessionDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//     new Date().toISOString().split("T")[0],
//   ]);

//   // Store student scores directly in the format expected by parent
//   const [studentScores, setStudentScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});

//   const [error, setError] = useState<string | null>(null);

//   // Initialize from props
//   useEffect(() => {
//     // Initialize dates from initialScores if available
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       try {
//         // Extract dates from the first student's sessions
//         const firstStudentId = Object.keys(initialScores)[0];
//         const sessions = initialScores[firstStudentId]?.sessions || [];

//         if (sessions.length > 0) {
//           setSessionDates(sessions.map((session) => session.date));
//         }

//         // Use initialScores directly
//         setStudentScores(initialScores);
//       } catch (err) {
//         console.error("Error initializing from props:", err);
//         setError("Failed to load initial data");
//       }
//     } else {
//       // Create empty student scores structure
//       const emptyScores: { [studentId: string]: LabScore } = {};
//       students.forEach((student) => {
//         emptyScores[student._id] = {
//           componentName: "LAB",
//           sessions: sessionDates.map((date) => ({
//             date,
//             maxMarks: 10,
//             obtainedMarks: 0,
//           })),
//           maxMarks: 30,
//           totalObtained: 0,
//         };
//       });
//       setStudentScores(emptyScores);
//     }
//   }, [initialScores]);

//   // Add a new lab session
//   const handleAddSession = () => {
//     const newDate = new Date().toISOString().split("T")[0];

//     // Add new date to sessionDates
//     setSessionDates((prev) => [...prev, newDate]);

//     // Update each student's sessions with the new date
//     setStudentScores((prev) => {
//       const updated = { ...prev };

//       // For each student, add the new session
//       Object.keys(updated).forEach((studentId) => {
//         if (!updated[studentId]) {
//           updated[studentId] = {
//             componentName: "LAB",
//             sessions: [],
//             maxMarks: 30,
//             totalObtained: 0,
//           };
//         }

//         updated[studentId] = {
//           ...updated[studentId],
//           sessions: [
//             ...updated[studentId].sessions,
//             { date: newDate, maxMarks: 10, obtainedMarks: 0 },
//           ],
//         };
//       });

//       return updated;
//     });
//   };

//   // Remove a lab session
//   const handleRemoveSession = (index: number) => {
//     if (sessionDates.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     // Remove date from sessionDates
//     setSessionDates((prev) => prev.filter((_, i) => i !== index));

//     // Remove the session for each student
//     setStudentScores((prev) => {
//       const updated = { ...prev };

//       Object.keys(updated).forEach((studentId) => {
//         if (updated[studentId] && updated[studentId].sessions) {
//           updated[studentId] = {
//             ...updated[studentId],
//             sessions: updated[studentId].sessions.filter((_, i) => i !== index),
//           };

//           // Recalculate total
//           updated[studentId].totalObtained = calculateTotal(
//             updated[studentId].sessions
//           );
//         }
//       });

//       return updated;
//     });
//   };

//   // Calculate total from sessions
//   const calculateTotal = (sessions: { obtainedMarks: number }[]): number => {
//     if (!sessions || sessions.length === 0) return 0;

//     const sum = sessions.reduce(
//       (total, session) => total + (session.obtainedMarks || 0),
//       0
//     );

//     const average = sum / sessions.length;
//     return Math.round((average / 10) * 30); // Scale from 0-10 to 0-30
//   };

//   // Handle date change
//   const handleDateChange = (index: number, newDate: string) => {
//     // Update the date in sessionDates
//     setSessionDates((prev) => {
//       const updated = [...prev];
//       updated[index] = newDate;
//       return updated;
//     });

//     // Update the date for each student's session
//     setStudentScores((prev) => {
//       const updated = { ...prev };

//       Object.keys(updated).forEach((studentId) => {
//         if (
//           updated[studentId] &&
//           updated[studentId].sessions &&
//           updated[studentId].sessions[index]
//         ) {
//           const sessions = [...updated[studentId].sessions];
//           sessions[index] = { ...sessions[index], date: newDate };

//           updated[studentId] = {
//             ...updated[studentId],
//             sessions,
//           };
//         }
//       });

//       return updated;
//     });
//   };

//   // Handle score change
//   const handleScoreChange = (
//     sessionIndex: number,
//     studentId: string,
//     value: number
//   ) => {
//     // Ensure value is a valid number between 0-10
//     const score = Math.max(0, Math.min(10, Number(value) || 0));

//     setStudentScores((prev) => {
//       // If student doesn't exist yet in scores
//       if (!prev[studentId]) {
//         prev[studentId] = {
//           componentName: "LAB",
//           sessions: sessionDates.map((date) => ({
//             date,
//             maxMarks: 10,
//             obtainedMarks: 0,
//           })),
//           maxMarks: 30,
//           totalObtained: 0,
//         };
//       }

//       // Create a deep copy to avoid mutation issues
//       const updated = { ...prev };

//       // If the student exists but doesn't have enough sessions
//       if (!updated[studentId].sessions[sessionIndex]) {
//         updated[studentId].sessions = sessionDates.map((date, i) => {
//           if (i === sessionIndex) {
//             return { date, maxMarks: 10, obtainedMarks: score };
//           }
//           return { date, maxMarks: 10, obtainedMarks: 0 };
//         });
//       } else {
//         // Update just the specified session
//         const sessions = [...updated[studentId].sessions];
//         sessions[sessionIndex] = {
//           ...sessions[sessionIndex],
//           obtainedMarks: score,
//         };

//         updated[studentId] = {
//           ...updated[studentId],
//           sessions,
//         };
//       }

//       // Recalculate total
//       updated[studentId].totalObtained = calculateTotal(
//         updated[studentId].sessions
//       );

//       return updated;
//     });
//   };

//   // Update parent component whenever scores change
//   useEffect(() => {
//     if (Object.keys(studentScores).length > 0) {
//       onScoresChange(studentScores);
//     }
//   }, [studentScores]);

//   // Re-initialize if students change
//   useEffect(() => {
//     // Make sure all students have entries in the scores
//     setStudentScores((prev) => {
//       const updated = { ...prev };

//       students.forEach((student) => {
//         if (!updated[student._id]) {
//           updated[student._id] = {
//             componentName: "LAB",
//             sessions: sessionDates.map((date) => ({
//               date,
//               maxMarks: 10,
//               obtainedMarks: 0,
//             })),
//             maxMarks: 30,
//             totalObtained: 0,
//           };
//         }
//       });

//       return updated;
//     });
//   }, [students, sessionDates]);

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

//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Faculty enters score under each date (out of 10)
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Out_of_30 is the average of all sessions scaled to 30 marks
//       </Typography>

//       {sessionDates.length > 0 && (
//         <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Academic Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>

//                 {sessionDates.map((date, index) => (
//                   <TableCell key={`date-${index}`} align="center">
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <TextField
//                         type="date"
//                         value={date}
//                         onChange={(e) =>
//                           handleDateChange(index, e.target.value)
//                         }
//                         size="small"
//                         InputProps={{ sx: { fontSize: "0.875rem" } }}
//                       />
//                       {sessionDates.length > 2 && (
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleRemoveSession(index)}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       )}
//                     </Box>
//                   </TableCell>
//                 ))}

//                 <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const studentScore = studentScores[student._id] || {
//                   componentName: "LAB",
//                   sessions: sessionDates.map((date) => ({
//                     date,
//                     maxMarks: 10,
//                     obtainedMarks: 0,
//                   })),
//                   maxMarks: 30,
//                   totalObtained: 0,
//                 };

//                 const total = studentScore.totalObtained;
//                 const isPassing = total >= 15;

//                 return (
//                   <TableRow key={student._id} hover>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>

//                     {sessionDates.map((_, sessionIndex) => {
//                       const sessionScore =
//                         studentScore.sessions[sessionIndex]?.obtainedMarks || 0;

//                       return (
//                         <TableCell key={`score-${sessionIndex}`} align="center">
//                           <TextField
//                             type="number"
//                             value={sessionScore}
//                             onChange={(e) =>
//                               handleScoreChange(
//                                 sessionIndex,
//                                 student._id,
//                                 Number(e.target.value)
//                               )
//                             }
//                             inputProps={{
//                               min: 0,
//                               max: 10,
//                               style: { textAlign: "center" },
//                             }}
//                             size="small"
//                             sx={{ width: 60 }}
//                           />
//                         </TableCell>
//                       );
//                     })}

//                     <TableCell align="center">
//                       <Typography
//                         variant="body1"
//                         fontWeight="bold"
//                         color={isPassing ? "success.main" : "error.main"}
//                       >
//                         {total}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{numberToWords(total)}</TableCell>
//                   </TableRow>
//                 );
//               })}

//               {students.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={8 + sessionDates.length} align="center">
//                     No students enrolled in this course
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

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

// // Define the structure exactly as used in DynamicScoreEntry component
// interface LabScore {
//   componentName: string;
//   sessions: {
//     date: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
//   maxMarks: number;
//   totalObtained: number;
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
//   initialScores?: { [studentId: string]: LabScore };
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
//   // State for session dates
//   const [sessionDates, setSessionDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//     new Date().toISOString().split("T")[0],
//   ]);

//   // State for student scores
//   const [studentScores, setStudentScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});

//   const [error, setError] = useState<string | null>(null);

//   // Helper function to calculate total score
//   const calculateTotal = (sessions: { obtainedMarks: number }[]): number => {
//     if (!sessions || sessions.length === 0) return 0;

//     const sum = sessions.reduce(
//       (total, session) => total + (session.obtainedMarks || 0),
//       0
//     );

//     const average = sum / sessions.length;
//     return Math.round((average / 10) * 30); // Scale from 0-10 to 0-30
//   };

//   // Initialize scores from props or create empty structure
//   useEffect(() => {
//     const initializeScores = () => {
//       const newScores: { [studentId: string]: LabScore } = {};

//       students.forEach((student) => {
//         // Check if this student already has scores in initial data
//         const existingStudentScore = initialScores[student._id];

//         if (existingStudentScore) {
//           // Use existing score, but ensure sessions match current dates
//           const updatedSessions = sessionDates.map((date, index) => {
//             const existingSession = existingStudentScore.sessions[index];
//             return existingSession
//               ? { ...existingSession, date }
//               : { date, maxMarks: 10, obtainedMarks: 0 };
//           });

//           newScores[student._id] = {
//             ...existingStudentScore,
//             sessions: updatedSessions,
//             totalObtained: calculateTotal(updatedSessions),
//           };
//         } else {
//           // Create new entry for student
//           newScores[student._id] = {
//             componentName: "LAB",
//             sessions: sessionDates.map((date) => ({
//               date,
//               maxMarks: 10,
//               obtainedMarks: 0,
//             })),
//             maxMarks: 30,
//             totalObtained: 0,
//           };
//         }
//       });

//       return newScores;
//     };

//     const newStudentScores = initializeScores();
//     setStudentScores(newStudentScores);
//   }, [students, sessionDates, initialScores]);

//   // Add a new lab session
//   const handleAddSession = () => {
//     const newDate = new Date().toISOString().split("T")[0];

//     // Update session dates
//     setSessionDates((prevDates) => [...prevDates, newDate]);

//     // Update student scores to include new session
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, add a new session
//       Object.keys(updatedScores).forEach((studentId) => {
//         updatedScores[studentId].sessions.push({
//           date: newDate,
//           maxMarks: 10,
//           obtainedMarks: 0,
//         });

//         // Recalculate total
//         updatedScores[studentId].totalObtained = calculateTotal(
//           updatedScores[studentId].sessions
//         );
//       });

//       return updatedScores;
//     });
//   };

//   // Remove a lab session
//   const handleRemoveSession = (indexToRemove: number) => {
//     if (sessionDates.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     // Remove date from session dates
//     setSessionDates((prevDates) =>
//       prevDates.filter((_, index) => index !== indexToRemove)
//     );

//     // Update student scores to remove session
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, remove the session at the specified index
//       Object.keys(updatedScores).forEach((studentId) => {
//         // Remove the session
//         updatedScores[studentId].sessions = updatedScores[
//           studentId
//         ].sessions.filter((_, index) => index !== indexToRemove);

//         // Recalculate total
//         updatedScores[studentId].totalObtained = calculateTotal(
//           updatedScores[studentId].sessions
//         );
//       });

//       return updatedScores;
//     });
//   };

//   // Handle date change for a session
//   const handleDateChange = (index: number, newDate: string) => {
//     // Update session dates
//     setSessionDates((prevDates) => {
//       const updatedDates = [...prevDates];
//       updatedDates[index] = newDate;
//       return updatedDates;
//     });

//     // Update student scores with new date
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, update the date of the specific session
//       Object.keys(updatedScores).forEach((studentId) => {
//         if (updatedScores[studentId].sessions[index]) {
//           updatedScores[studentId].sessions[index].date = newDate;
//         }
//       });

//       return updatedScores;
//     });
//   };

//   // Handle score change for a specific session and student
//   const handleScoreChange = (
//     sessionIndex: number,
//     studentId: string,
//     value: number
//   ) => {
//     // Ensure value is between 0 and 10
//     const score = Math.max(0, Math.min(10, Number(value) || 0));

//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // Ensure the student score exists
//       if (!updatedScores[studentId]) {
//         updatedScores[studentId] = {
//           componentName: "LAB",
//           sessions: sessionDates.map((date) => ({
//             date,
//             maxMarks: 10,
//             obtainedMarks: 0,
//           })),
//           maxMarks: 30,
//           totalObtained: 0,
//         };
//       }

//       // Update the specific session score
//       updatedScores[studentId].sessions[sessionIndex].obtainedMarks = score;

//       // Recalculate total
//       updatedScores[studentId].totalObtained = calculateTotal(
//         updatedScores[studentId].sessions
//       );

//       return updatedScores;
//     });
//   };

//   // Trigger parent component update whenever scores change
//   useEffect(() => {
//     if (Object.keys(studentScores).length > 0) {
//       onScoresChange(studentScores);
//     }
//   }, [studentScores]);

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

//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Faculty enters score under each date (out of 10)
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Out_of_30 is the average of all sessions scaled to 30 marks
//       </Typography>

//       {sessionDates.length > 0 && (
//         <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Academic Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>

//                 {sessionDates.map((date, index) => (
//                   <TableCell key={`date-${index}`} align="center">
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <TextField
//                         type="date"
//                         value={date}
//                         onChange={(e) =>
//                           handleDateChange(index, e.target.value)
//                         }
//                         size="small"
//                         InputProps={{ sx: { fontSize: "0.875rem" } }}
//                       />
//                       {sessionDates.length > 2 && (
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleRemoveSession(index)}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       )}
//                     </Box>
//                   </TableCell>
//                 ))}

//                 <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const studentScore = studentScores[student._id] || {
//                   componentName: "LAB",
//                   sessions: sessionDates.map((date) => ({
//                     date,
//                     maxMarks: 10,
//                     obtainedMarks: 0,
//                   })),
//                   maxMarks: 30,
//                   totalObtained: 0,
//                 };

//                 const total = studentScore.totalObtained;
//                 const isPassing = total >= 15;

//                 return (
//                   <TableRow key={student._id} hover>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>

//                     {sessionDates.map((_, sessionIndex) => {
//                       const sessionScore =
//                         studentScore.sessions[sessionIndex]?.obtainedMarks || 0;

//                       return (
//                         <TableCell key={`score-${sessionIndex}`} align="center">
//                           <TextField
//                             type="number"
//                             value={sessionScore}
//                             onChange={(e) =>
//                               handleScoreChange(
//                                 sessionIndex,
//                                 student._id,
//                                 Number(e.target.value)
//                               )
//                             }
//                             inputProps={{
//                               min: 0,
//                               max: 10,
//                               style: { textAlign: "center" },
//                             }}
//                             size="small"
//                             sx={{ width: 60 }}
//                           />
//                         </TableCell>
//                       );
//                     })}

//                     <TableCell align="center">
//                       <Typography
//                         variant="body1"
//                         fontWeight="bold"
//                         color={isPassing ? "success.main" : "error.main"}
//                       >
//                         {total}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{numberToWords(total)}</TableCell>
//                   </TableRow>
//                 );
//               })}

//               {students.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={8 + sessionDates.length} align="center">
//                     No students enrolled in this course
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

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

// // Define the structure exactly as used in DynamicScoreEntry component
// interface LabScore {
//   componentName: string;
//   sessions: {
//     date: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
//   maxMarks: number;
//   totalObtained: number;
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
//   initialScores?: { [studentId: string]: LabScore };
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
//   // State for session dates
//   const [sessionDates, setSessionDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//     new Date().toISOString().split("T")[0],
//   ]);

//   // State for student scores
//   const [studentScores, setStudentScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});

//   const [error, setError] = useState<string | null>(null);

//   // Helper function to calculate total score
//   const calculateTotal = (sessions: { obtainedMarks: number }[]): number => {
//     if (!sessions || sessions.length === 0) return 0;

//     const sum = sessions.reduce(
//       (total, session) => total + (session.obtainedMarks || 0),
//       0
//     );

//     const average = sum / sessions.length;
//     return Math.round((average / 10) * 30); // Scale from 0-10 to 0-30
//   };

//   // Initialize scores from props or create empty structure
//   useEffect(() => {
//     const initializeScores = () => {
//       const newScores: { [studentId: string]: LabScore } = {};

//       students.forEach((student) => {
//         // Check if this student already has scores in initial data
//         const existingStudentScore = initialScores[student._id];

//         if (existingStudentScore) {
//           // Use existing score, but ensure sessions match current dates
//           const updatedSessions = sessionDates.map((date, index) => {
//             const existingSession = existingStudentScore.sessions[index];
//             return existingSession
//               ? { ...existingSession, date }
//               : { date, maxMarks: 10, obtainedMarks: 0 };
//           });

//           newScores[student._id] = {
//             ...existingStudentScore,
//             sessions: updatedSessions,
//             totalObtained: calculateTotal(updatedSessions),
//           };
//         } else {
//           // Create new entry for student
//           newScores[student._id] = {
//             componentName: "LAB",
//             sessions: sessionDates.map((date) => ({
//               date,
//               maxMarks: 10,
//               obtainedMarks: 0,
//             })),
//             maxMarks: 30,
//             totalObtained: 0,
//           };
//         }
//       });

//       return newScores;
//     };

//     const newStudentScores = initializeScores();
//     setStudentScores(newStudentScores);
//   }, [students, sessionDates, initialScores]);

//   // Add a new lab session
//   const handleAddSession = () => {
//     const newDate = new Date().toISOString().split("T")[0];

//     // Update session dates
//     setSessionDates((prevDates) => [...prevDates, newDate]);

//     // Update student scores to include new session
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, add a new session
//       Object.keys(updatedScores).forEach((studentId) => {
//         updatedScores[studentId].sessions.push({
//           date: newDate,
//           maxMarks: 10,
//           obtainedMarks: 0,
//         });

//         // Recalculate total
//         updatedScores[studentId].totalObtained = calculateTotal(
//           updatedScores[studentId].sessions
//         );
//       });

//       return updatedScores;
//     });
//   };

//   // Remove a lab session
//   const handleRemoveSession = (indexToRemove: number) => {
//     if (sessionDates.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     // Remove date from session dates
//     setSessionDates((prevDates) =>
//       prevDates.filter((_, index) => index !== indexToRemove)
//     );

//     // Update student scores to remove session
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, remove the session at the specified index
//       Object.keys(updatedScores).forEach((studentId) => {
//         // Remove the session
//         updatedScores[studentId].sessions = updatedScores[
//           studentId
//         ].sessions.filter((_, index) => index !== indexToRemove);

//         // Recalculate total
//         updatedScores[studentId].totalObtained = calculateTotal(
//           updatedScores[studentId].sessions
//         );
//       });

//       return updatedScores;
//     });
//   };

//   // Handle date change for a session
//   const handleDateChange = (index: number, newDate: string) => {
//     // Update session dates
//     setSessionDates((prevDates) => {
//       const updatedDates = [...prevDates];
//       updatedDates[index] = newDate;
//       return updatedDates;
//     });

//     // Update student scores with new date
//     setStudentScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       // For each student, update the date of the specific session
//       Object.keys(updatedScores).forEach((studentId) => {
//         if (updatedScores[studentId].sessions[index]) {
//           updatedScores[studentId].sessions[index].date = newDate;
//         }
//       });

//       return updatedScores;
//     });
//   };

//   // Handle score change for a specific session and student
//   const handleScoreChange = (
//     sessionIndex: number,
//     studentId: string,
//     value: number
//   ) => {
//     try {
//       // Ensure value is between 0 and 10
//       const score = Math.max(0, Math.min(10, Number(value) || 0));

//       setStudentScores((prevScores) => {
//         // Create a deep copy to avoid mutation
//         const updatedScores = JSON.parse(JSON.stringify(prevScores));

//         // Debug logging
//         console.log("Current sessionDates:", sessionDates);
//         console.log("Current studentId:", studentId);
//         console.log("Current prevScores:", prevScores);

//         // Ensure the student score exists
//         if (!updatedScores[studentId]) {
//           console.log("Creating new student score entry");
//           updatedScores[studentId] = {
//             componentName: "LAB",
//             sessions: sessionDates.map((date) => ({
//               date,
//               maxMarks: 10,
//               obtainedMarks: 0,
//             })),
//             maxMarks: 30,
//             totalObtained: 0,
//           };
//         }

//         // Ensure sessions array matches current session dates
//         if (updatedScores[studentId].sessions.length !== sessionDates.length) {
//           console.log("Adjusting sessions array");
//           updatedScores[studentId].sessions = sessionDates.map(
//             (date, index) =>
//               updatedScores[studentId].sessions[index] || {
//                 date,
//                 maxMarks: 10,
//                 obtainedMarks: 0,
//               }
//           );
//         }

//         // Update dates to match current sessionDates
//         updatedScores[studentId].sessions.forEach((session, index) => {
//           session.date = sessionDates[index];
//         });

//         // Update the specific session score
//         updatedScores[studentId].sessions[sessionIndex].obtainedMarks = score;

//         // Recalculate total
//         updatedScores[studentId].totalObtained = calculateTotal(
//           updatedScores[studentId].sessions
//         );

//         console.log("Updated student scores:", updatedScores[studentId]);

//         return updatedScores;
//       });
//     } catch (error) {
//       console.error("Error in handleScoreChange:", error);
//       // Optionally set an error state to show to the user
//       setError("Failed to update score. Please try again.");
//     }
//   };

//   // Trigger parent component update whenever scores change
//   useEffect(() => {
//     if (Object.keys(studentScores).length > 0) {
//       onScoresChange(studentScores);
//     }
//   }, [studentScores]);

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

//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Faculty enters score under each date (out of 10)
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Out_of_30 is the average of all sessions scaled to 30 marks
//       </Typography>

//       {sessionDates.length > 0 && (
//         <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Academic Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>

//                 {sessionDates.map((date, index) => (
//                   <TableCell key={`date-${index}`} align="center">
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <TextField
//                         type="date"
//                         value={date}
//                         onChange={(e) =>
//                           handleDateChange(index, e.target.value)
//                         }
//                         size="small"
//                         InputProps={{ sx: { fontSize: "0.875rem" } }}
//                       />
//                       {sessionDates.length > 2 && (
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleRemoveSession(index)}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       )}
//                     </Box>
//                   </TableCell>
//                 ))}

//                 <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const studentScore = studentScores[student._id] || {
//                   componentName: "LAB",
//                   sessions: sessionDates.map((date) => ({
//                     date,
//                     maxMarks: 10,
//                     obtainedMarks: 0,
//                   })),
//                   maxMarks: 30,
//                   totalObtained: 0,
//                 };

//                 const total = studentScore.totalObtained;
//                 const isPassing = total >= 15;

//                 return (
//                   <TableRow key={student._id} hover>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>

//                     {sessionDates.map((_, sessionIndex) => {
//                       const sessionScore =
//                         studentScore.sessions[sessionIndex]?.obtainedMarks || 0;

//                       return (
//                         <TableCell key={`score-${sessionIndex}`} align="center">
//                           <TextField
//                             type="number"
//                             value={sessionScore}
//                             onChange={(e) =>
//                               handleScoreChange(
//                                 sessionIndex,
//                                 student._id,
//                                 Number(e.target.value)
//                               )
//                             }
//                             inputProps={{
//                               min: 0,
//                               max: 10,
//                               style: { textAlign: "center" },
//                             }}
//                             size="small"
//                             sx={{ width: 60 }}
//                           />
//                         </TableCell>
//                       );
//                     })}

//                     <TableCell align="center">
//                       <Typography
//                         variant="body1"
//                         fontWeight="bold"
//                         color={isPassing ? "success.main" : "error.main"}
//                       >
//                         {total}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{numberToWords(total)}</TableCell>
//                   </TableRow>
//                 );
//               })}

//               {students.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={8 + sessionDates.length} align="center">
//                     No students enrolled in this course
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

import React, { useState, useEffect, useCallback } from "react";
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

// Define the structure exactly as used in DynamicScoreEntry component
interface LabScore {
  componentName: string;
  sessions: {
    date: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
  maxMarks: number;
  totalObtained: number;
}

interface LabScoreEntryComponentProps {
  students: Student[];
  componentName: string;
  onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
  initialScores?: { [studentId: string]: LabScore };
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
  // State for session dates
  const [sessionDates, setSessionDates] = useState<string[]>([
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  ]);

  // State for student scores with more defensive typing
  const [studentScores, setStudentScores] = useState<{
    [studentId: string]: LabScore;
  }>({});

  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate total score
  const calculateTotal = useCallback(
    (sessions: { obtainedMarks: number }[]): number => {
      if (!sessions || sessions.length === 0) return 0;

      const sum = sessions.reduce(
        (total, session) => total + (session.obtainedMarks || 0),
        0
      );

      const average = sum / sessions.length;
      return Math.round((average / 10) * 30); // Scale from 0-10 to 0-30
    },
    []
  );

  // Safe initialization of student scores
  const initializeStudentScores = useCallback(
    (students: Student[], currentDates: string[]) => {
      const newScores: { [studentId: string]: LabScore } = {};

      students.forEach((student) => {
        // Check if this student already has scores in initial data
        const existingStudentScore = initialScores[student._id];

        if (existingStudentScore) {
          // Use existing score, but ensure sessions match current dates
          const updatedSessions = currentDates.map((date, index) => {
            const existingSession = existingStudentScore.sessions[index];
            return existingSession
              ? { ...existingSession, date }
              : { date, maxMarks: 10, obtainedMarks: 0 };
          });

          newScores[student._id] = {
            ...existingStudentScore,
            sessions: updatedSessions,
            totalObtained: calculateTotal(updatedSessions),
          };
        } else {
          // Create new entry for student
          newScores[student._id] = {
            componentName: "LAB",
            sessions: currentDates.map((date) => ({
              date,
              maxMarks: 10,
              obtainedMarks: 0,
            })),
            maxMarks: 30,
            totalObtained: 0,
          };
        }
      });

      return newScores;
    },
    [initialScores, calculateTotal]
  );

  // Initialize scores when students or session dates change
  useEffect(() => {
    const newStudentScores = initializeStudentScores(students, sessionDates);
    setStudentScores(newStudentScores);
  }, [students, sessionDates, initializeStudentScores]);

  // Add a new lab session
  const handleAddSession = () => {
    const newDate = new Date().toISOString().split("T")[0];

    // Update session dates
    setSessionDates((prevDates) => [...prevDates, newDate]);
  };

  // Remove a lab session
  const handleRemoveSession = (indexToRemove: number) => {
    if (sessionDates.length <= 2) {
      setError("You must have at least two lab sessions");
      return;
    }

    // Remove date from session dates
    setSessionDates((prevDates) =>
      prevDates.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle date change for a session
  const handleDateChange = (index: number, newDate: string) => {
    // Update session dates
    setSessionDates((prevDates) => {
      const updatedDates = [...prevDates];
      updatedDates[index] = newDate;
      return updatedDates;
    });
  };

  // Handle score change for a specific session and student
  const handleScoreChange = (
    sessionIndex: number,
    studentId: string,
    value: number
  ) => {
    try {
      // Ensure value is between 0 and 10
      const score = Math.max(0, Math.min(10, Number(value) || 0));

      setStudentScores((prevScores) => {
        // Create a deep copy to ensure immutability
        const updatedScores = JSON.parse(JSON.stringify(prevScores));

        // Ensure the student score exists and has correct sessions
        if (!updatedScores[studentId]) {
          updatedScores[studentId] = {
            componentName: "LAB",
            sessions: sessionDates.map((date) => ({
              date,
              maxMarks: 10,
              obtainedMarks: 0,
            })),
            maxMarks: 30,
            totalObtained: 0,
          };
        }

        // Ensure sessions array matches current session dates
        if (updatedScores[studentId].sessions.length !== sessionDates.length) {
          updatedScores[studentId].sessions = sessionDates.map(
            (date, index) =>
              updatedScores[studentId].sessions[index] || {
                date,
                maxMarks: 10,
                obtainedMarks: 0,
              }
          );
        }

        // Update dates to match current sessionDates
        updatedScores[studentId].sessions.forEach((session, index) => {
          session.date = sessionDates[index];
        });

        // Update the specific session score
        updatedScores[studentId].sessions[sessionIndex].obtainedMarks = score;

        // Recalculate total
        updatedScores[studentId].totalObtained = calculateTotal(
          updatedScores[studentId].sessions
        );

        return updatedScores;
      });
    } catch (error) {
      console.error("Error in handleScoreChange:", error);
      setError("Failed to update score. Please try again.");
    }
  };

  // Trigger parent component update whenever scores change
  useEffect(() => {
    if (Object.keys(studentScores).length > 0) {
      onScoresChange(studentScores);
    }
  }, [studentScores, onScoresChange]);

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

      <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
        - Faculty enters score under each date (out of 10)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
        - Out_of_30 is the average of all sessions scaled to 30 marks
      </Typography>

      {sessionDates.length > 0 && (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>SNo.</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Enrollment No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Semester</TableCell>

                {sessionDates.map((date, index) => (
                  <TableCell key={`date-${index}`} align="center">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        type="date"
                        value={date}
                        onChange={(e) =>
                          handleDateChange(index, e.target.value)
                        }
                        size="small"
                        InputProps={{ sx: { fontSize: "0.875rem" } }}
                      />
                      {sessionDates.length > 2 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSession(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                ))}

                <TableCell align="center">Out_of_30 (pass 15)</TableCell>
                <TableCell>Marks in Words</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => {
                const studentScore = studentScores[student._id] || {
                  componentName: "LAB",
                  sessions: sessionDates.map((date) => ({
                    date,
                    maxMarks: 10,
                    obtainedMarks: 0,
                  })),
                  maxMarks: 30,
                  totalObtained: 0,
                };

                const total = studentScore.totalObtained;
                const isPassing = total >= 15;

                return (
                  <TableRow key={student._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.academicYear}</TableCell>
                    <TableCell>{student.program}</TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.semester}</TableCell>

                    {sessionDates.map((_, sessionIndex) => {
                      const sessionScore =
                        studentScore.sessions[sessionIndex]?.obtainedMarks || 0;

                      return (
                        <TableCell key={`score-${sessionIndex}`} align="center">
                          <TextField
                            type="number"
                            value={sessionScore}
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
                      );
                    })}

                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color={isPassing ? "success.main" : "error.main"}
                      >
                        {total}
                      </Typography>
                    </TableCell>

                    <TableCell>{numberToWords(total)}</TableCell>
                  </TableRow>
                );
              })}

              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8 + sessionDates.length} align="center">
                    No students enrolled in this course
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LabScoreEntryComponent;
