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
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Tabs,
//   Tab,
//   Chip,
//   CircularProgress,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Course, Student } from "../types";
// // import { scoreService } from "../services/scoreService";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";

// interface ScoreComponent {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// interface StudentScore {
//   studentId: string;
//   academicYear: string;
//   scores: ScoreComponent[];
// }

// // Interface for detailed question scores (CA components)
// interface QuestionScore {
//   questionNumber: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// // Interface for tracking component-specific scores
// interface DetailedScores {
//   [componentName: string]: {
//     [studentId: string]: {
//       questions: QuestionScore[];
//       totalMarks: number;
//     };
//   };
// }

// // Interface for lab session scores
// interface LabScores {
//   [studentId: string]: {
//     [sessionDate: string]: number;
//   };
// }

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Function to convert number to words
// const numberToWords = (num: number): string => {
//   if (num === 0) return "Zero";

//   const units = [
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

//   if (num < 20) return units[num];

//   const digit = num % 10;
//   return tens[Math.floor(num / 10)] + (digit > 0 ? ` ${units[digit]}` : "");
// };

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [componentDates, setComponentDates] = useState<{ [key: string]: Date }>(
//     {}
//   );
//   const [labDates, setLabDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//   ]);

//   // Detailed scores per component
//   const [detailedScores, setDetailedScores] = useState<DetailedScores>({});
//   const [labScores, setLabScores] = useState<LabScores>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: number;
//   }>({});

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize data based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Initialize dates for each component
//     const dates: { [key: string]: Date } = {};
//     components.forEach((comp) => {
//       dates[comp] = new Date();
//     });
//     setComponentDates(dates);

//     // Initialize the data structure for each component type
//     const initialDetailedScores: DetailedScores = {};
//     const initialLabScores: LabScores = {};
//     const initialAssignmentScores: { [studentId: string]: number } = {};

//     components.forEach((component) => {
//       if (component.startsWith("CA")) {
//         initialDetailedScores[component] = {};

//         students.forEach((student) => {
//           initialDetailedScores[component][student._id] = {
//             questions: [
//               { questionNumber: "1a", maxMarks: 5, obtainedMarks: 0 },
//               { questionNumber: "1b", maxMarks: 5, obtainedMarks: 0 },
//               { questionNumber: "1c", maxMarks: 5, obtainedMarks: 0 },
//               { questionNumber: "1d", maxMarks: 5, obtainedMarks: 0 },
//               { questionNumber: "2", maxMarks: 10, obtainedMarks: 0 },
//               { questionNumber: "3", maxMarks: 10, obtainedMarks: 0 },
//               { questionNumber: "4", maxMarks: 10, obtainedMarks: 0 },
//             ],
//             totalMarks: 0,
//           };
//         });
//       } else if (component === "LAB") {
//         students.forEach((student) => {
//           initialLabScores[student._id] = {};
//           labDates.forEach((date) => {
//             initialLabScores[student._id][date] = 0;
//           });
//         });
//       } else if (component === "ASSIGNMENT") {
//         students.forEach((student) => {
//           initialAssignmentScores[student._id] = 0;
//         });
//       }
//     });

//     setDetailedScores(initialDetailedScores);
//     setLabScores(initialLabScores);
//     setAssignmentScores(initialAssignmentScores);

//     // Load existing scores if available
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       // Process the scores and update the state
//       if (existingScores && existingScores.length > 0) {
//         const updatedDetailedScores = { ...detailedScores };
//         const updatedLabScores = { ...labScores };
//         const updatedAssignmentScores = { ...assignmentScores };

//         existingScores.forEach((scoreEntry: any) => {
//           const studentId =
//             typeof scoreEntry.studentId === "string"
//               ? scoreEntry.studentId
//               : scoreEntry.studentId._id;

//           if (!studentId) return;

//           scoreEntry.scores.forEach((component: any) => {
//             if (component.componentName.startsWith("CA")) {
//               if (!updatedDetailedScores[component.componentName]) {
//                 updatedDetailedScores[component.componentName] = {};
//               }

//               if (!updatedDetailedScores[component.componentName][studentId]) {
//                 updatedDetailedScores[component.componentName][studentId] = {
//                   questions: [
//                     { questionNumber: "1a", maxMarks: 5, obtainedMarks: 0 },
//                     { questionNumber: "1b", maxMarks: 5, obtainedMarks: 0 },
//                     { questionNumber: "1c", maxMarks: 5, obtainedMarks: 0 },
//                     { questionNumber: "1d", maxMarks: 5, obtainedMarks: 0 },
//                     { questionNumber: "2", maxMarks: 10, obtainedMarks: 0 },
//                     { questionNumber: "3", maxMarks: 10, obtainedMarks: 0 },
//                     { questionNumber: "4", maxMarks: 10, obtainedMarks: 0 },
//                   ],
//                   totalMarks: component.obtainedMarks || 0,
//                 };
//               } else {
//                 updatedDetailedScores[component.componentName][
//                   studentId
//                 ].totalMarks = component.obtainedMarks || 0;
//               }
//             } else if (component.componentName === "LAB") {
//               if (!updatedLabScores[studentId]) {
//                 updatedLabScores[studentId] = {};
//                 labDates.forEach((date) => {
//                   updatedLabScores[studentId][date] = 0;
//                 });
//               }

//               // Distribute the total marks evenly across lab sessions (simplified approach)
//               const totalLabMarks = component.obtainedMarks || 0;
//               const marksPerSession =
//                 labDates.length > 0 ? totalLabMarks / labDates.length : 0;

//               labDates.forEach((date) => {
//                 updatedLabScores[studentId][date] = marksPerSession;
//               });
//             } else if (component.componentName === "ASSIGNMENT") {
//               updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
//             }
//           });
//         });

//         setDetailedScores(updatedDetailedScores);
//         setLabScores(updatedLabScores);
//         setAssignmentScores(updatedAssignmentScores);
//       }
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update question score for CA components
//   const handleQuestionScoreChange = (
//     componentName: string,
//     studentId: string,
//     questionNumber: string,
//     obtainedMarks: number
//   ) => {
//     setDetailedScores((prev) => {
//       const updated = { ...prev };

//       if (!updated[componentName]) {
//         updated[componentName] = {};
//       }

//       if (!updated[componentName][studentId]) {
//         updated[componentName][studentId] = {
//           questions: [
//             { questionNumber: "1a", maxMarks: 5, obtainedMarks: 0 },
//             { questionNumber: "1b", maxMarks: 5, obtainedMarks: 0 },
//             { questionNumber: "1c", maxMarks: 5, obtainedMarks: 0 },
//             { questionNumber: "1d", maxMarks: 5, obtainedMarks: 0 },
//             { questionNumber: "2", maxMarks: 10, obtainedMarks: 0 },
//             { questionNumber: "3", maxMarks: 10, obtainedMarks: 0 },
//             { questionNumber: "4", maxMarks: 10, obtainedMarks: 0 },
//           ],
//           totalMarks: 0,
//         };
//       }

//       // Update the specific question
//       const questionIndex = updated[componentName][
//         studentId
//       ].questions.findIndex((q) => q.questionNumber === questionNumber);

//       if (questionIndex !== -1) {
//         updated[componentName][studentId].questions[
//           questionIndex
//         ].obtainedMarks = obtainedMarks;

//         // Recalculate total
//         updated[componentName][studentId].totalMarks = updated[componentName][
//           studentId
//         ].questions.reduce((sum, q) => sum + q.obtainedMarks, 0);
//       }

//       return updated;
//     });
//   };

//   // Handle lab session score change
//   const handleLabScoreChange = (
//     studentId: string,
//     date: string,
//     score: number
//   ) => {
//     setLabScores((prev) => {
//       const updated = { ...prev };

//       if (!updated[studentId]) {
//         updated[studentId] = {};
//       }

//       updated[studentId][date] = score;

//       return updated;
//     });
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (studentId: string, score: number) => {
//     setAssignmentScores((prev) => ({
//       ...prev,
//       [studentId]: score,
//     }));
//   };

//   // Get component data (max marks, passing marks)
//   const getComponentData = (componentName: string) => {
//     if (!course) return null;

//     const weight = course.evaluationScheme[componentName];
//     if (!weight) return null;

//     const maxMarks = Math.round(weight * 100);
//     const passMark = Math.round(
//       maxMarks * (componentName === "LAB" ? 0.5 : 0.4)
//     ); // 50% for LAB, 40% for others

//     return {
//       maxMarks,
//       passMark,
//     };
//   };

//   // Handle component tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle date change
//   const handleDateChange = (componentName: string, date: Date | null) => {
//     if (date) {
//       setComponentDates((prev) => ({
//         ...prev,
//         [componentName]: date,
//       }));
//     }
//   };

//   // Add a new lab date
//   const handleAddLabDate = () => {
//     const newDate = new Date().toISOString().split("T")[0];

//     setLabDates((prev) => [...prev, newDate]);

//     // Initialize scores for the new date
//     setLabScores((prev) => {
//       const updated = { ...prev };

//       Object.keys(updated).forEach((studentId) => {
//         updated[studentId][newDate] = 0;
//       });

//       return updated;
//     });
//   };

//   // Remove a lab date
//   const handleRemoveLabDate = (index: number) => {
//     const dateToRemove = labDates[index];

//     setLabDates((prev) => prev.filter((_, i) => i !== index));

//     // Remove scores for this date
//     setLabScores((prev) => {
//       const updated = { ...prev };

//       Object.keys(updated).forEach((studentId) => {
//         delete updated[studentId][dateToRemove];
//       });

//       return updated;
//     });
//   };

//   // Prepare scores for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: StudentScore[] = [];

//     students.forEach((student) => {
//       const studentScores: ScoreComponent[] = [];

//       // Process CA components
//       Object.keys(detailedScores).forEach((componentName) => {
//         if (detailedScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks:
//                 detailedScores[componentName][student._id].totalMarks,
//             });
//           }
//         }
//       });

//       // Process LAB component
//       if (labScores[student._id]) {
//         const componentData = getComponentData("LAB");
//         if (componentData) {
//           const totalLabScore = Object.values(labScores[student._id]).reduce(
//             (sum, score) => sum + score,
//             0
//           );
//           studentScores.push({
//             componentName: "LAB",
//             maxMarks: componentData.maxMarks,
//             obtainedMarks: totalLabScore,
//           });
//         }
//       }

//       // Process ASSIGNMENT component
//       if (assignmentScores[student._id] !== undefined) {
//         const componentData = getComponentData("ASSIGNMENT");
//         if (componentData) {
//           studentScores.push({
//             componentName: "ASSIGNMENT",
//             maxMarks: componentData.maxMarks,
//             obtainedMarks: assignmentScores[student._id],
//           });
//         }
//       }

//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//         });
//       }
//     });

//     return formattedScores;
//   };

//   // Save all scores
//   const handleSaveAllScores = async () => {
//     if (!course) return;

//     try {
//       setSaving(true);
//       setError(null);
//       setSuccess(null);

//       const scoresToSubmit = prepareScoresForSubmission();

//       await scoreService.updateCourseScores(course._id, scoresToSubmit);

//       setSuccess("All scores saved successfully!");

//       if (onSaveComplete) {
//         onSaveComplete();
//       }
//     } catch (error: any) {
//       console.error("Error saving scores:", error);
//       setError(error.response?.data?.message || "Failed to save scores");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Calculate total score for a student in a CA component
//   const getStudentComponentTotal = (
//     componentName: string,
//     studentId: string
//   ) => {
//     if (
//       !detailedScores[componentName] ||
//       !detailedScores[componentName][studentId]
//     ) {
//       return 0;
//     }

//     return detailedScores[componentName][studentId].totalMarks;
//   };

//   // Calculate total lab score for a student
//   const getStudentLabTotal = (studentId: string) => {
//     if (!labScores[studentId]) return 0;

//     return Object.values(labScores[studentId]).reduce(
//       (sum, score) => sum + score,
//       0
//     );
//   };

//   // Render CA component
//   const renderCAComponent = (componentName: string) => {
//     const componentData = getComponentData(componentName);
//     if (!componentData) return null;

//     return (
//       <Box>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6">{componentName} Score Entry</Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Test Date"
//                 value={componentDates[componentName] || null}
//                 onChange={(date) => handleDateChange(componentName, date)}
//               />
//             </LocalizationProvider>
//           </Grid>
//         </Grid>

//         <TableContainer component={Paper}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell align="center">1a</TableCell>
//                 <TableCell align="center">1b</TableCell>
//                 <TableCell align="center">1c</TableCell>
//                 <TableCell align="center">1d</TableCell>
//                 <TableCell align="center">2</TableCell>
//                 <TableCell align="center">3</TableCell>
//                 <TableCell align="center">4</TableCell>
//                 <TableCell align="center">Total</TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const totalMarks = getStudentComponentTotal(
//                   componentName,
//                   student._id
//                 );

//                 return (
//                   <TableRow key={student._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>

//                     {/* Question scores */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "1a")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "1a",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 5,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "1b")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "1b",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 5,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "1c")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "1c",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 5,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "1d")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "1d",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 5,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "2")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "2",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 10,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "3")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "3",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 10,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={
//                           detailedScores[componentName]?.[
//                             student._id
//                           ]?.questions.find((q) => q.questionNumber === "4")
//                             ?.obtainedMarks || 0
//                         }
//                         onChange={(e) =>
//                           handleQuestionScoreChange(
//                             componentName,
//                             student._id,
//                             "4",
//                             Number(e.target.value)
//                           )
//                         }
//                         InputProps={{
//                           inputProps: {
//                             min: 0,
//                             max: 10,
//                             style: { textAlign: "center" },
//                           },
//                         }}
//                         size="small"
//                         sx={{ width: 50 }}
//                       />
//                     </TableCell>

//                     {/* Total */}
//                     <TableCell align="center">
//                       <Typography
//                         variant="body1"
//                         fontWeight="bold"
//                         color={
//                           totalMarks >= componentData.passMark
//                             ? "success.main"
//                             : "error.main"
//                         }
//                       >
//                         {totalMarks}
//                       </Typography>
//                     </TableCell>

//                     {/* Marks in words */}
//                     <TableCell>{numberToWords(totalMarks)}</TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   // Render LAB component
//   const renderLabComponent = () => {
//     const componentData = getComponentData("LAB");
//     if (!componentData) return null;

//     return (
//       <Box>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6">LAB Sessions</Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Button variant="outlined" size="small" onClick={handleAddLabDate}>
//               Add Lab Session
//             </Button>
//           </Grid>
//         </Grid>

//         <TableContainer component={Paper}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>

//                 {labDates.map((date, index) => (
//                   <TableCell key={date} align="center">
//                     <Grid container spacing={1} alignItems="center">
//                       <Grid item xs={10}>
//                         <TextField
//                           type="date"
//                           value={date}
//                           onChange={(e) => {
//                             const newDate = e.target.value;
//                             setLabDates((prev) => {
//                               const updated = [...prev];
//                               updated[index] = newDate;
//                               return updated;
//                             });
//                           }}
//                           size="small"
//                           InputProps={{ sx: { fontSize: "0.875rem" } }}
//                         />
//                       </Grid>
//                       <Grid item xs={2}>
//                         <Button
//                           size="small"
//                           color="error"
//                           onClick={() => handleRemoveLabDate(index)}
//                           disabled={labDates.length <= 1}
//                         >
//                           ×
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </TableCell>
//                 ))}

//                 <TableCell align="center">Total</TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const totalLabScore = getStudentLabTotal(student._id);

//                 return (
//                   <TableRow key={student._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>

//                     {labDates.map((date) => (
//                       <TableCell key={date} align="center">
//                         <TextField
//                           type="number"
//                           value={labScores[student._id]?.[date] || 0}
//                           onChange={(e) =>
//                             handleLabScoreChange(
//                               student._id,
//                               date,
//                               Number(e.target.value)
//                             )
//                           }
//                           InputProps={{
//                             inputProps: {
//                               min: 0,
//                               max: 10,
//                               style: { textAlign: "center" },
//                             },
//                           }}
//                           size="small"
//                           sx={{ width: 50 }}
//                         />
//                       </TableCell>
//                     ))}

//                     <TableCell align="center">
//                       <Typography
//                         variant="body1"
//                         fontWeight="bold"
//                         color={
//                           totalLabScore >= componentData.passMark
//                             ? "success.main"
//                             : "error.main"
//                         }
//                       >
//                         {totalLabScore}
//                       </Typography>
//                     </TableCell>

//                     <TableCell>{numberToWords(totalLabScore)}</TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   // Render ASSIGNMENT component
//   const renderAssignmentComponent = () => {
//     const componentData = getComponentData("ASSIGNMENT");
//     if (!componentData) return null;

//     return (
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Assignment/Internal Assessment
//         </Typography>

//         <TableContainer component={Paper}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell>SNo.</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell align="center">
//                   Marks (Max: {componentData.maxMarks})
//                 </TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => (
//                 <TableRow key={student._id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{student.registrationNumber}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell align="center">
//                     <TextField
//                       type="number"
//                       value={assignmentScores[student._id] || 0}
//                       onChange={(e) =>
//                         handleAssignmentScoreChange(
//                           student._id,
//                           Number(e.target.value)
//                         )
//                       }
//                       InputProps={{
//                         inputProps: {
//                           min: 0,
//                           max: componentData.maxMarks,
//                           style: { textAlign: "center" },
//                         },
//                       }}
//                       size="small"
//                       sx={{ width: 70 }}
//                     />
//                   </TableCell>

//                   <TableCell>
//                     {numberToWords(assignmentScores[student._id] || 0)}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   return (
//     <Box>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             <Grid item xs={12} md={6}>
//               <Typography variant="h5">
//                 {course?.code} - {course?.name}
//               </Typography>
//               <Typography variant="subtitle2" color="text.secondary">
//                 Type: {course?.type} | Slot: {course?.slot} | Venue:{" "}
//                 {course?.venue || "N/A"}
//               </Typography>
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               md={6}
//               sx={{ display: "flex", justifyContent: "flex-end" }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={saving || students.length === 0}
//                 sx={{ ml: "auto" }}
//               >
//                 {saving ? <CircularProgress size={24} /> : "Save All Scores"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Box sx={{ mb: 2 }}>
//               <Alert severity="error" onClose={() => setError(null)}>
//                 {error}
//               </Alert>
//             </Box>
//           )}

//           {success && (
//             <Box sx={{ mb: 2 }}>
//               <Alert severity="success" onClose={() => setSuccess(null)}>
//                 {success}
//               </Alert>
//             </Box>
//           )}

//           {students.length === 0 ? (
//             <Paper sx={{ p: 4, textAlign: "center" }}>
//               <Typography>No students enrolled in this course</Typography>
//             </Paper>
//           ) : (
//             <>
//               <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//                 <Tabs
//                   value={activeComponent}
//                   onChange={handleComponentChange}
//                   variant="scrollable"
//                   scrollButtons="auto"
//                 >
//                   {Object.keys(course?.evaluationScheme || {}).map(
//                     (component) => (
//                       <Tab
//                         key={component}
//                         value={component}
//                         label={component}
//                         icon={
//                           component === activeComponent ? (
//                             <Chip
//                               size="small"
//                               label={`${Math.round(
//                                 course.evaluationScheme[component] * 100
//                               )}%`}
//                               color="primary"
//                             />
//                           ) : undefined
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && (
//                 <Box>
//                   {activeComponent.startsWith("CA") &&
//                     renderCAComponent(activeComponent)}
//                   {activeComponent === "LAB" && renderLabComponent()}
//                   {activeComponent === "ASSIGNMENT" &&
//                     renderAssignmentComponent()}
//                 </Box>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Chip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Course, Student } from "../../types";
import { scoreService } from "../../services/scoreService";
import CAScoreEntryComponent from "./CAScoreEntryComponent";

interface DynamicScoreEntryProps {
  course: Course;
  students: Student[];
  onSaveComplete?: () => void;
}

// Simplified interface for CA component scores
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

const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
  course,
  students,
  onSaveComplete,
}) => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [caScores, setCAScores] = useState<{
    [component: string]: DetailedScore;
  }>({});
  const [assignmentScores, setAssignmentScores] = useState<{
    [studentId: string]: number;
  }>({});

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize based on course evaluation scheme
  useEffect(() => {
    if (!course) return;

    const components = Object.keys(course.evaluationScheme);
    if (components.length > 0 && !activeComponent) {
      setActiveComponent(components[0]);
    }

    // Load existing scores
    loadExistingScores();
  }, [course, students]);

  // Load existing scores from the server
  const loadExistingScores = async () => {
    if (!course || students.length === 0) return;

    try {
      setLoading(true);
      const existingScores = await scoreService.getScoresByCourse(course._id);

      const updatedCAScores: { [component: string]: DetailedScore } = {};
      const updatedAssignmentScores: { [studentId: string]: number } = {};

      // Process existing scores
      existingScores.forEach((scoreEntry: any) => {
        const studentId =
          typeof scoreEntry.studentId === "string"
            ? scoreEntry.studentId
            : scoreEntry.studentId._id;

        if (!studentId) return;

        scoreEntry.scores.forEach((component: any) => {
          if (component.componentName.startsWith("CA")) {
            if (!updatedCAScores[component.componentName]) {
              updatedCAScores[component.componentName] = {};
            }

            // Initialize with empty structure
            if (!updatedCAScores[component.componentName][studentId]) {
              updatedCAScores[component.componentName][studentId] = {
                I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                outOf50: component.obtainedMarks || 0,
                outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
              };
            }
          } else if (component.componentName === "ASSIGNMENT") {
            updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
          }
        });
      });

      setCAScores(updatedCAScores);
      setAssignmentScores(updatedAssignmentScores);
    } catch (error) {
      console.error("Error loading existing scores:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleComponentChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setActiveComponent(newValue);
  };

  // Handle CA component score change
  const handleCAScoreChange = (component: string, scores: DetailedScore) => {
    setCAScores((prev) => ({
      ...prev,
      [component]: scores,
    }));
  };

  // Handle assignment score change
  const handleAssignmentScoreChange = (studentId: string, value: number) => {
    setAssignmentScores((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // Get component data (max marks, passing marks)
  const getComponentData = (componentName: string) => {
    if (!course) return null;

    const weight = course.evaluationScheme[componentName];
    if (!weight) return null;

    const maxMarks = Math.round(weight * 100);
    const passMark = Math.round(
      maxMarks * (componentName === "LAB" ? 0.5 : 0.4)
    ); // 50% for LAB, 40% for others

    return {
      maxMarks,
      passMark,
    };
  };

  // Prepare data for API submission
  const prepareScoresForSubmission = () => {
    const formattedScores: any[] = [];

    students.forEach((student) => {
      const studentScores: any[] = [];

      // Process CA components
      Object.keys(caScores).forEach((componentName) => {
        if (caScores[componentName] && caScores[componentName][student._id]) {
          const componentData = getComponentData(componentName);
          if (componentData) {
            studentScores.push({
              componentName,
              maxMarks: componentData.maxMarks,
              obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
            });
          }
        }
      });

      // Process ASSIGNMENT component
      if (assignmentScores[student._id] !== undefined) {
        const componentData = getComponentData("ASSIGNMENT");
        if (componentData) {
          studentScores.push({
            componentName: "ASSIGNMENT",
            maxMarks: componentData.maxMarks,
            obtainedMarks: assignmentScores[student._id],
          });
        }
      }

      // Only add if there are scores
      if (studentScores.length > 0) {
        formattedScores.push({
          studentId: student._id,
          academicYear: student.academicYear,
          scores: studentScores,
        });
      }
    });

    return formattedScores;
  };

  // Save all scores
  const handleSaveAllScores = async () => {
    if (!course) return;

    try {
      setSaving(true);
      setError(null);

      const scoresToSubmit = prepareScoresForSubmission();

      await scoreService.updateCourseScores(course._id, scoresToSubmit);

      setSuccess("All scores saved successfully!");

      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (error: any) {
      console.error("Error saving scores:", error);
      setError(error.response?.data?.message || "Failed to save scores");
    } finally {
      setSaving(false);
    }
  };

  // Render ASSIGNMENT component
  const renderAssignmentComponent = () => {
    const componentData = getComponentData("ASSIGNMENT");
    if (!componentData) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Assignment/Internal Assessment
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SNo.</TableCell>
                <TableCell>Enrollment No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">
                  Marks (Max: {componentData.maxMarks})
                </TableCell>
                <TableCell>Marks in Words</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={assignmentScores[student._id] || 0}
                      onChange={(e) =>
                        handleAssignmentScoreChange(
                          student._id,
                          Number(e.target.value)
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: componentData.maxMarks,
                        style: { textAlign: "center" },
                      }}
                      size="small"
                      sx={{ width: 70 }}
                    />
                  </TableCell>

                  <TableCell>
                    {numberToWords(assignmentScores[student._id] || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5">
                {course?.code} - {course?.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Type: {course?.type} | Slot: {course?.slot} | Venue:{" "}
                {course?.venue || "N/A"}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllScores}
                disabled={saving || students.length === 0}
                size="large"
              >
                {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {students.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography>No students enrolled in this course</Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={activeComponent}
                  onChange={handleComponentChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {Object.keys(course?.evaluationScheme || {}).map(
                    (component) => (
                      <Tab
                        key={component}
                        value={component}
                        label={component}
                        icon={
                          <Chip
                            size="small"
                            label={`${Math.round(
                              course.evaluationScheme[component] * 100
                            )}%`}
                            color="primary"
                          />
                        }
                        iconPosition="end"
                      />
                    )
                  )}
                </Tabs>
              </Box>

              {/* Component-specific content */}
              {activeComponent && (
                <Box>
                  {activeComponent.startsWith("CA") && (
                    <CAScoreEntryComponent
                      students={students}
                      componentName={activeComponent}
                      onScoresChange={(scores) =>
                        handleCAScoreChange(activeComponent, scores)
                      }
                      initialScores={caScores[activeComponent]}
                    />
                  )}
                  {activeComponent === "ASSIGNMENT" &&
                    renderAssignmentComponent()}
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DynamicScoreEntry;
