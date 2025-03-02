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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
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

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: number;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: number } = {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
//               };
//             }
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (studentId: string, value: number) => {
//     setAssignmentScores((prev) => ({
//       ...prev,
//       [studentId]: value,
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

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//             });
//           }
//         }
//       });

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

//       // Only add if there are scores
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
//                       inputProps={{
//                         min: 0,
//                         max: componentData.maxMarks,
//                         style: { textAlign: "center" },
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
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
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
//                   {activeComponent.startsWith("CA") && (
//                     <CAScoreEntryComponent
//                       students={students}
//                       componentName={activeComponent}
//                       onScoresChange={(scores) =>
//                         handleCAScoreChange(activeComponent, scores)
//                       }
//                       initialScores={caScores[activeComponent]}
//                     />
//                   )}
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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Snackbar,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
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

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: number;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: number } = {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
//               };
//             }
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (studentId: string, value: number) => {
//     setAssignmentScores((prev) => ({
//       ...prev,
//       [studentId]: value,
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

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//             });
//           }
//         }
//       });

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

//       // Only add if there are scores
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

//   // Render ASSIGNMENT component
//   const renderAssignmentComponent = () => {
//     const componentData = getComponentData("ASSIGNMENT");
//     if (!componentData) return null;

//     // Calculate passing marks
//     const passingMarks = Math.round(componentData.maxMarks * 0.4);

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
//                 <TableCell>Academic_Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>
//                 <TableCell align="center">
//                   Out_of_{componentData.maxMarks} (pass {passingMarks})
//                 </TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const score = assignmentScores[student._id] || 0;
//                 const isPassing = score >= passingMarks;

//                 return (
//                   <TableRow key={student._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={score}
//                         onChange={(e) =>
//                           handleAssignmentScoreChange(
//                             student._id,
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           max: componentData.maxMarks,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{
//                           width: 70,
//                           "& input": {
//                             color: isPassing ? "green" : "red",
//                             fontWeight: "bold",
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell>{numberToWords(score)}</TableCell>
//                   </TableRow>
//                 );
//               })}
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
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
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
//                   {activeComponent.startsWith("CA") && (
//                     <CAScoreEntryComponent
//                       students={students}
//                       componentName={activeComponent}
//                       onScoresChange={(scores) =>
//                         handleCAScoreChange(activeComponent, scores)
//                       }
//                       initialScores={caScores[activeComponent]}
//                     />
//                   )}
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

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
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

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: number;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: number } = {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
//               };
//             }
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (studentId: string, value: number) => {
//     setAssignmentScores((prev) => ({
//       ...prev,
//       [studentId]: value,
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

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//             });
//           }
//         }
//       });

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

//       // Only add if there are scores
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

//   // Render ASSIGNMENT component
//   const renderAssignmentComponent = () => {
//     const componentData = getComponentData("ASSIGNMENT");
//     if (!componentData) return null;

//     // Calculate passing marks
//     const passingMarks = Math.round(componentData.maxMarks * 0.4);

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
//                 <TableCell>Academic_Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>
//                 <TableCell align="center">
//                   Out_of_{componentData.maxMarks} (pass {passingMarks})
//                 </TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const score = assignmentScores[student._id] || 0;
//                 const isPassing = score >= passingMarks;

//                 return (
//                   <TableRow key={student._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={score}
//                         onChange={(e) =>
//                           handleAssignmentScoreChange(
//                             student._id,
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           max: componentData.maxMarks,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{
//                           width: 70,
//                           "& input": {
//                             color: isPassing ? "green" : "red",
//                             fontWeight: "bold",
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell>{numberToWords(score)}</TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   // Render the appropriate component based on active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       return <TotalScoreComponent course={course} students={students} />;
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return renderAssignmentComponent();
//     }

//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
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

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: number;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: number } = {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
//               };
//             }
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = component.obtainedMarks || 0;
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (studentId: string, value: number) => {
//     setAssignmentScores((prev) => ({
//       ...prev,
//       [studentId]: value,
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

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//             });
//           }
//         }
//       });

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

//       // Only add if there are scores
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

//   // Render ASSIGNMENT component
//   const renderAssignmentComponent = () => {
//     const componentData = getComponentData("ASSIGNMENT");
//     if (!componentData) return null;

//     // Calculate passing marks
//     const passingMarks = Math.round(componentData.maxMarks * 0.4);

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
//                 <TableCell>Academic_Year</TableCell>
//                 <TableCell>Program</TableCell>
//                 <TableCell>Enrollment No.</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Semester</TableCell>
//                 <TableCell align="center">
//                   Out_of_{componentData.maxMarks} (pass {passingMarks})
//                 </TableCell>
//                 <TableCell>Marks in Words</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => {
//                 const score = assignmentScores[student._id] || 0;
//                 const isPassing = score >= passingMarks;

//                 return (
//                   <TableRow key={student._id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{student.academicYear}</TableCell>
//                     <TableCell>{student.program}</TableCell>
//                     <TableCell>{student.registrationNumber}</TableCell>
//                     <TableCell>{student.name}</TableCell>
//                     <TableCell>{student.semester}</TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={score}
//                         onChange={(e) =>
//                           handleAssignmentScoreChange(
//                             student._id,
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           max: componentData.maxMarks,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{
//                           width: 70,
//                           "& input": {
//                             color: isPassing ? "green" : "red",
//                             fontWeight: "bold",
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell>{numberToWords(score)}</TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   // Render the appropriate component based on active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       // Pass 40 as the passing threshold for the total score
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={40}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return renderAssignmentComponent();
//     }

//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

// // Lab session interface
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

// // Assignment score interface
// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) return;

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: Math.round((component.obtainedMarks * 20) / 50) || 0,
//               };
//             }
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle LAB component score change
//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
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

//   // Prepare data for API submission
//   //   const prepareScoresForSubmission = () => {
//   //     const formattedScores: any[] = [];

//   //     students.forEach((student) => {
//   //       const studentScores: any[] = [];

//   //       // Process CA components
//   //       Object.keys(caScores).forEach((componentName) => {
//   //         if (caScores[componentName] && caScores[componentName][student._id]) {
//   //           const componentData = getComponentData(componentName);
//   //           if (componentData) {
//   //             studentScores.push({
//   //               componentName,
//   //               maxMarks: componentData.maxMarks,
//   //               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//   //             });
//   //           }
//   //         }
//   //       });

//   //       // Process LAB component
//   //       if (labScores[student._id]) {
//   //         const labScore = labScores[student._id];
//   //         studentScores.push({
//   //           componentName: "LAB",
//   //           maxMarks: 30,
//   //           obtainedMarks: labScore.totalObtained,
//   //         });
//   //       }

//   //       // Process ASSIGNMENT component
//   //       if (assignmentScores[student._id]) {
//   //         const assignmentScore = assignmentScores[student._id];
//   //         studentScores.push({
//   //           componentName: "ASSIGNMENT",
//   //           maxMarks: 10,
//   //           obtainedMarks: assignmentScore.obtainedMarks,
//   //         });
//   //       }

//   //       // Only add if there are scores
//   //       if (studentScores.length > 0) {
//   //         formattedScores.push({
//   //           studentId: student._id,
//   //           academicYear: student.academicYear,
//   //           scores: studentScores,
//   //         });
//   //       }
//   //     });

//   //     return formattedScores;
//   //   };

//   // This is the updated prepareScoresForSubmission function for the DynamicScoreEntry component

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const componentData = getComponentData(componentName);
//           if (componentData) {
//             studentScores.push({
//               componentName,
//               maxMarks: componentData.maxMarks,
//               obtainedMarks: caScores[componentName][student._id].outOf50 || 0,
//             });
//           }
//         }
//       });

//       // Process LAB component
//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];

//         // Make sure we have totalObtained
//         const totalObtained =
//           typeof labScore.totalObtained === "number"
//             ? labScore.totalObtained
//             : 0;

//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: 30,
//           obtainedMarks: totalObtained,
//         });
//       }

//       // Process ASSIGNMENT component
//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];

//         // Make sure we have obtainedMarks
//         const obtainedMarks =
//           typeof assignmentScore.obtainedMarks === "number"
//             ? assignmentScore.obtainedMarks
//             : 0;

//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: 10,
//           obtainedMarks: obtainedMarks,
//         });
//       }

//       // Only add if there are scores
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

//   // Render the appropriate component based on active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       // Pass 40 as the passing threshold for the total score
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={40}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }

//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

// // Lab session interface
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

// // Assignment score interface
// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Initialize with empty structure
//             if (!updatedCAScores[component.componentName][studentId]) {
//               updatedCAScores[component.componentName][studentId] = {
//                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                 outOf50: component.obtainedMarks || 0,
//                 outOf20: component.obtainedMarks || 0, // This will be scaled properly in the components
//               };
//             }
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle LAB component score change
//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];
//           studentScores.push({
//             componentName,
//             maxMarks: 100, // Server will handle scaling
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       // Process LAB component
//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];

//         // Make sure we have totalObtained
//         const totalObtained =
//           typeof labScore.totalObtained === "number"
//             ? labScore.totalObtained
//             : 0;

//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: totalObtained,
//         });
//       }

//       // Process ASSIGNMENT component
//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];

//         // Make sure we have obtainedMarks
//         const obtainedMarks =
//           typeof assignmentScore.obtainedMarks === "number"
//             ? assignmentScore.obtainedMarks
//             : 0;

//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: obtainedMarks,
//         });
//       }

//       // Only add if there are scores
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

//   // Render the appropriate component based on active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       // Get the passing threshold for the total score from the course type
//       const passingThreshold = getCourseTotalPassingMarks(course.type);

//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={passingThreshold}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }

//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

// // Lab session interface
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

// // Assignment score interface
// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{
//     [studentId: string]: LabScore;
//   }>({});
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});

//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize based on course evaluation scheme
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     // Load existing scores
//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       // Process existing scores
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;

//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }

//             // Prepare a structure for this student's scores
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0, // Will be calculated below
//             };

//             // Calculate the outOf20 from outOf50 based on the course type
//             let conversionFactor = 0.4; // default
//             if (course.type === "PG" || course.type === "PG-Integrated") {
//               conversionFactor = course.type === "PG" ? 0.8 : 0.6;
//             } else if (
//               course.type === "UG" ||
//               course.type === "UG-Integrated"
//             ) {
//               conversionFactor = course.type === "UG" ? 0.5 : 0.4;
//             }
//             studentCAScore.outOf20 = Math.round(
//               studentCAScore.outOf50 * conversionFactor
//             );

//             // If we have detailed question data, use it
//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q) => {
//                 // Map question numbers to Roman numerals
//                 const questionMap = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";

//                 // Process each part
//                 q.parts.forEach((part) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });

//                 // Calculate question total
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }

//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handle CA component score change
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   // Handle LAB component score change
//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   // Handle assignment score change
//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Prepare data for API submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       const studentScores: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];

//           // Create array of question parts for the detailed scoring
//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });

//           studentScores.push({
//             componentName,
//             maxMarks: 100, // Server will handle scaling
//             obtainedMarks: studentScore.outOf50 || 0,
//             // Include detailed question scores
//             questions: questions,
//           });
//         }
//       });

//       // Process LAB component
//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];

//         // Make sure we have totalObtained
//         const totalObtained =
//           typeof labScore.totalObtained === "number"
//             ? labScore.totalObtained
//             : 0;

//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: totalObtained,
//         });
//       }

//       // Process ASSIGNMENT component
//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];

//         // Make sure we have obtainedMarks
//         const obtainedMarks =
//           typeof assignmentScore.obtainedMarks === "number"
//             ? assignmentScore.obtainedMarks
//             : 0;

//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: obtainedMarks,
//         });
//       }

//       // Only add if there are scores
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

//   // Render the appropriate component based on active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       // Get the passing threshold for the total score from the course type
//       const passingThreshold = getCourseTotalPassingMarks(course.type);

//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={passingThreshold}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       console.log("Rendering LAB component for course type:", course.type);
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       console.log(
//         "Rendering ASSIGNMENT component for course type:",
//         course.type
//       );
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }

//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>

//               {/* Component-specific content */}
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

// // Lab session interface
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

// // Assignment score interface
// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Initialize active component and load existing scores
//   useEffect(() => {
//     if (!course) return;

//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }

//     loadExistingScores();
//   }, [course, students]);

//   // Load existing scores from the server
//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);

//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       // Process existing scores from the server response
//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;
//         if (!studentId) return;

//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0,
//             };

//             // If detailed question data exists, populate it
//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q: any) => {
//                 const questionMap: {
//                   [key: number]: "I" | "II" | "III" | "IV" | "V";
//                 } = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";
//                 q.parts.forEach((part: any) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }
//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle tab/component change
//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   // Handlers for score updates from child components
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Modified prepareScoresForSubmission:
//   // This aggregates detailed question data (from CA components) into a top-level "questions" property.
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       let studentScores: any[] = [];
//       let aggregatedQuestions: any[] = [];

//       // Process CA components
//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];

//           // Build questions array from detailed scores (I-V)
//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });

//           // Aggregate questions at the top level
//           aggregatedQuestions = aggregatedQuestions.concat(questions);

//           // For CA components, add only the summary info in "scores"
//           studentScores.push({
//             componentName,
//             maxMarks: 100,
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       // Process LAB component
//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];
//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: labScore.totalObtained || 0,
//         });
//       }

//       // Process ASSIGNMENT component
//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];
//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: assignmentScore.obtainedMarks || 0,
//         });
//       }

//       // Only add if the student has any scores
//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//           questions: aggregatedQuestions, // top-level questions
//         });
//       }
//     });

//     return formattedScores;
//   };

//   const handleSaveAllScores = async () => {
//     if (!course) return;

//     try {
//       setSaving(true);
//       setError(null);
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

//   // Render the appropriate score entry component based on the active tab
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       const passingThreshold = getCourseTotalPassingMarks(course.type);
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={passingThreshold}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// // Simplified interface for CA component scores
// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

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

// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     if (!course) return;
//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }
//     loadExistingScores();
//   }, [course, students]);

//   // Existing: fetch scores from server
//   const loadExistingScores = async () => {
//     // ...
//   };

//   // Existing: handle changes from child components
//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     // ...
//   };
//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     // ...
//   };
//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     // ...
//   };

//   // Existing: prepare data and save
//   const prepareScoresForSubmission = () => {
//     // ...
//   };
//   const handleSaveAllScores = async () => {
//     // ...
//   };

//   // ======================================
//   //  ADD THIS: CSV EXPORT FUNCTIONALITY
//   // ======================================
//   const handleExportCSV = () => {
//     // Define CSV headers (edit as needed)
//     const headers = [
//       "SNo",
//       "Enrollment No",
//       "Name",
//       "Program",
//       "Semester",
//       "CA1",
//       "CA2",
//       "CA3",
//       "LAB",
//       "ASSIGNMENT",
//       "TOTAL",
//     ];

//     // Start with an array of arrays (for each row)
//     const csvRows: (string | number)[][] = [];
//     // Push header row
//     csvRows.push(headers);

//     // For each student, gather all relevant scores
//     students.forEach((student, index) => {
//       const row: (string | number)[] = [];
//       row.push(index + 1);
//       row.push(student.registrationNumber);
//       row.push(student.name);
//       row.push(student.program);
//       row.push(student.semester);

//       // CA1, CA2, CA3 from caScores
//       // (If you have more or fewer CA components, adjust accordingly)
//       const CA1 = caScores["CA1"]?.[student._id]?.outOf20 || 0;
//       const CA2 = caScores["CA2"]?.[student._id]?.outOf20 || 0;
//       const CA3 = caScores["CA3"]?.[student._id]?.outOf20 || 0;

//       // LAB
//       const lab = labScores[student._id]?.totalObtained || 0;

//       // ASSIGNMENT
//       const assignment = assignmentScores[student._id]?.obtainedMarks || 0;

//       // You could define "TOTAL" however you like
//       // For example, sum of CA1+CA2+CA3+lab+assignment
//       const total = CA1 + CA2 + CA3 + lab + assignment;

//       row.push(CA1, CA2, CA3, lab, assignment, total);

//       csvRows.push(row);
//     });

//     // Convert each row array into a CSV string, then join with newlines
//     const csvString = csvRows.map((row) => row.join(",")).join("\n");

//     // Download logic: create a Blob and a temporary link
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Scores_${course?.code || "course"}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   // ======================================

//   // Render the active component (existing)
//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       // ...
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={getCourseTotalPassingMarks(course.type)}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//               sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
//             >
//               {/* Existing SAVE ALL SCORES button */}
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>

//               {/* NEW: Export CSV button */}
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleExportCSV}
//                 disabled={students.length === 0}
//                 size="large"
//               >
//                 EXPORT CSV
//               </Button>
//             </Grid>
//           </Grid>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// // components/scores/DynamicScoreEntry.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

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

// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     if (!course) return;
//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }
//     loadExistingScores();
//   }, [course, students]);

//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);
//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;
//         if (!studentId) return;
//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0,
//             };

//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q: any) => {
//                 const questionMap: {
//                   [key: number]: "I" | "II" | "III" | "IV" | "V";
//                 } = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";
//                 q.parts.forEach((part: any) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }
//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Aggregates detailed question data into a top-level "questions" property
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       let studentScores: any[] = [];
//       let aggregatedQuestions: any[] = [];

//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];

//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });

//           aggregatedQuestions = aggregatedQuestions.concat(questions);

//           studentScores.push({
//             componentName,
//             maxMarks: 100,
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];
//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: labScore.totalObtained || 0,
//         });
//       }

//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];
//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: assignmentScore.obtainedMarks || 0,
//         });
//       }

//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//           questions: aggregatedQuestions,
//         });
//       }
//     });

//     return formattedScores;
//   };

//   const handleSaveAllScores = async () => {
//     if (!course) return;
//     try {
//       setSaving(true);
//       setError(null);
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

//   // ======================================
//   // CSV Export Functionality
//   // ======================================
//   const handleExportCSV = () => {
//     const headers = [
//       "SNo",
//       "Enrollment No",
//       "Name",
//       "Program",
//       "Semester",
//       "CA1",
//       "CA2",
//       "CA3",
//       "LAB",
//       "ASSIGNMENT",
//       "TOTAL",
//     ];
//     const csvRows: (string | number)[][] = [];
//     csvRows.push(headers);
//     students.forEach((student, index) => {
//       const row: (string | number)[] = [];
//       row.push(index + 1);
//       row.push(student.registrationNumber);
//       row.push(student.name);
//       row.push(student.program);
//       row.push(student.semester);

//       const CA1 = caScores["CA1"]?.[student._id]?.outOf20 || 0;
//       const CA2 = caScores["CA2"]?.[student._id]?.outOf20 || 0;
//       const CA3 = caScores["CA3"]?.[student._id]?.outOf20 || 0;
//       const lab = labScores[student._id]?.totalObtained || 0;
//       const assignment = assignmentScores[student._id]?.obtainedMarks || 0;
//       const total = CA1 + CA2 + CA3 + lab + assignment;

//       row.push(CA1, CA2, CA3, lab, assignment, total);
//       csvRows.push(row);
//     });
//     const csvString = csvRows.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Scores_${course?.code || "course"}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   // ======================================

//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={getCourseTotalPassingMarks(course.type)}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//               sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleExportCSV}
//                 disabled={students.length === 0}
//                 size="large"
//               >
//                 EXPORT CSV
//               </Button>
//             </Grid>
//           </Grid>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// // components/scores/DynamicScoreEntry.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

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

// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     if (!course) return;
//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }
//     loadExistingScores();
//   }, [course, students]);

//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);
//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;
//         if (!studentId) return;
//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0,
//             };

//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q: any) => {
//                 const questionMap: {
//                   [key: number]: "I" | "II" | "III" | "IV" | "V";
//                 } = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";
//                 q.parts.forEach((part: any) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }
//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Aggregates detailed question data into a top-level "questions" property for submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       let studentScores: any[] = [];
//       let aggregatedQuestions: any[] = [];

//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];
//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });
//           aggregatedQuestions = aggregatedQuestions.concat(questions);
//           studentScores.push({
//             componentName,
//             maxMarks: 100,
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];
//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: labScore.totalObtained || 0,
//         });
//       }

//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];
//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: assignmentScore.obtainedMarks || 0,
//         });
//       }

//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//           questions: aggregatedQuestions,
//         });
//       }
//     });

//     return formattedScores;
//   };

//   const handleSaveAllScores = async () => {
//     if (!course) return;
//     try {
//       setSaving(true);
//       setError(null);
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

//   // ======================================
//   // CSV Export Functionality – Export details based on active component
//   // ======================================
//   const handleExportCSV = () => {
//     if (activeComponent.startsWith("CA")) {
//       // Export detailed CSV for a CA component (e.g., CA1)
//       const headers = ["SNo", "Enrollment No", "Name", "Program", "Semester"];
//       // For each question (I-V => Q1 to Q5), add columns for a, b, c, d, and total
//       for (let q = 1; q <= 5; q++) {
//         headers.push(`Q${q}_a`, `Q${q}_b`, `Q${q}_c`, `Q${q}_d`, `Q${q}_total`);
//       }
//       headers.push("Overall Score (OutOf20)");
//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const caData = caScores[activeComponent]?.[student._id];
//         if (caData) {
//           // Map questions I-V to Q1-Q5
//           const order = ["I", "II", "III", "IV", "V"];
//           order.forEach((qKey) => {
//             const qData = caData[qKey];
//             row.push(
//               qData?.a ?? 0,
//               qData?.b ?? 0,
//               qData?.c ?? 0,
//               qData?.d ?? 0,
//               qData?.total ?? 0
//             );
//           });
//           row.push(caData.outOf20 ?? 0);
//         } else {
//           // If no data, fill with zeros (5 questions * 5 columns + 1 overall = 26 columns)
//           for (let i = 0; i < 26; i++) {
//             row.push(0);
//           }
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${activeComponent}_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else if (activeComponent === "LAB") {
//       // Export detailed CSV for LAB component
//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Lab Session Date",
//         "Obtained Marks",
//         "Max Marks",
//       ];
//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const labData = labScores[student._id];
//         if (labData && labData.sessions && labData.sessions.length > 0) {
//           // Export details of the first lab session (modify as needed)
//           const session = labData.sessions[0];
//           row.push(
//             session.date,
//             session.obtainedMarks || 0,
//             session.maxMarks || 0
//           );
//         } else {
//           row.push("", 0, 0);
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `LAB_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else if (activeComponent === "ASSIGNMENT") {
//       // Export detailed CSV for ASSIGNMENT component
//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Assignment Obtained",
//         "Assignment Max Marks",
//       ];
//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const assignData = assignmentScores[student._id];
//         if (assignData) {
//           row.push(assignData.obtainedMarks || 0, assignData.maxMarks || 0);
//         } else {
//           row.push(0, 0);
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `ASSIGNMENT_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // ======================================

//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={getCourseTotalPassingMarks(course.type)}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//               sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleExportCSV}
//                 disabled={students.length === 0}
//                 size="large"
//               >
//                 EXPORT CSV
//               </Button>
//             </Grid>
//           </Grid>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// components/scores/DynamicScoreEntry.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

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

// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     if (!course) return;
//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }
//     loadExistingScores();
//   }, [course, students]);

//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);
//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;
//         if (!studentId) return;
//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0,
//             };

//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q: any) => {
//                 const questionMap: {
//                   [key: number]: "I" | "II" | "III" | "IV" | "V";
//                 } = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";
//                 q.parts.forEach((part: any) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }
//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Aggregates detailed question data into a top-level "questions" property for submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       let studentScores: any[] = [];
//       let aggregatedQuestions: any[] = [];

//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];
//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });
//           aggregatedQuestions = aggregatedQuestions.concat(questions);
//           studentScores.push({
//             componentName,
//             maxMarks: 100,
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];
//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: labScore.totalObtained || 0,
//         });
//       }

//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];
//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: assignmentScore.obtainedMarks || 0,
//         });
//       }

//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//           questions: aggregatedQuestions,
//         });
//       }
//     });

//     return formattedScores;
//   };

//   const handleSaveAllScores = async () => {
//     if (!course) return;
//     try {
//       setSaving(true);
//       setError(null);
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

//   // ======================================
//   // CSV Export Functionality – Export details based on active component
//   // ======================================
//   const handleExportCSV = () => {
//     if (activeComponent.startsWith("CA")) {
//       // Export detailed CSV for a CA component (e.g., CA1)
//       const headers = ["SNo", "Enrollment No", "Name", "Program", "Semester"];
//       // For each question (I-V => Q1 to Q5), add columns for a, b, c, d, and total
//       for (let q = 1; q <= 5; q++) {
//         headers.push(`Q${q}_a`, `Q${q}_b`, `Q${q}_c`, `Q${q}_d`, `Q${q}_total`);
//       }
//       headers.push("Overall Score (OutOf20)");
//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const caData = caScores[activeComponent]?.[student._id];
//         if (caData) {
//           const order = ["I", "II", "III", "IV", "V"];
//           order.forEach((qKey) => {
//             const qData = caData[qKey];
//             row.push(
//               qData?.a ?? 0,
//               qData?.b ?? 0,
//               qData?.c ?? 0,
//               qData?.d ?? 0,
//               qData?.total ?? 0
//             );
//           });
//           row.push(caData.outOf20 ?? 0);
//         } else {
//           for (let i = 0; i < 26; i++) {
//             row.push(0);
//           }
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${activeComponent}_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else if (activeComponent === "LAB") {
//       // Export detailed CSV for LAB component with all sessions
//       // Determine maximum number of lab sessions among all students
//       let maxSessions = 0;
//       students.forEach((student) => {
//         const labData = labScores[student._id];
//         if (
//           labData &&
//           labData.sessions &&
//           labData.sessions.length > maxSessions
//         ) {
//           maxSessions = labData.sessions.length;
//         }
//       });

//       // Construct headers: basic student info + dynamic lab session columns
//       const headers = ["SNo", "Enrollment No", "Name", "Program", "Semester"];
//       for (let i = 1; i <= maxSessions; i++) {
//         headers.push(
//           `Lab Session ${i} Date`,
//           `Lab Session ${i} Obtained`,
//           `Lab Session ${i} Max Marks`
//         );
//       }

//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);

//       // Construct each row
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const labData = labScores[student._id];

//         if (labData && labData.sessions && labData.sessions.length > 0) {
//           for (let i = 0; i < maxSessions; i++) {
//             if (i < labData.sessions.length) {
//               const session = labData.sessions[i];
//               row.push(
//                 session.date,
//                 session.obtainedMarks || 0,
//                 session.maxMarks || 0
//               );
//             } else {
//               row.push("", 0, 0);
//             }
//           }
//         } else {
//           for (let i = 0; i < maxSessions; i++) {
//             row.push("", 0, 0);
//           }
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `LAB_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else if (activeComponent === "ASSIGNMENT") {
//       // Export detailed CSV for ASSIGNMENT component
//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Assignment Obtained",
//         "Assignment Max Marks",
//       ];
//       const csvRows: (string | number)[][] = [];
//       csvRows.push(headers);
//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester
//         );
//         const assignData = assignmentScores[student._id];
//         if (assignData) {
//           row.push(assignData.obtainedMarks || 0, assignData.maxMarks || 0);
//         } else {
//           row.push(0, 0);
//         }
//         csvRows.push(row);
//       });
//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `ASSIGNMENT_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // ======================================

//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={getCourseTotalPassingMarks(course.type)}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//               sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleExportCSV}
//                 disabled={students.length === 0}
//                 size="large"
//               >
//                 EXPORT CSV
//               </Button>
//             </Grid>
//           </Grid>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// // components/scores/DynamicScoreEntry.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Paper,
//   Alert,
//   Tabs,
//   Tab,
//   Chip,
//   Typography,
// } from "@mui/material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import CAScoreEntryComponent from "./CAScoreEntryComponent";
// import LabScoreEntryComponent from "./LabScoreEntryComponent";
// import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
// import TotalScoreComponent from "./TotalScoreComponent";
// import { getCourseTotalPassingMarks } from "../../utils/scoreUtils";

// // Helper: converts a number to words (digit-by-digit)
// const numberToWords = (num: number): string => {
//   const digitWords = [
//     "ZERO",
//     "ONE",
//     "TWO",
//     "THREE",
//     "FOUR",
//     "FIVE",
//     "SIX",
//     "SEVEN",
//     "EIGHT",
//     "NINE",
//   ];
//   return String(num)
//     .split("")
//     .map((d) => digitWords[parseInt(d, 10)] || "")
//     .join(" ");
// };

// interface DynamicScoreEntryProps {
//   course: Course;
//   students: Student[];
//   onSaveComplete?: () => void;
// }

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

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

// interface AssignmentScore {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
//   course,
//   students,
//   onSaveComplete,
// }) => {
//   const [activeComponent, setActiveComponent] = useState<string>("");
//   const [caScores, setCAScores] = useState<{
//     [component: string]: DetailedScore;
//   }>({});
//   const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
//     {}
//   );
//   const [assignmentScores, setAssignmentScores] = useState<{
//     [studentId: string]: AssignmentScore;
//   }>({});
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     if (!course) return;
//     const components = Object.keys(course.evaluationScheme);
//     if (components.length > 0 && !activeComponent) {
//       setActiveComponent(components[0]);
//     }
//     loadExistingScores();
//   }, [course, students]);

//   const loadExistingScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const existingScores = await scoreService.getScoresByCourse(course._id);
//       const updatedCAScores: { [component: string]: DetailedScore } = {};
//       const updatedLabScores: { [studentId: string]: LabScore } = {};
//       const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
//         {};

//       existingScores.forEach((scoreEntry: any) => {
//         const studentId =
//           typeof scoreEntry.studentId === "string"
//             ? scoreEntry.studentId
//             : scoreEntry.studentId._id;
//         if (!studentId) return;
//         scoreEntry.scores.forEach((component: any) => {
//           if (component.componentName.startsWith("CA")) {
//             if (!updatedCAScores[component.componentName]) {
//               updatedCAScores[component.componentName] = {};
//             }
//             const studentCAScore = {
//               I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//               outOf50: component.obtainedMarks || 0,
//               outOf20: 0,
//             };

//             if (component.questions && component.questions.length > 0) {
//               component.questions.forEach((q: any) => {
//                 const questionMap: {
//                   [key: number]: "I" | "II" | "III" | "IV" | "V";
//                 } = {
//                   1: "I",
//                   2: "II",
//                   3: "III",
//                   4: "IV",
//                   5: "V",
//                 };
//                 const questionKey = questionMap[q.questionNumber] || "I";
//                 q.parts.forEach((part: any) => {
//                   if (part.partName === "a")
//                     studentCAScore[questionKey].a = part.obtainedMarks || 0;
//                   if (part.partName === "b")
//                     studentCAScore[questionKey].b = part.obtainedMarks || 0;
//                   if (part.partName === "c")
//                     studentCAScore[questionKey].c = part.obtainedMarks || 0;
//                   if (part.partName === "d")
//                     studentCAScore[questionKey].d = part.obtainedMarks || 0;
//                 });
//                 studentCAScore[questionKey].total =
//                   studentCAScore[questionKey].a +
//                   studentCAScore[questionKey].b +
//                   studentCAScore[questionKey].c +
//                   studentCAScore[questionKey].d;
//               });
//             }
//             updatedCAScores[component.componentName][studentId] =
//               studentCAScore;
//           } else if (component.componentName === "LAB") {
//             updatedLabScores[studentId] = {
//               componentName: "LAB",
//               sessions: [
//                 {
//                   date: new Date().toISOString().split("T")[0],
//                   maxMarks: component.maxMarks || 30,
//                   obtainedMarks: component.obtainedMarks || 0,
//                 },
//               ],
//               maxMarks: component.maxMarks || 30,
//               totalObtained: component.obtainedMarks || 0,
//             };
//           } else if (component.componentName === "ASSIGNMENT") {
//             updatedAssignmentScores[studentId] = {
//               componentName: "ASSIGNMENT",
//               maxMarks: component.maxMarks || 10,
//               obtainedMarks: component.obtainedMarks || 0,
//             };
//           }
//         });
//       });

//       setCAScores(updatedCAScores);
//       setLabScores(updatedLabScores);
//       setAssignmentScores(updatedAssignmentScores);
//     } catch (error) {
//       console.error("Error loading existing scores:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleComponentChange = (
//     event: React.SyntheticEvent,
//     newValue: string
//   ) => {
//     setActiveComponent(newValue);
//   };

//   const handleCAScoreChange = (component: string, scores: DetailedScore) => {
//     setCAScores((prev) => ({
//       ...prev,
//       [component]: scores,
//     }));
//   };

//   const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
//     setLabScores(scores);
//   };

//   const handleAssignmentScoreChange = (scores: {
//     [studentId: string]: AssignmentScore;
//   }) => {
//     setAssignmentScores(scores);
//   };

//   // Aggregates detailed question data into a top-level "questions" property for submission
//   const prepareScoresForSubmission = () => {
//     const formattedScores: any[] = [];

//     students.forEach((student) => {
//       let studentScores: any[] = [];
//       let aggregatedQuestions: any[] = [];

//       Object.keys(caScores).forEach((componentName) => {
//         if (caScores[componentName] && caScores[componentName][student._id]) {
//           const studentScore = caScores[componentName][student._id];
//           const questions = [];
//           ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
//             if (studentScore[questionNum]) {
//               questions.push({
//                 questionNumber: idx + 1,
//                 parts: [
//                   {
//                     partName: "a",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].a || 0,
//                   },
//                   {
//                     partName: "b",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].b || 0,
//                   },
//                   {
//                     partName: "c",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].c || 0,
//                   },
//                   {
//                     partName: "d",
//                     maxMarks: 5,
//                     obtainedMarks: studentScore[questionNum].d || 0,
//                   },
//                 ],
//               });
//             }
//           });
//           aggregatedQuestions = aggregatedQuestions.concat(questions);
//           studentScores.push({
//             componentName,
//             maxMarks: 100,
//             obtainedMarks: studentScore.outOf50 || 0,
//           });
//         }
//       });

//       if (labScores[student._id]) {
//         const labScore = labScores[student._id];
//         studentScores.push({
//           componentName: "LAB",
//           maxMarks: labScore.maxMarks,
//           obtainedMarks: labScore.totalObtained || 0,
//         });
//       }

//       if (assignmentScores[student._id]) {
//         const assignmentScore = assignmentScores[student._id];
//         studentScores.push({
//           componentName: "ASSIGNMENT",
//           maxMarks: assignmentScore.maxMarks,
//           obtainedMarks: assignmentScore.obtainedMarks || 0,
//         });
//       }

//       if (studentScores.length > 0) {
//         formattedScores.push({
//           studentId: student._id,
//           academicYear: student.academicYear,
//           scores: studentScores,
//           questions: aggregatedQuestions,
//         });
//       }
//     });

//     return formattedScores;
//   };

//   const handleSaveAllScores = async () => {
//     if (!course) return;
//     try {
//       setSaving(true);
//       setError(null);
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

//   // ======================================
//   // CSV Export Functionality – Export details based on active component
//   // ======================================
//   const handleExportCSV = () => {
//     // --- CA Export ---
//     if (activeComponent.startsWith("CA")) {
//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Academic Year",
//       ];
//       // For each question (Q1 to Q5), add columns for a, b, c, d, and total
//       for (let q = 1; q <= 5; q++) {
//         headers.push(`Q${q}_a`, `Q${q}_b`, `Q${q}_c`, `Q${q}_d`, `Q${q}_total`);
//       }
//       headers.push(
//         "Overall Score (OutOf20)",
//         "Overall Score (OutOf50)",
//         "Marks in Words"
//       );

//       const csvRows: (string | number)[][] = [];
//       // Prepend course info at the top
//       csvRows.push([
//         `Course Code: ${course.code}`,
//         `Course Name: ${course.name}`,
//       ]);
//       csvRows.push([]);
//       csvRows.push(headers);

//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester,
//           student.academicYear
//         );
//         const caData = caScores[activeComponent]?.[student._id];
//         if (caData) {
//           const order = ["I", "II", "III", "IV", "V"];
//           order.forEach((qKey) => {
//             const qData = caData[qKey];
//             row.push(
//               qData?.a ?? 0,
//               qData?.b ?? 0,
//               qData?.c ?? 0,
//               qData?.d ?? 0,
//               qData?.total ?? 0
//             );
//           });
//           row.push(
//             caData.outOf20 ?? 0,
//             caData.outOf50 ?? 0,
//             numberToWords(caData.outOf20 ?? 0)
//           );
//         } else {
//           // Fill in zeros for missing CA data (5 questions * 5 columns + 3 extra = 28 columns)
//           for (let i = 0; i < 28; i++) {
//             row.push(0);
//           }
//         }
//         csvRows.push(row);
//       });

//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${activeComponent}_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//     // --- LAB Export ---
//     else if (activeComponent === "LAB") {
//       // Determine maximum number of lab sessions among all students
//       let maxSessions = 0;
//       students.forEach((student) => {
//         const labData = labScores[student._id];
//         if (
//           labData &&
//           labData.sessions &&
//           labData.sessions.length > maxSessions
//         ) {
//           maxSessions = labData.sessions.length;
//         }
//       });

//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Academic Year",
//       ];
//       // For each lab session, add columns for Date, Obtained, and Max Marks
//       for (let i = 1; i <= maxSessions; i++) {
//         headers.push(
//           `Lab Session ${i} Date`,
//           `Lab Session ${i} Obtained`,
//           `Lab Session ${i} Max Marks`
//         );
//       }
//       headers.push(
//         "Overall Lab Score (Obtained)",
//         "Overall Lab Score (Max)",
//         "Marks in Words"
//       );

//       const csvRows: (string | number)[][] = [];
//       csvRows.push([
//         `Course Code: ${course.code}`,
//         `Course Name: ${course.name}`,
//       ]);
//       csvRows.push([]);
//       csvRows.push(headers);

//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester,
//           student.academicYear
//         );
//         const labData = labScores[student._id];

//         if (labData && labData.sessions && labData.sessions.length > 0) {
//           for (let i = 0; i < maxSessions; i++) {
//             if (i < labData.sessions.length) {
//               const session = labData.sessions[i];
//               row.push(
//                 session.date,
//                 session.obtainedMarks || 0,
//                 session.maxMarks || 0
//               );
//             } else {
//               row.push("", 0, 0);
//             }
//           }
//           row.push(
//             labData.totalObtained || 0,
//             labData.maxMarks || 0,
//             numberToWords(labData.totalObtained || 0)
//           );
//         } else {
//           for (let i = 0; i < maxSessions; i++) {
//             row.push("", 0, 0);
//           }
//           row.push(0, 0, "ZERO");
//         }
//         csvRows.push(row);
//       });

//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `LAB_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//     // --- ASSIGNMENT Export ---
//     else if (activeComponent === "ASSIGNMENT") {
//       const headers = [
//         "SNo",
//         "Enrollment No",
//         "Name",
//         "Program",
//         "Semester",
//         "Academic Year",
//         "Assignment Obtained",
//         "Assignment Max Marks",
//         "Marks in Words",
//       ];
//       const csvRows: (string | number)[][] = [];
//       csvRows.push([
//         `Course Code: ${course.code}`,
//         `Course Name: ${course.name}`,
//       ]);
//       csvRows.push([]);
//       csvRows.push(headers);

//       students.forEach((student, index) => {
//         const row: (string | number)[] = [];
//         row.push(
//           index + 1,
//           student.registrationNumber,
//           student.name,
//           student.program,
//           student.semester,
//           student.academicYear
//         );
//         const assignData = assignmentScores[student._id];
//         if (assignData) {
//           row.push(
//             assignData.obtainedMarks || 0,
//             assignData.maxMarks || 0,
//             numberToWords(assignData.obtainedMarks || 0)
//           );
//         } else {
//           row.push(0, 0, "ZERO");
//         }
//         csvRows.push(row);
//       });

//       const csvString = csvRows.map((row) => row.join(",")).join("\n");
//       const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `ASSIGNMENT_Scores.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   // ======================================

//   const renderComponent = () => {
//     if (activeComponent === "TOTAL") {
//       return (
//         <TotalScoreComponent
//           course={course}
//           students={students}
//           passingThreshold={getCourseTotalPassingMarks(course.type)}
//         />
//       );
//     } else if (activeComponent.startsWith("CA")) {
//       return (
//         <CAScoreEntryComponent
//           students={students}
//           componentName={activeComponent}
//           courseType={course.type}
//           onScoresChange={(scores) =>
//             handleCAScoreChange(activeComponent, scores)
//           }
//           initialScores={caScores[activeComponent]}
//         />
//       );
//     } else if (activeComponent === "LAB") {
//       return (
//         <LabScoreEntryComponent
//           students={students}
//           componentName="LAB"
//           courseType={course.type}
//           onScoresChange={handleLabScoreChange}
//           initialScores={labScores}
//         />
//       );
//     } else if (activeComponent === "ASSIGNMENT") {
//       return (
//         <AssignmentScoreEntryComponent
//           students={students}
//           componentName="ASSIGNMENT"
//           courseType={course.type}
//           onScoresChange={handleAssignmentScoreChange}
//           initialScores={assignmentScores}
//         />
//       );
//     }
//     return null;
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
//               sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSaveAllScores}
//                 disabled={
//                   saving || students.length === 0 || activeComponent === "TOTAL"
//                 }
//                 size="large"
//               >
//                 {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleExportCSV}
//                 disabled={students.length === 0}
//                 size="large"
//               >
//                 EXPORT CSV
//               </Button>
//             </Grid>
//           </Grid>
//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}
//           {success && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//               onClose={() => setSuccess(null)}
//             >
//               {success}
//             </Alert>
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
//                           <Chip
//                             size="small"
//                             label={`${Math.round(
//                               course.evaluationScheme[component] * 100
//                             )}%`}
//                             color="primary"
//                           />
//                         }
//                         iconPosition="end"
//                       />
//                     )
//                   )}
//                   <Tab
//                     value="TOTAL"
//                     label="TOTAL"
//                     icon={<Chip size="small" label="100%" color="success" />}
//                     iconPosition="end"
//                   />
//                 </Tabs>
//               </Box>
//               {activeComponent && renderComponent()}
//             </>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default DynamicScoreEntry;

// components/scores/DynamicScoreEntry.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Alert,
  Tabs,
  Tab,
  Chip,
  Typography,
} from "@mui/material";
import { Course, Student } from "../../types";
import { scoreService } from "../../services/scoreService";
import CAScoreEntryComponent from "./CAScoreEntryComponent";
import LabScoreEntryComponent from "./LabScoreEntryComponent";
import AssignmentScoreEntryComponent from "./AssignmentScoreEntryComponent";
import TotalScoreComponent from "./TotalScoreComponent";
import {
  getCourseTotalPassingMarks,
  getComponentScale,
} from "../../utils/scoreUtils";

// Helper: converts a number to words (digit-by-digit)
const numberToWords = (num: number): string => {
  const digitWords = [
    "ZERO",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
  ];
  return String(num)
    .split("")
    .map((d) => digitWords[parseInt(d, 10)] || "")
    .join(" ");
};

interface DynamicScoreEntryProps {
  course: Course;
  students: Student[];
  onSaveComplete?: () => void;
}

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

interface AssignmentScore {
  componentName: string;
  maxMarks: number;
  obtainedMarks: number;
}

const DynamicScoreEntry: React.FC<DynamicScoreEntryProps> = ({
  course,
  students,
  onSaveComplete,
}) => {
  const [activeComponent, setActiveComponent] = useState<string>("");
  const [caScores, setCAScores] = useState<{
    [component: string]: DetailedScore;
  }>({});
  const [labScores, setLabScores] = useState<{ [studentId: string]: LabScore }>(
    {}
  );
  const [assignmentScores, setAssignmentScores] = useState<{
    [studentId: string]: AssignmentScore;
  }>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!course) return;
    const components = Object.keys(course.evaluationScheme);
    if (components.length > 0 && !activeComponent) {
      setActiveComponent(components[0]);
    }
    loadExistingScores();
  }, [course, students]);

  const loadExistingScores = async () => {
    if (!course || students.length === 0) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const existingScores = await scoreService.getScoresByCourse(course._id);
      const updatedCAScores: { [component: string]: DetailedScore } = {};
      const updatedLabScores: { [studentId: string]: LabScore } = {};
      const updatedAssignmentScores: { [studentId: string]: AssignmentScore } =
        {};

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
            const studentCAScore = {
              I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
              II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
              III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
              IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
              V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
              outOf50: component.obtainedMarks || 0,
              outOf20: 0,
            };

            if (component.questions && component.questions.length > 0) {
              component.questions.forEach((q: any) => {
                const questionMap: {
                  [key: number]: "I" | "II" | "III" | "IV" | "V";
                } = {
                  1: "I",
                  2: "II",
                  3: "III",
                  4: "IV",
                  5: "V",
                };
                const questionKey = questionMap[q.questionNumber] || "I";
                q.parts.forEach((part: any) => {
                  if (part.partName === "a")
                    studentCAScore[questionKey].a = part.obtainedMarks || 0;
                  if (part.partName === "b")
                    studentCAScore[questionKey].b = part.obtainedMarks || 0;
                  if (part.partName === "c")
                    studentCAScore[questionKey].c = part.obtainedMarks || 0;
                  if (part.partName === "d")
                    studentCAScore[questionKey].d = part.obtainedMarks || 0;
                });
                studentCAScore[questionKey].total =
                  studentCAScore[questionKey].a +
                  studentCAScore[questionKey].b +
                  studentCAScore[questionKey].c +
                  studentCAScore[questionKey].d;
              });
            }
            updatedCAScores[component.componentName][studentId] =
              studentCAScore;
          } else if (component.componentName === "LAB") {
            updatedLabScores[studentId] = {
              componentName: "LAB",
              sessions: [
                {
                  date: new Date().toISOString().split("T")[0],
                  maxMarks: component.maxMarks || 30,
                  obtainedMarks: component.obtainedMarks || 0,
                },
              ],
              maxMarks: component.maxMarks || 30,
              totalObtained: component.obtainedMarks || 0,
            };
          } else if (component.componentName === "ASSIGNMENT") {
            updatedAssignmentScores[studentId] = {
              componentName: "ASSIGNMENT",
              maxMarks: component.maxMarks || 10,
              obtainedMarks: component.obtainedMarks || 0,
            };
          }
        });
      });

      setCAScores(updatedCAScores);
      setLabScores(updatedLabScores);
      setAssignmentScores(updatedAssignmentScores);
    } catch (error) {
      console.error("Error loading existing scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setActiveComponent(newValue);
  };

  const handleCAScoreChange = (component: string, scores: DetailedScore) => {
    setCAScores((prev) => ({
      ...prev,
      [component]: scores,
    }));
  };

  const handleLabScoreChange = (scores: { [studentId: string]: LabScore }) => {
    setLabScores(scores);
  };

  const handleAssignmentScoreChange = (scores: {
    [studentId: string]: AssignmentScore;
  }) => {
    setAssignmentScores(scores);
  };

  // Aggregates detailed question data into a top-level "questions" property for submission
  const prepareScoresForSubmission = () => {
    const formattedScores: any[] = [];

    students.forEach((student) => {
      let studentScores: any[] = [];
      let aggregatedQuestions: any[] = [];

      Object.keys(caScores).forEach((componentName) => {
        if (caScores[componentName] && caScores[componentName][student._id]) {
          const studentScore = caScores[componentName][student._id];
          const questions = [];
          ["I", "II", "III", "IV", "V"].forEach((questionNum, idx) => {
            if (studentScore[questionNum]) {
              questions.push({
                questionNumber: idx + 1,
                parts: [
                  {
                    partName: "a",
                    maxMarks: 5,
                    obtainedMarks: studentScore[questionNum].a || 0,
                  },
                  {
                    partName: "b",
                    maxMarks: 5,
                    obtainedMarks: studentScore[questionNum].b || 0,
                  },
                  {
                    partName: "c",
                    maxMarks: 5,
                    obtainedMarks: studentScore[questionNum].c || 0,
                  },
                  {
                    partName: "d",
                    maxMarks: 5,
                    obtainedMarks: studentScore[questionNum].d || 0,
                  },
                ],
              });
            }
          });
          aggregatedQuestions = aggregatedQuestions.concat(questions);
          studentScores.push({
            componentName,
            maxMarks: 100,
            obtainedMarks: studentScore.outOf50 || 0,
          });
        }
      });

      if (labScores[student._id]) {
        const labScore = labScores[student._id];
        studentScores.push({
          componentName: "LAB",
          maxMarks: labScore.maxMarks,
          obtainedMarks: labScore.totalObtained || 0,
        });
      }

      if (assignmentScores[student._id]) {
        const assignmentScore = assignmentScores[student._id];
        studentScores.push({
          componentName: "ASSIGNMENT",
          maxMarks: assignmentScore.maxMarks,
          obtainedMarks: assignmentScore.obtainedMarks || 0,
        });
      }

      if (studentScores.length > 0) {
        formattedScores.push({
          studentId: student._id,
          academicYear: student.academicYear,
          scores: studentScores,
          questions: aggregatedQuestions,
        });
      }
    });

    return formattedScores;
  };

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

  // ======================================
  // CSV Export Functionality – Export details based on active component
  // ======================================
  const handleExportCSV = () => {
    // --- CA Export ---
    if (activeComponent.startsWith("CA")) {
      const headers = [
        "SNo",
        "Enrollment No",
        "Name",
        "Program",
        "Semester",
        "Academic Year",
      ];
      // For each question (Q1 to Q5), add columns for a, b, c, d, and total
      for (let q = 1; q <= 5; q++) {
        headers.push(`Q${q}_a`, `Q${q}_b`, `Q${q}_c`, `Q${q}_d`, `Q${q}_total`);
      }
      headers.push(
        "Overall Score (OutOf20)",
        "Overall Score (OutOf50)",
        "Marks in Words"
      );

      const csvRows: (string | number)[][] = [];
      // Prepend course info at the top
      csvRows.push([
        `Course Code: ${course.code}`,
        `Course Name: ${course.name}`,
      ]);
      csvRows.push([]);
      csvRows.push(headers);

      students.forEach((student, index) => {
        const row: (string | number)[] = [];
        row.push(
          index + 1,
          student.registrationNumber,
          student.name,
          student.program,
          student.semester,
          student.academicYear
        );
        const caData = caScores[activeComponent]?.[student._id];
        if (caData) {
          const order = ["I", "II", "III", "IV", "V"];
          order.forEach((qKey) => {
            const qData = caData[qKey];
            row.push(
              qData?.a ?? 0,
              qData?.b ?? 0,
              qData?.c ?? 0,
              qData?.d ?? 0,
              qData?.total ?? 0
            );
          });
          row.push(
            caData.outOf20 ?? 0,
            caData.outOf50 ?? 0,
            numberToWords(caData.outOf20 ?? 0)
          );
        } else {
          for (let i = 0; i < 28; i++) {
            row.push(0);
          }
        }
        csvRows.push(row);
      });

      const csvString = csvRows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeComponent}_Scores.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // --- LAB Export ---
    else if (activeComponent === "LAB") {
      // Determine maximum number of lab sessions among all students
      let maxSessions = 0;
      students.forEach((student) => {
        const labData = labScores[student._id];
        if (
          labData &&
          labData.sessions &&
          labData.sessions.length > maxSessions
        ) {
          maxSessions = labData.sessions.length;
        }
      });

      // Construct headers: basic student info + dynamic lab session columns (only Date and Obtained)
      const headers = [
        "SNo",
        "Enrollment No",
        "Name",
        "Program",
        "Semester",
        "Academic Year",
      ];
      for (let i = 1; i <= maxSessions; i++) {
        headers.push(`Lab Session ${i} Date`, `Lab Session ${i} Obtained`);
      }
      headers.push(
        "Overall Lab Score (Obtained)",
        "Overall Lab Score (Max)",
        "Marks in Words"
      );

      const csvRows: (string | number)[][] = [];
      csvRows.push([
        `Course Code: ${course.code}`,
        `Course Name: ${course.name}`,
      ]);
      csvRows.push([]);
      csvRows.push(headers);

      // Construct each row
      students.forEach((student, index) => {
        const row: (string | number)[] = [];
        row.push(
          index + 1,
          student.registrationNumber,
          student.name,
          student.program,
          student.semester,
          student.academicYear
        );
        const labData = labScores[student._id];

        if (labData && labData.sessions && labData.sessions.length > 0) {
          for (let i = 0; i < maxSessions; i++) {
            if (i < labData.sessions.length) {
              const session = labData.sessions[i];
              row.push(session.date, session.obtainedMarks || 0);
            } else {
              row.push("", 0);
            }
          }
          row.push(
            labData.totalObtained || 0,
            labData.maxMarks || 0,
            numberToWords(labData.totalObtained || 0)
          );
        } else {
          for (let i = 0; i < maxSessions; i++) {
            row.push("", 0);
          }
          row.push(0, 0, "ZERO");
        }
        csvRows.push(row);
      });

      const csvString = csvRows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `LAB_Scores.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // --- ASSIGNMENT Export ---
    else if (activeComponent === "ASSIGNMENT") {
      const headers = [
        "SNo",
        "Enrollment No",
        "Name",
        "Program",
        "Semester",
        "Academic Year",
        "Assignment Obtained",
        "Assignment Max Marks",
        "Marks in Words",
      ];
      const csvRows: (string | number)[][] = [];
      csvRows.push([
        `Course Code: ${course.code}`,
        `Course Name: ${course.name}`,
      ]);
      csvRows.push([]);
      csvRows.push(headers);

      students.forEach((student, index) => {
        const row: (string | number)[] = [];
        row.push(
          index + 1,
          student.registrationNumber,
          student.name,
          student.program,
          student.semester,
          student.academicYear
        );
        const assignData = assignmentScores[student._id];
        if (assignData) {
          row.push(
            assignData.obtainedMarks || 0,
            assignData.maxMarks || 0,
            numberToWords(assignData.obtainedMarks || 0)
          );
        } else {
          row.push(0, 0, "ZERO");
        }
        csvRows.push(row);
      });

      const csvString = csvRows.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ASSIGNMENT_Scores.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // --- TOTAL Export ---
    else if (activeComponent === "TOTAL") {
      (async () => {
        try {
          // 1. Fetch raw scores from the server
          const rawScores = await scoreService.getScoresByCourse(course._id);

          // 2. Define CSV headers in the exact order you want
          const headers = [
            "SNo.",
            "Academic_Year",
            "Program",
            "Enrollment No.",
            "Name",
            "Semester",
            "CA1 (Out of 30, Pass 12)",
            "CA2 (Out of 30, Pass 12)",
            "LAB (Out of 30, Pass 15)",
            "ASSIGNMENT (Out of 10, Pass 4)",
            "TOTAL",
            "Status",
          ];

          // 3. Overall passing threshold
          const passingThreshold = getCourseTotalPassingMarks(course.type);

          // Helper to get a raw score for a given student & component
          const getRawScore = (
            scoresArr: any[],
            studentId: string,
            component: string
          ): number => {
            const studentScore = scoresArr.find((s: any) => {
              const sId =
                typeof s.studentId === "string" ? s.studentId : s.studentId._id;
              return sId === studentId;
            });
            if (!studentScore || !studentScore.scores) return 0;
            const compScore = studentScore.scores.find(
              (c: any) => c.componentName === component
            );
            return compScore ? Number(compScore.obtainedMarks) : 0;
          };

          // 4. Build rows for each student
          const rows: (string | number)[][] = [];
          students.forEach((student, index) => {
            const row: (string | number)[] = [
              index + 1, // SNo.
              student.academicYear, // Academic_Year
              student.program, // Program
              student.registrationNumber, // Enrollment No.
              student.name, // Name
              student.semester, // Semester
            ];

            // Get raw scores
            const ca1Raw = getRawScore(rawScores, student._id, "CA1");
            const ca2Raw = getRawScore(rawScores, student._id, "CA2");
            const labRaw = getRawScore(rawScores, student._id, "LAB");
            const assignRaw = getRawScore(rawScores, student._id, "ASSIGNMENT");

            // Scale each using getComponentScale
            const ca1Scale = getComponentScale(course.type, "CA1"); // { maxMarks:30, passingMarks:12, conversionFactor:... }
            const ca2Scale = getComponentScale(course.type, "CA2");
            const labScale = getComponentScale(course.type, "LAB"); // { maxMarks:30, passingMarks:15, conversionFactor:... }
            const assignScale = getComponentScale(course.type, "ASSIGNMENT");

            const ca1Scaled = Math.round(
              ca1Raw * (ca1Scale.conversionFactor || 1)
            );
            const ca2Scaled = Math.round(
              ca2Raw * (ca2Scale.conversionFactor || 1)
            );
            const labScaled = Math.round(
              labRaw * (labScale.conversionFactor || 1)
            );
            const assignScaled = Math.round(
              assignRaw * (assignScale.conversionFactor || 1)
            );

            // Insert in the same order as headers
            row.push(ca1Scaled, ca2Scaled, labScaled, assignScaled);

            // Calculate total
            const totalScaled =
              ca1Scaled + ca2Scaled + labScaled + assignScaled;
            row.push(totalScaled);

            // 5. LAB < 50% => FAIL, else check total
            let status = "FAIL";
            if (labScaled < labScale.maxMarks * 0.5) {
              // fail if lab < 50%
              status = "FAIL";
            } else if (totalScaled >= passingThreshold) {
              status = "PASS";
            } else {
              status = "FAIL";
            }

            row.push(status);
            rows.push(row);
          });

          // 6. Build CSV
          const csvRows: string[] = [];
          csvRows.push(
            `Course Code: ${course.code}, Course Name: ${course.name}`
          );
          csvRows.push("");
          csvRows.push(headers.join(","));
          rows.forEach((r) => csvRows.push(r.join(",")));

          // Use Windows newlines for Excel
          const csvContent = csvRows.join("\r\n");

          // 7. Download
          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${course.code}_TOTAL_scores.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error("Error exporting TOTAL CSV:", err);
          setError("Failed to export TOTAL CSV");
        }
      })();
    }
  };

  // ======================================

  const renderComponent = () => {
    if (activeComponent === "TOTAL") {
      return (
        <TotalScoreComponent
          course={course}
          students={students}
          passingThreshold={getCourseTotalPassingMarks(course.type)}
        />
      );
    } else if (activeComponent.startsWith("CA")) {
      return (
        <CAScoreEntryComponent
          students={students}
          componentName={activeComponent}
          courseType={course.type}
          onScoresChange={(scores) =>
            handleCAScoreChange(activeComponent, scores)
          }
          initialScores={caScores[activeComponent]}
        />
      );
    } else if (activeComponent === "LAB") {
      return (
        <LabScoreEntryComponent
          students={students}
          componentName="LAB"
          courseType={course.type}
          onScoresChange={handleLabScoreChange}
          initialScores={labScores}
        />
      );
    } else if (activeComponent === "ASSIGNMENT") {
      return (
        <AssignmentScoreEntryComponent
          students={students}
          componentName="ASSIGNMENT"
          courseType={course.type}
          onScoresChange={handleAssignmentScoreChange}
          initialScores={assignmentScores}
        />
      );
    }
    return null;
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
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllScores}
                disabled={
                  saving || students.length === 0 || activeComponent === "TOTAL"
                }
                size="large"
              >
                {saving ? <CircularProgress size={24} /> : "SAVE ALL SCORES"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleExportCSV}
                disabled={students.length === 0}
                size="large"
              >
                EXPORT CSV
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
                  <Tab
                    value="TOTAL"
                    label="TOTAL"
                    icon={<Chip size="small" label="100%" color="success" />}
                    iconPosition="end"
                  />
                </Tabs>
              </Box>
              {activeComponent && renderComponent()}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DynamicScoreEntry;
