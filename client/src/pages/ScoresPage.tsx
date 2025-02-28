// // import React, { useState, useEffect } from "react";
// // import CAScoreEntryComponent from "../components/scores/CAScoreEntryComponent";
// // import {
// //   Typography,
// //   Box,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   TextField,
// //   Button,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Snackbar,
// //   Alert,
// //   CircularProgress,
// //   Tabs,
// //   Tab,
// //   Accordion,
// //   AccordionSummary,
// //   AccordionDetails,
// //   Chip,
// // } from "@mui/material";
// // import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
// // import { Course, Student } from "../types";
// // import { courseService } from "../services/courseService";
// // import { studentService } from "../services/studentService";
// // import { scoreService } from "../services/scoreService";

// // interface TabPanelProps {
// //   children?: React.ReactNode;
// //   index: number;
// //   value: number;
// // }

// // function TabPanel(props: TabPanelProps) {
// //   const { children, value, index, ...other } = props;

// //   return (
// //     <div
// //       role="tabpanel"
// //       hidden={value !== index}
// //       id={`score-tabpanel-${index}`}
// //       aria-labelledby={`score-tab-${index}`}
// //       {...other}
// //     >
// //       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
// //     </div>
// //   );
// // }

// // interface ScoreComponent {
// //   componentName: string;
// //   maxMarks: number;
// //   obtainedMarks: number;
// // }

// // interface StudentScore {
// //   studentId: string;
// //   academicYear: string;
// //   scores: ScoreComponent[];
// // }

// // // Interface for question-wise scores
// // interface QuestionScore {
// //   questionId: string;
// //   maxMarks: number;
// //   obtainedMarks: number;
// // }

// // // Interface for student question scores
// // interface StudentQuestionScores {
// //   [studentId: string]: {
// //     [component: string]: {
// //       [questionId: string]: number;
// //     };
// //   };
// // }

// // // Interface for lab session scores
// // interface StudentLabScores {
// //   [studentId: string]: {
// //     [sessionDate: string]: number;
// //   };
// // }

// // const ScoresPage: React.FC = () => {
// //   const [courses, setCourses] = useState<Course[]>([]);
// //   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [studentScores, setStudentScores] = useState<{
// //     [key: string]: ScoreComponent[];
// //   }>({});

// //   // State for component-specific scores
// //   const [ca1QuestionScores, setCa1QuestionScores] =
// //     useState<StudentQuestionScores>({});
// //   const [ca2QuestionScores, setCa2QuestionScores] =
// //     useState<StudentQuestionScores>({});
// //   const [ca3QuestionScores, setCa3QuestionScores] =
// //     useState<StudentQuestionScores>({});
// //   const [labSessionScores, setLabSessionScores] = useState<StudentLabScores>(
// //     {}
// //   );
// //   const [assignmentScores, setAssignmentScores] = useState<{
// //     [studentId: string]: number;
// //   }>({});

// //   const [loading, setLoading] = useState(false);
// //   const [saveLoading, setSaveLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState<string | null>(null);
// //   const [tabValue, setTabValue] = useState(0);

// //   // For CA1, CA2, etc.
// //   const [testDates, setTestDates] = useState<{ [key: string]: string }>({
// //     CA1: new Date().toISOString().split("T")[0],
// //     CA2: new Date().toISOString().split("T")[0],
// //     CA3: new Date().toISOString().split("T")[0],
// //   });

// //   // For LAB sessions
// //   const [labDates, setLabDates] = useState<string[]>([
// //     new Date().toISOString().split("T")[0],
// //   ]);

// //   // Fetch courses on component mount
// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       try {
// //         const data = await courseService.getAllCourses();
// //         setCourses(data);
// //       } catch (err) {
// //         setError("Failed to fetch courses");
// //         console.error(err);
// //       }
// //     };

// //     fetchCourses();
// //   }, []);

// //   // Fetch students and scores when course changes
// //   useEffect(() => {
// //     if (!selectedCourse) return;

// //     const fetchStudentsAndScores = async () => {
// //       setLoading(true);
// //       try {
// //         // Fetch students enrolled in the course
// //         const students = await studentService.getStudentsByCourse(
// //           selectedCourse._id
// //         );
// //         setStudents(students);

// //         // Initialize empty scores for each student
// //         const initialScores: { [key: string]: ScoreComponent[] } = {};
// //         const components = Object.keys(selectedCourse.evaluationScheme);

// //         // Initialize component-specific scores
// //         const initialCA1Scores: StudentQuestionScores = {};
// //         const initialCA2Scores: StudentQuestionScores = {};
// //         const initialCA3Scores: StudentQuestionScores = {};
// //         const initialLabScores: StudentLabScores = {};
// //         const initialAssignmentScores: { [studentId: string]: number } = {};

// //         students.forEach((student) => {
// //           // Initialize component scores
// //           initialScores[student._id] = components.map((component) => ({
// //             componentName: component,
// //             maxMarks: selectedCourse.evaluationScheme[component] * 100,
// //             obtainedMarks: 0,
// //           }));

// //           // Initialize CA1 question scores
// //           if (components.includes("CA1")) {
// //             initialCA1Scores[student._id] = {
// //               CA1: {
// //                 "1a": 0,
// //                 "1b": 0,
// //                 "1c": 0,
// //                 "1d": 0,
// //                 "2": 0,
// //                 "3": 0,
// //                 "4": 0,
// //                 "5": 0,
// //               },
// //             };
// //           }

// //           // Initialize CA2 question scores
// //           if (components.includes("CA2")) {
// //             initialCA2Scores[student._id] = {
// //               CA2: {
// //                 "1a": 0,
// //                 "1b": 0,
// //                 "1c": 0,
// //                 "1d": 0,
// //                 "2": 0,
// //                 "3": 0,
// //                 "4": 0,
// //                 "5": 0,
// //               },
// //             };
// //           }

// //           // Initialize CA3 question scores
// //           if (components.includes("CA3")) {
// //             initialCA3Scores[student._id] = {
// //               CA3: {
// //                 "1a": 0,
// //                 "1b": 0,
// //                 "1c": 0,
// //                 "1d": 0,
// //                 "2": 0,
// //                 "3": 0,
// //                 "4": 0,
// //                 "5": 0,
// //               },
// //             };
// //           }

// //           // Initialize Lab session scores
// //           if (components.includes("LAB")) {
// //             initialLabScores[student._id] = {};
// //             labDates.forEach((date) => {
// //               initialLabScores[student._id][date] = 0;
// //             });
// //           }

// //           // Initialize Assignment scores
// //           if (components.includes("ASSIGNMENT")) {
// //             initialAssignmentScores[student._id] = 0;
// //           }
// //         });

// //         // Try to fetch existing scores
// //         try {
// //           const scores = await scoreService.getScoresByCourse(
// //             selectedCourse._id
// //           );

// //           // Update the initialScores with existing data
// //           scores.forEach((score: any) => {
// //             if (
// //               score.studentId &&
// //               (typeof score.studentId === "string"
// //                 ? score.studentId
// //                 : score.studentId._id)
// //             ) {
// //               const studentId =
// //                 typeof score.studentId === "string"
// //                   ? score.studentId
// //                   : score.studentId._id;
// //               initialScores[studentId] = score.scores;

// //               // TODO: Update component-specific scores with existing data
// //               // This would require additional backend API to fetch detailed scores
// //             }
// //           });
// //         } catch (error) {
// //           console.log("No previous scores found");
// //         }

// //         setStudentScores(initialScores);
// //         setCa1QuestionScores(initialCA1Scores);
// //         setCa2QuestionScores(initialCA2Scores);
// //         setCa3QuestionScores(initialCA3Scores);
// //         setLabSessionScores(initialLabScores);
// //         setAssignmentScores(initialAssignmentScores);
// //       } catch (err) {
// //         setError("Failed to fetch students");
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchStudentsAndScores();
// //   }, [selectedCourse]);

// //   const handleCourseChange = (event: any) => {
// //     const courseId = event.target.value;
// //     const course = courses.find((c) => c._id === courseId) || null;
// //     setSelectedCourse(course);
// //     setTabValue(0);
// //   };

// //   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
// //     setTabValue(newValue);
// //   };

// //   // Update CA question score and recalculate total
// //   const handleCAQuestionScoreChange = (
// //     studentId: string,
// //     component: string,
// //     questionId: string,
// //     value: number
// //   ) => {
// //     // Update the question score state based on component
// //     if (component === "CA1") {
// //       setCa1QuestionScores((prev) => {
// //         const updated = { ...prev };
// //         if (!updated[studentId]) {
// //           updated[studentId] = { [component]: {} };
// //         }
// //         if (!updated[studentId][component]) {
// //           updated[studentId][component] = {};
// //         }
// //         updated[studentId][component][questionId] = value;
// //         return updated;
// //       });
// //     } else if (component === "CA2") {
// //       setCa2QuestionScores((prev) => {
// //         const updated = { ...prev };
// //         if (!updated[studentId]) {
// //           updated[studentId] = { [component]: {} };
// //         }
// //         if (!updated[studentId][component]) {
// //           updated[studentId][component] = {};
// //         }
// //         updated[studentId][component][questionId] = value;
// //         return updated;
// //       });
// //     } else if (component === "CA3") {
// //       setCa3QuestionScores((prev) => {
// //         const updated = { ...prev };
// //         if (!updated[studentId]) {
// //           updated[studentId] = { [component]: {} };
// //         }
// //         if (!updated[studentId][component]) {
// //           updated[studentId][component] = {};
// //         }
// //         updated[studentId][component][questionId] = value;
// //         return updated;
// //       });
// //     }

// //     // Recalculate and update the total component score
// //     updateComponentTotalScore(studentId, component);
// //   };

// //   // Update the component total score based on question scores
// //   const updateComponentTotalScore = (studentId: string, component: string) => {
// //     let questionScores;
// //     if (component === "CA1") {
// //       questionScores = ca1QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA2") {
// //       questionScores = ca2QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA3") {
// //       questionScores = ca3QuestionScores[studentId]?.[component] || {};
// //     } else {
// //       return; // Not a CA component
// //     }

// //     // Calculate total from all question scores
// //     const total = Object.values(questionScores).reduce(
// //       (sum, score) => sum + (score || 0),
// //       0
// //     );

// //     // Update the component score
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };
// //       const componentIndex = updated[studentId]?.findIndex(
// //         (s) => s.componentName === component
// //       );

// //       if (componentIndex !== -1) {
// //         updated[studentId][componentIndex].obtainedMarks = total;
// //       }

// //       return updated;
// //     });
// //   };

// //   // Handle lab session score change
// //   const handleLabSessionScoreChange = (
// //     studentId: string,
// //     sessionDate: string,
// //     value: number
// //   ) => {
// //     // Update lab session score
// //     setLabSessionScores((prev) => {
// //       const updated = { ...prev };
// //       if (!updated[studentId]) {
// //         updated[studentId] = {};
// //       }
// //       updated[studentId][sessionDate] = value;
// //       return updated;
// //     });

// //     // Recalculate and update LAB component total
// //     setTimeout(() => updateLabTotalScore(studentId), 0);
// //   };

// //   // Update LAB component total score
// //   const updateLabTotalScore = (studentId: string) => {
// //     const sessions = labSessionScores[studentId] || {};
// //     const total = Object.values(sessions).reduce(
// //       (sum, score) => sum + (score || 0),
// //       0
// //     );

// //     // Update the LAB component score
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };
// //       const componentIndex = updated[studentId]?.findIndex(
// //         (s) => s.componentName === "LAB"
// //       );

// //       if (componentIndex !== -1) {
// //         updated[studentId][componentIndex].obtainedMarks = total;
// //       }

// //       return updated;
// //     });
// //   };

// //   // Handle assignment score change
// //   const handleAssignmentScoreChange = (studentId: string, value: number) => {
// //     // Update assignment score
// //     setAssignmentScores((prev) => ({
// //       ...prev,
// //       [studentId]: value,
// //     }));

// //     // Update the ASSIGNMENT component score
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };
// //       const componentIndex = updated[studentId]?.findIndex(
// //         (s) => s.componentName === "ASSIGNMENT"
// //       );

// //       if (componentIndex !== -1) {
// //         updated[studentId][componentIndex].obtainedMarks = value;
// //       }

// //       return updated;
// //     });
// //   };

// //   const handleTestDateChange = (component: string, date: string) => {
// //     setTestDates((prev) => ({
// //       ...prev,
// //       [component]: date,
// //     }));
// //   };

// //   const handleAddLabDate = () => {
// //     const newDate = new Date().toISOString().split("T")[0];
// //     setLabDates((prev) => [...prev, newDate]);

// //     // Add the new date to all students' lab scores
// //     setLabSessionScores((prev) => {
// //       const updated = { ...prev };
// //       Object.keys(updated).forEach((studentId) => {
// //         updated[studentId][newDate] = 0;
// //       });
// //       return updated;
// //     });
// //   };

// //   const handleLabDateChange = (index: number, date: string) => {
// //     setLabDates((prev) => {
// //       const oldDate = prev[index];
// //       const newDates = [...prev];
// //       newDates[index] = date;

// //       // Update lab session scores with the new date
// //       setLabSessionScores((prevScores) => {
// //         const updated = { ...prevScores };
// //         Object.keys(updated).forEach((studentId) => {
// //           // Copy score from old date to new date
// //           updated[studentId][date] = updated[studentId][oldDate] || 0;
// //           // Remove old date
// //           delete updated[studentId][oldDate];
// //         });
// //         return updated;
// //       });

// //       return newDates;
// //     });
// //   };

// //   const handleSaveScores = async () => {
// //     if (!selectedCourse) return;

// //     setSaveLoading(true);
// //     try {
// //       // Format the scores for the API
// //       const formattedScores = Object.keys(studentScores).map((studentId) => ({
// //         studentId,
// //         academicYear:
// //           students.find((s) => s._id === studentId)?.academicYear || "",
// //         scores: studentScores[studentId],
// //       }));

// //       await scoreService.updateCourseScores(
// //         selectedCourse._id,
// //         formattedScores
// //       );

// //       setSuccess("Scores saved successfully");
// //     } catch (err: any) {
// //       console.error("Error saving scores:", err);
// //       setError(err.response?.data?.message || "Failed to save scores");
// //     } finally {
// //       setSaveLoading(false);
// //     }
// //   };

// //   const handleCloseSnackbar = () => {
// //     setError(null);
// //     setSuccess(null);
// //   };

// //   // Get active components based on course evaluation scheme
// //   const getActiveComponents = () => {
// //     if (!selectedCourse) return [];
// //     return Object.keys(selectedCourse.evaluationScheme);
// //   };

// //   // Get component data (max marks, passing marks)
// //   const getComponentData = (component: string) => {
// //     if (!selectedCourse) return null;

// //     const weight = selectedCourse.evaluationScheme[component];
// //     if (!weight) return null;

// //     const maxMarks = Math.round(weight * 100);
// //     const passMark = Math.round(maxMarks * (component === "LAB" ? 0.5 : 0.4)); // 50% for LAB, 40% for others

// //     return {
// //       maxMarks,
// //       passMark,
// //     };
// //   };

// //   // Convert number to words
// //   const numberToWords = (num: number) => {
// //     const units = [
// //       "",
// //       "One",
// //       "Two",
// //       "Three",
// //       "Four",
// //       "Five",
// //       "Six",
// //       "Seven",
// //       "Eight",
// //       "Nine",
// //       "Ten",
// //       "Eleven",
// //       "Twelve",
// //       "Thirteen",
// //       "Fourteen",
// //       "Fifteen",
// //       "Sixteen",
// //       "Seventeen",
// //       "Eighteen",
// //       "Nineteen",
// //     ];
// //     const tens = [
// //       "",
// //       "",
// //       "Twenty",
// //       "Thirty",
// //       "Forty",
// //       "Fifty",
// //       "Sixty",
// //       "Seventy",
// //       "Eighty",
// //       "Ninety",
// //     ];

// //     if (num === 0) return "Zero";

// //     if (num < 20) return units[num];

// //     const ten = Math.floor(num / 10);
// //     const unit = num % 10;

// //     if (unit === 0) return tens[ten];
// //     return `${tens[ten]} ${units[unit]}`;
// //   };

// //   // Calculate CA total for a student and component
// //   const calculateCATotal = (studentId: string, component: string) => {
// //     let questionScores;

// //     if (component === "CA1") {
// //       questionScores = ca1QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA2") {
// //       questionScores = ca2QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA3") {
// //       questionScores = ca3QuestionScores[studentId]?.[component] || {};
// //     } else {
// //       return 0;
// //     }

// //     return Object.values(questionScores).reduce(
// //       (sum, score) => sum + (score || 0),
// //       0
// //     );
// //   };

// //   // Calculate total score for a specific question group
// //   const calculateQuestionGroupTotal = (
// //     studentId: string,
// //     component: string,
// //     questionNumbers: string[]
// //   ) => {
// //     let questionScores;

// //     if (component === "CA1") {
// //       questionScores = ca1QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA2") {
// //       questionScores = ca2QuestionScores[studentId]?.[component] || {};
// //     } else if (component === "CA3") {
// //       questionScores = ca3QuestionScores[studentId]?.[component] || {};
// //     } else {
// //       return 0;
// //     }

// //     return questionNumbers.reduce(
// //       (sum, qNum) => sum + (questionScores[qNum] || 0),
// //       0
// //     );
// //   };

// //   // Get question score for a student
// //   const getQuestionScore = (
// //     studentId: string,
// //     component: string,
// //     questionId: string
// //   ) => {
// //     if (component === "CA1") {
// //       return ca1QuestionScores[studentId]?.[component]?.[questionId] || 0;
// //     } else if (component === "CA2") {
// //       return ca2QuestionScores[studentId]?.[component]?.[questionId] || 0;
// //     } else if (component === "CA3") {
// //       return ca3QuestionScores[studentId]?.[component]?.[questionId] || 0;
// //     }
// //     return 0;
// //   };

// //   // Render CA component (CA1, CA2, CA3)
// //   const renderCAComponent = (component: string) => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData(component);
// //     if (!componentData) return null;

// //     const maxMarks = componentData.maxMarks;
// //     const passingMarks = componentData.passMark;

// //     // Define max marks for each question
// //     const questionMaxMarks = {
// //       "1a": 4,
// //       "1b": 5,
// //       "1c": 4,
// //       "1d": 5,
// //       "2": 6,
// //       "3": 7,
// //       "4": 6,
// //       "5": 0, // Usually not used or a bonus question
// //     };

// //     return (
// //       <Box>
// //         <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
// //           <Typography variant="h6">{component}</Typography>
// //           <Box>
// //             <TextField
// //               label="Test Date"
// //               type="date"
// //               value={
// //                 testDates[component] || new Date().toISOString().split("T")[0]
// //               }
// //               onChange={(e) => handleTestDateChange(component, e.target.value)}
// //               InputLabelProps={{ shrink: true }}
// //               size="small"
// //             />
// //           </Box>
// //         </Box>

// //         <TableContainer component={Paper}>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>SNo.</TableCell>
// //                 <TableCell>Academic Year</TableCell>
// //                 <TableCell>Program</TableCell>
// //                 <TableCell>Enrollment No.</TableCell>
// //                 <TableCell>Name</TableCell>
// //                 <TableCell>Q.No.</TableCell>
// //                 <TableCell align="center">a</TableCell>
// //                 <TableCell align="center">b</TableCell>
// //                 <TableCell align="center">c</TableCell>
// //                 <TableCell align="center">d</TableCell>
// //                 <TableCell align="center">Total</TableCell>
// //                 <TableCell align="center">
// //                   {maxMarks} (pass {passingMarks})
// //                 </TableCell>
// //                 <TableCell>Marks in Words</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {students.map((student, index) => (
// //                 <React.Fragment key={student._id}>
// //                   {/* Row for Question I with sub-questions */}
// //                   <TableRow>
// //                     <TableCell rowSpan={5}>{index + 1}</TableCell>
// //                     <TableCell rowSpan={5}>{student.academicYear}</TableCell>
// //                     <TableCell rowSpan={5}>{student.program}</TableCell>
// //                     <TableCell rowSpan={5}>
// //                       {student.registrationNumber}
// //                     </TableCell>
// //                     <TableCell rowSpan={5}>{student.name}</TableCell>
// //                     <TableCell>I</TableCell>
// //                     <TableCell align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "1a")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "1a",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["1a"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "1b")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "1b",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["1b"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "1c")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "1c",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["1c"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "1d")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "1d",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["1d"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       {calculateQuestionGroupTotal(student._id, component, [
// //                         "1a",
// //                         "1b",
// //                         "1c",
// //                         "1d",
// //                       ])}
// //                     </TableCell>
// //                     <TableCell rowSpan={5} align="center">
// //                       {calculateCATotal(student._id, component)}
// //                     </TableCell>
// //                     <TableCell rowSpan={5}>
// //                       {numberToWords(calculateCATotal(student._id, component))}
// //                     </TableCell>
// //                   </TableRow>

// //                   {/* Row for Question II */}
// //                   <TableRow>
// //                     <TableCell>II</TableCell>
// //                     <TableCell colSpan={4} align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "2")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "2",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["2"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       {getQuestionScore(student._id, component, "2")}
// //                     </TableCell>
// //                   </TableRow>

// //                   {/* Row for Question III */}
// //                   <TableRow>
// //                     <TableCell>III</TableCell>
// //                     <TableCell colSpan={4} align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "3")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "3",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["3"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       {getQuestionScore(student._id, component, "3")}
// //                     </TableCell>
// //                   </TableRow>

// //                   {/* Row for Question IV */}
// //                   <TableRow>
// //                     <TableCell>IV</TableCell>
// //                     <TableCell colSpan={4} align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "4")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "4",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["4"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       {getQuestionScore(student._id, component, "4")}
// //                     </TableCell>
// //                   </TableRow>

// //                   {/* Row for Question V */}
// //                   <TableRow>
// //                     <TableCell>V</TableCell>
// //                     <TableCell colSpan={4} align="center">
// //                       <TextField
// //                         type="number"
// //                         value={getQuestionScore(student._id, component, "5")}
// //                         onChange={(e) =>
// //                           handleCAQuestionScoreChange(
// //                             student._id,
// //                             component,
// //                             "5",
// //                             Number(e.target.value)
// //                           )
// //                         }
// //                         InputProps={{
// //                           inputProps: {
// //                             min: 0,
// //                             max: questionMaxMarks["5"],
// //                             style: { textAlign: "center" },
// //                           },
// //                         }}
// //                         size="small"
// //                         sx={{ width: 40 }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="center">
// //                       {getQuestionScore(student._id, component, "5")}
// //                     </TableCell>
// //                   </TableRow>
// //                 </React.Fragment>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     );
// //   };

// //   // Render LAB component
// //   const renderLabComponent = () => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData("LAB");
// //     if (!componentData) return null;

// //     // Calculate max marks per session
// //     const marksPerSession = 10; // Default 10 marks per lab session

// //     return (
// //       <Box>
// //         <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
// //           <Typography variant="h6">Lab Sessions</Typography>
// //           <Button variant="outlined" size="small" onClick={handleAddLabDate}>
// //             Add Lab Session
// //           </Button>
// //         </Box>

// //         <TableContainer component={Paper}>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>SNo.</TableCell>
// //                 <TableCell>Academic Year</TableCell>
// //                 <TableCell>Program</TableCell>
// //                 <TableCell>Enrollment No.</TableCell>
// //                 <TableCell>Name</TableCell>
// //                 <TableCell>Semester</TableCell>
// //                 {labDates.map((date, index) => (
// //                   <TableCell key={index} align="center">
// //                     <TextField
// //                       type="date"
// //                       value={date}
// //                       onChange={(e) =>
// //                         handleLabDateChange(index, e.target.value)
// //                       }
// //                       size="small"
// //                       InputProps={{ sx: { fontSize: "0.875rem" } }}
// //                     />
// //                   </TableCell>
// //                 ))}
// //                 <TableCell align="center">
// //                   {componentData.maxMarks} (pass {componentData.passMark})
// //                 </TableCell>
// //                 <TableCell>Marks in Words</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {students.map((student, index) => {
// //                 // Calculate total lab score
// //                 const sessions = labSessionScores[student._id] || {};
// //                 const totalLabScore = Object.values(sessions).reduce(
// //                   (sum, score) => sum + (score || 0),
// //                   0
// //                 );

// //                 return (
// //                   <TableRow key={student._id}>
// //                     <TableCell>{index + 1}</TableCell>
// //                     <TableCell>{student.academicYear}</TableCell>
// //                     <TableCell>{student.program}</TableCell>
// //                     <TableCell>{student.registrationNumber}</TableCell>
// //                     <TableCell>{student.name}</TableCell>
// //                     <TableCell>{student.semester}</TableCell>
// //                     {labDates.map((date, dateIndex) => (
// //                       <TableCell key={dateIndex} align="center">
// //                         <TextField
// //                           type="number"
// //                           value={labSessionScores[student._id]?.[date] || 0}
// //                           onChange={(e) =>
// //                             handleLabSessionScoreChange(
// //                               student._id,
// //                               date,
// //                               Number(e.target.value)
// //                             )
// //                           }
// //                           InputProps={{
// //                             inputProps: {
// //                               min: 0,
// //                               max: marksPerSession,
// //                               style: { textAlign: "center" },
// //                             },
// //                           }}
// //                           size="small"
// //                           sx={{ width: 40 }}
// //                         />
// //                       </TableCell>
// //                     ))}
// //                     <TableCell align="center">{totalLabScore}</TableCell>
// //                     <TableCell>{numberToWords(totalLabScore)}</TableCell>
// //                   </TableRow>
// //                 );
// //               })}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     );
// //   };

// //   // Render ASSIGNMENT component
// //   const renderAssignmentComponent = () => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData("ASSIGNMENT");
// //     if (!componentData) return null;

// //     return (
// //       <Box>
// //         <Box sx={{ mb: 2 }}>
// //           <Typography variant="h6">Internals/Assignment</Typography>
// //         </Box>

// //         <TableContainer component={Paper}>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>SNo.</TableCell>
// //                 <TableCell>Academic Year</TableCell>
// //                 <TableCell>Program</TableCell>
// //                 <TableCell>Enrollment No.</TableCell>
// //                 <TableCell>Name</TableCell>
// //                 <TableCell>Semester</TableCell>
// //                 <TableCell align="center">
// //                   {componentData.maxMarks} (pass {componentData.passMark})
// //                 </TableCell>
// //                 <TableCell>Marks in Words</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {students.map((student, index) => (
// //                 <TableRow key={student._id}>
// //                   <TableCell>{index + 1}</TableCell>
// //                   <TableCell>{student.academicYear}</TableCell>
// //                   <TableCell>{student.program}</TableCell>
// //                   <TableCell>{student.registrationNumber}</TableCell>
// //                   <TableCell>{student.name}</TableCell>
// //                   <TableCell>{student.semester}</TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       value={assignmentScores[student._id] || 0}
// //                       onChange={(e) =>
// //                         handleAssignmentScoreChange(
// //                           student._id,
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       InputProps={{
// //                         inputProps: {
// //                           min: 0,
// //                           max: componentData.maxMarks,
// //                           style: { textAlign: "center" },
// //                         },
// //                       }}
// //                       size="small"
// //                       sx={{ width: 60 }}
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     {numberToWords(assignmentScores[student._id] || 0)}
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     );
// //   };

// //   return (
// //     <Box>
// //       <Typography variant="h4" gutterBottom>
// //         Score Entry
// //       </Typography>

// //       <Box mb={3}>
// //         <FormControl fullWidth>
// //           <InputLabel id="course-select-label">Select Course</InputLabel>
// //           <Select
// //             labelId="course-select-label"
// //             value={selectedCourse?._id || ""}
// //             onChange={handleCourseChange}
// //             label="Select Course"
// //           >
// //             {courses.map((course) => (
// //               <MenuItem key={course._id} value={course._id}>
// //                 {course.code} - {course.name}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       </Box>

// //       {selectedCourse && (
// //         <>
// //           <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
// //             <Typography variant="h6">
// //               {selectedCourse.code} - {selectedCourse.name}
// //             </Typography>
// //             <Box sx={{ display: "flex", gap: 4, mt: 1 }}>
// //               <Typography>Type: {selectedCourse.type}</Typography>
// //               <Typography>Slot: {selectedCourse.slot}</Typography>
// //               <Typography>Venue: {selectedCourse.venue}</Typography>
// //             </Box>
// //           </Box>

// //           <Box mb={2}>
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={handleSaveScores}
// //               disabled={saveLoading}
// //               sx={{ mr: 2 }}
// //             >
// //               {saveLoading ? <CircularProgress size={24} /> : "Save All Scores"}
// //             </Button>
// //           </Box>

// //           <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
// //             <Tabs
// //               value={tabValue}
// //               onChange={handleTabChange}
// //               variant="scrollable"
// //               scrollButtons="auto"
// //             >
// //               {getActiveComponents().map((component, index) => (
// //                 <Tab key={component} label={component} value={index} />
// //               ))}
// //             </Tabs>
// //           </Box>

// //           {loading ? (
// //             <CircularProgress />
// //           ) : (
// //             <>
// //               {getActiveComponents().map((component, index) => (
// //                 <TabPanel key={component} value={tabValue} index={index}>
// //                   {component === "CA1" ||
// //                   component === "CA2" ||
// //                   component === "CA3"
// //                     ? renderCAComponent(component)
// //                     : component === "LAB"
// //                     ? renderLabComponent()
// //                     : component === "ASSIGNMENT"
// //                     ? renderAssignmentComponent()
// //                     : null}
// //                 </TabPanel>
// //               ))}
// //             </>
// //           )}
// //         </>
// //       )}

// //       <Snackbar
// //         open={!!error || !!success}
// //         autoHideDuration={6000}
// //         onClose={handleCloseSnackbar}
// //       >
// //         <Alert
// //           onClose={handleCloseSnackbar}
// //           severity={error ? "error" : "success"}
// //           sx={{ width: "100%" }}
// //         >
// //           {error || success}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default ScoresPage;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Typography,
// //   Box,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   TextField,
// //   Button,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Snackbar,
// //   Alert,
// //   CircularProgress,
// //   Tabs,
// //   Tab,
// //   Accordion,
// //   AccordionSummary,
// //   AccordionDetails,
// //   Chip,
// // } from "@mui/material";
// // import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
// // import { Course, Student } from "../types";
// // import { courseService } from "../services/courseService";
// // import { studentService } from "../services/studentService";
// // import { scoreService } from "../services/scoreService";
// // import CAScoreEntryComponent from "../components/scores/CAScoreEntryComponent";

// // interface TabPanelProps {
// //   children?: React.ReactNode;
// //   index: number;
// //   value: number;
// // }

// // function TabPanel(props: TabPanelProps) {
// //   const { children, value, index, ...other } = props;

// //   return (
// //     <div
// //       role="tabpanel"
// //       hidden={value !== index}
// //       id={`score-tabpanel-${index}`}
// //       aria-labelledby={`score-tab-${index}`}
// //       {...other}
// //     >
// //       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
// //     </div>
// //   );
// // }

// // interface ScoreComponent {
// //   componentName: string;
// //   maxMarks: number;
// //   obtainedMarks: number;
// // }

// // interface StudentScore {
// //   studentId: string;
// //   academicYear: string;
// //   scores: ScoreComponent[];
// // }

// // // Interface for the new detailed score structure
// // interface DetailedScore {
// //   [studentId: string]: {
// //     I: { a: number; b: number; c: number; d: number; total: number };
// //     II: { a: number; b: number; c: number; d: number; total: number };
// //     III: { a: number; b: number; c: number; d: number; total: number };
// //     IV: { a: number; b: number; c: number; d: number; total: number };
// //     V: { a: number; b: number; c: number; d: number; total: number };
// //     outOf50: number;
// //     outOf20: number;
// //   };
// // }

// // // Interface for tracking all types of scores
// // interface AllScoresState {
// //   CA1?: DetailedScore;
// //   CA2?: DetailedScore;
// //   CA3?: DetailedScore;
// //   LAB?: {
// //     [studentId: string]: {
// //       [sessionDate: string]: number;
// //     };
// //   };
// //   ASSIGNMENT?: {
// //     [studentId: string]: number;
// //   };
// // }

// // const ScoresPage: React.FC = () => {
// //   const [courses, setCourses] = useState<Course[]>([]);
// //   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [studentScores, setStudentScores] = useState<AllScoresState>({});

// //   const [loading, setLoading] = useState(false);
// //   const [saveLoading, setSaveLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState<string | null>(null);
// //   const [tabValue, setTabValue] = useState(0);

// //   // For CA1, CA2, etc.
// //   const [testDates, setTestDates] = useState<{ [key: string]: string }>({
// //     CA1: new Date().toISOString().split("T")[0],
// //     CA2: new Date().toISOString().split("T")[0],
// //     CA3: new Date().toISOString().split("T")[0],
// //   });

// //   // For LAB sessions
// //   const [labDates, setLabDates] = useState<string[]>([
// //     new Date().toISOString().split("T")[0],
// //   ]);

// //   // Fetch courses on component mount
// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       try {
// //         const data = await courseService.getAllCourses();
// //         setCourses(data);
// //       } catch (err) {
// //         setError("Failed to fetch courses");
// //         console.error(err);
// //       }
// //     };

// //     fetchCourses();
// //   }, []);

// //   // Fetch students and scores when course changes
// //   useEffect(() => {
// //     if (!selectedCourse) return;

// //     const fetchStudentsAndScores = async () => {
// //       setLoading(true);
// //       try {
// //         // Fetch students enrolled in the course
// //         const students = await studentService.getStudentsByCourse(
// //           selectedCourse._id
// //         );
// //         setStudents(students);

// //         // Initialize empty scores storage
// //         const initialScores: AllScoresState = {};

// //         // Try to fetch existing scores
// //         try {
// //           const scores = await scoreService.getScoresByCourse(
// //             selectedCourse._id
// //           );

// //           // Process existing scores if any
// //           // This would need to be adapted based on your actual score data structure
// //           scores.forEach((score: any) => {
// //             const studentId =
// //               typeof score.studentId === "string"
// //                 ? score.studentId
// //                 : score.studentId._id;

// //             // Process the scores based on component type
// //             score.scores.forEach((component: any) => {
// //               if (
// //                 component.componentName === "CA1" ||
// //                 component.componentName === "CA2" ||
// //                 component.componentName === "CA3"
// //               ) {
// //                 // Initialize the detailed score structure if needed
// //                 if (!initialScores[component.componentName]) {
// //                   initialScores[component.componentName] = {};
// //                 }

// //                 // Convert flat score structure to detailed structure
// //                 // This is a simplified conversion - you'd need to adapt based on your data
// //                 const outOf20 = component.obtainedMarks;
// //                 const outOf50 = (outOf20 * 50) / 20;

// //                 initialScores[component.componentName][studentId] = {
// //                   I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                   II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                   III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                   IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                   V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                   outOf50,
// //                   outOf20,
// //                 };
// //               }

// //               // Process LAB scores
// //               if (component.componentName === "LAB") {
// //                 if (!initialScores.LAB) {
// //                   initialScores.LAB = {};
// //                 }

// //                 if (!initialScores.LAB[studentId]) {
// //                   initialScores.LAB[studentId] = {};
// //                 }

// //                 // Assuming LAB scores are stored per session date
// //                 labDates.forEach((date) => {
// //                   initialScores.LAB[studentId][date] = 0;
// //                 });
// //               }

// //               // Process ASSIGNMENT scores
// //               if (component.componentName === "ASSIGNMENT") {
// //                 if (!initialScores.ASSIGNMENT) {
// //                   initialScores.ASSIGNMENT = {};
// //                 }

// //                 initialScores.ASSIGNMENT[studentId] = component.obtainedMarks;
// //               }
// //             });
// //           });
// //         } catch (error) {
// //           console.log("No previous scores found");
// //         }

// //         setStudentScores(initialScores);
// //       } catch (err) {
// //         setError("Failed to fetch students");
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchStudentsAndScores();
// //   }, [selectedCourse]);

// //   const handleCourseChange = (event: any) => {
// //     const courseId = event.target.value;
// //     const course = courses.find((c) => c._id === courseId) || null;
// //     setSelectedCourse(course);
// //     setTabValue(0);
// //   };

// //   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
// //     setTabValue(newValue);
// //   };

// //   // Update LAB component total score
// //   const updateLabTotalScore = (studentId: string) => {
// //     if (!studentScores.LAB || !studentScores.LAB[studentId]) return 0;

// //     const sessions = studentScores.LAB[studentId];
// //     return Object.values(sessions).reduce(
// //       (sum, score) => sum + (score || 0),
// //       0
// //     );
// //   };

// //   // Handle lab session score change
// //   const handleLabSessionScoreChange = (
// //     studentId: string,
// //     sessionDate: string,
// //     value: number
// //   ) => {
// //     // Update lab session score
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };

// //       if (!updated.LAB) {
// //         updated.LAB = {};
// //       }

// //       if (!updated.LAB[studentId]) {
// //         updated.LAB[studentId] = {};
// //       }

// //       updated.LAB[studentId][sessionDate] = value;
// //       return updated;
// //     });
// //   };

// //   // Handle assignment score change
// //   const handleAssignmentScoreChange = (studentId: string, value: number) => {
// //     // Update assignment score
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };

// //       if (!updated.ASSIGNMENT) {
// //         updated.ASSIGNMENT = {};
// //       }

// //       updated.ASSIGNMENT[studentId] = value;
// //       return updated;
// //     });
// //   };

// //   const handleTestDateChange = (component: string, date: string) => {
// //     setTestDates((prev) => ({
// //       ...prev,
// //       [component]: date,
// //     }));
// //   };

// //   const handleAddLabDate = () => {
// //     const newDate = new Date().toISOString().split("T")[0];
// //     setLabDates((prev) => [...prev, newDate]);

// //     // Add the new date to all students' lab scores
// //     setStudentScores((prev) => {
// //       const updated = { ...prev };

// //       if (!updated.LAB) {
// //         updated.LAB = {};
// //       }

// //       Object.keys(updated.LAB).forEach((studentId) => {
// //         updated.LAB[studentId][newDate] = 0;
// //       });

// //       return updated;
// //     });
// //   };

// //   const handleLabDateChange = (index: number, date: string) => {
// //     setLabDates((prev) => {
// //       const oldDate = prev[index];
// //       const newDates = [...prev];
// //       newDates[index] = date;

// //       // Update lab session scores with the new date
// //       setStudentScores((prev) => {
// //         const updated = { ...prev };

// //         if (!updated.LAB) return updated;

// //         Object.keys(updated.LAB).forEach((studentId) => {
// //           // Copy score from old date to new date
// //           updated.LAB[studentId][date] = updated.LAB[studentId][oldDate] || 0;
// //           // Remove old date
// //           delete updated.LAB[studentId][oldDate];
// //         });

// //         return updated;
// //       });

// //       return newDates;
// //     });
// //   };

// //   // Convert detailed scores to API format
// //   const prepareScoresForApi = () => {
// //     if (!selectedCourse) return [];

// //     const apiScores: StudentScore[] = [];

// //     // Process each student
// //     students.forEach((student) => {
// //       const studentApiScores: ScoreComponent[] = [];

// //       // Process CA1, CA2, CA3 components
// //       ["CA1", "CA2", "CA3"].forEach((component) => {
// //         if (studentScores[component] && studentScores[component][student.id]) {
// //           const componentData = getComponentData(component);
// //           if (!componentData) return;

// //           studentApiScores.push({
// //             componentName: component,
// //             maxMarks: componentData.maxMarks,
// //             obtainedMarks: studentScores[component][student.id].outOf20,
// //           });
// //         }
// //       });

// //       // Process LAB component
// //       if (studentScores.LAB && studentScores.LAB[student.id]) {
// //         const componentData = getComponentData("LAB");
// //         if (componentData) {
// //           const totalLabScore = updateLabTotalScore(student.id);
// //           studentApiScores.push({
// //             componentName: "LAB",
// //             maxMarks: componentData.maxMarks,
// //             obtainedMarks: totalLabScore,
// //           });
// //         }
// //       }

// //       // Process ASSIGNMENT component
// //       if (
// //         studentScores.ASSIGNMENT &&
// //         studentScores.ASSIGNMENT[student.id] !== undefined
// //       ) {
// //         const componentData = getComponentData("ASSIGNMENT");
// //         if (componentData) {
// //           studentApiScores.push({
// //             componentName: "ASSIGNMENT",
// //             maxMarks: componentData.maxMarks,
// //             obtainedMarks: studentScores.ASSIGNMENT[student.id],
// //           });
// //         }
// //       }

// //       // Only add students with scores
// //       if (studentApiScores.length > 0) {
// //         apiScores.push({
// //           studentId: student.id,
// //           academicYear: student.academicYear,
// //           scores: studentApiScores,
// //         });
// //       }
// //     });

// //     return apiScores;
// //   };

// //   const handleSaveScores = async () => {
// //     if (!selectedCourse) return;

// //     setSaveLoading(true);
// //     try {
// //       // Prepare scores in the format expected by the API
// //       const apiScores = prepareScoresForApi();

// //       // Send to server
// //       await scoreService.updateCourseScores(selectedCourse._id, apiScores);

// //       setSuccess("Scores saved successfully");
// //     } catch (err: any) {
// //       console.error("Error saving scores:", err);
// //       setError(err.response?.data?.message || "Failed to save scores");
// //     } finally {
// //       setSaveLoading(false);
// //     }
// //   };

// //   const handleCloseSnackbar = () => {
// //     setError(null);
// //     setSuccess(null);
// //   };

// //   // Get active components based on course evaluation scheme
// //   const getActiveComponents = () => {
// //     if (!selectedCourse) return [];
// //     return Object.keys(selectedCourse.evaluationScheme);
// //   };

// //   // Get component data (max marks, passing marks)
// //   const getComponentData = (component: string) => {
// //     if (!selectedCourse) return null;

// //     const weight = selectedCourse.evaluationScheme[component];
// //     if (!weight) return null;

// //     const maxMarks = Math.round(weight * 100);
// //     const passMark = Math.round(maxMarks * (component === "LAB" ? 0.5 : 0.4)); // 50% for LAB, 40% for others

// //     return {
// //       maxMarks,
// //       passMark,
// //     };
// //   };

// //   // Render CA component (CA1, CA2, CA3)
// //   const renderCAComponent = (component: string) => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData(component);
// //     if (!componentData) return null;

// //     return (
// //       <Box>
// //         <CAScoreEntryComponent
// //           students={students}
// //           componentName={component}
// //           onScoresChange={(scores) => {
// //             // Update the scores in the state
// //             setStudentScores((prev) => ({
// //               ...prev,
// //               [component]: scores,
// //             }));
// //           }}
// //           initialScores={studentScores[component]}
// //         />
// //       </Box>
// //     );
// //   };

// //   // Render LAB component
// //   const renderLabComponent = () => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData("LAB");
// //     if (!componentData) return null;

// //     // Calculate max marks per session
// //     const marksPerSession = 10; // Default 10 marks per lab session

// //     return (
// //       <Box>
// //         <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
// //           <Typography variant="h6">Lab Sessions</Typography>
// //           <Button variant="outlined" size="small" onClick={handleAddLabDate}>
// //             Add Lab Session
// //           </Button>
// //         </Box>

// //         <TableContainer component={Paper}>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>SNo.</TableCell>
// //                 <TableCell>Academic Year</TableCell>
// //                 <TableCell>Program</TableCell>
// //                 <TableCell>Enrollment No.</TableCell>
// //                 <TableCell>Name</TableCell>
// //                 <TableCell>Semester</TableCell>
// //                 {labDates.map((date, index) => (
// //                   <TableCell key={index} align="center">
// //                     <TextField
// //                       type="date"
// //                       value={date}
// //                       onChange={(e) =>
// //                         handleLabDateChange(index, e.target.value)
// //                       }
// //                       size="small"
// //                       InputProps={{ sx: { fontSize: "0.875rem" } }}
// //                     />
// //                   </TableCell>
// //                 ))}
// //                 <TableCell align="center">
// //                   {componentData.maxMarks} (pass {componentData.passMark})
// //                 </TableCell>
// //                 <TableCell>Marks in Words</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {students.map((student, index) => {
// //                 // Calculate total lab score
// //                 const totalLabScore =
// //                   studentScores.LAB && studentScores.LAB[student.id]
// //                     ? updateLabTotalScore(student.id)
// //                     : 0;

// //                 return (
// //                   <TableRow key={student.id}>
// //                     <TableCell>{index + 1}</TableCell>
// //                     <TableCell>{student.academicYear}</TableCell>
// //                     <TableCell>{student.program}</TableCell>
// //                     <TableCell>{student.registrationNumber}</TableCell>
// //                     <TableCell>{student.name}</TableCell>
// //                     <TableCell>{student.semester}</TableCell>
// //                     {labDates.map((date, dateIndex) => (
// //                       <TableCell key={dateIndex} align="center">
// //                         <TextField
// //                           type="number"
// //                           value={
// //                             studentScores.LAB &&
// //                             studentScores.LAB[student.id] &&
// //                             studentScores.LAB[student.id][date] !== undefined
// //                               ? studentScores.LAB[student.id][date]
// //                               : 0
// //                           }
// //                           onChange={(e) =>
// //                             handleLabSessionScoreChange(
// //                               student.id,
// //                               date,
// //                               Number(e.target.value)
// //                             )
// //                           }
// //                           InputProps={{
// //                             inputProps: {
// //                               min: 0,
// //                               max: marksPerSession,
// //                               style: { textAlign: "center" },
// //                             },
// //                           }}
// //                           size="small"
// //                           sx={{ width: 40 }}
// //                         />
// //                       </TableCell>
// //                     ))}
// //                     <TableCell align="center">{totalLabScore}</TableCell>
// //                     <TableCell>{numberToWords(totalLabScore)}</TableCell>
// //                   </TableRow>
// //                 );
// //               })}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     );
// //   };

// //   // Render ASSIGNMENT component
// //   const renderAssignmentComponent = () => {
// //     if (!selectedCourse) return null;

// //     const componentData = getComponentData("ASSIGNMENT");
// //     if (!componentData) return null;

// //     return (
// //       <Box>
// //         <Box sx={{ mb: 2 }}>
// //           <Typography variant="h6">Internals/Assignment</Typography>
// //         </Box>

// //         <TableContainer component={Paper}>
// //           <Table size="small">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>SNo.</TableCell>
// //                 <TableCell>Academic Year</TableCell>
// //                 <TableCell>Program</TableCell>
// //                 <TableCell>Enrollment No.</TableCell>
// //                 <TableCell>Name</TableCell>
// //                 <TableCell>Semester</TableCell>
// //                 <TableCell align="center">
// //                   {componentData.maxMarks} (pass {componentData.passMark})
// //                 </TableCell>
// //                 <TableCell>Marks in Words</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {students.map((student, index) => (
// //                 <TableRow key={student.id}>
// //                   <TableCell>{index + 1}</TableCell>
// //                   <TableCell>{student.academicYear}</TableCell>
// //                   <TableCell>{student.program}</TableCell>
// //                   <TableCell>{student.registrationNumber}</TableCell>
// //                   <TableCell>{student.name}</TableCell>
// //                   <TableCell>{student.semester}</TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       value={
// //                         studentScores.ASSIGNMENT &&
// //                         studentScores.ASSIGNMENT[student.id] !== undefined
// //                           ? studentScores.ASSIGNMENT[student.id]
// //                           : 0
// //                       }
// //                       onChange={(e) =>
// //                         handleAssignmentScoreChange(
// //                           student.id,
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       InputProps={{
// //                         inputProps: {
// //                           min: 0,
// //                           max: componentData.maxMarks,
// //                           style: { textAlign: "center" },
// //                         },
// //                       }}
// //                       size="small"
// //                       sx={{ width: 60 }}
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     {numberToWords(
// //                       studentScores.ASSIGNMENT &&
// //                         studentScores.ASSIGNMENT[student.id] !== undefined
// //                         ? studentScores.ASSIGNMENT[student.id]
// //                         : 0
// //                     )}
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Box>
// //     );
// //   };

// //   // Function to convert number to words
// //   const numberToWords = (num: number): string => {
// //     const units = [
// //       "",
// //       "One",
// //       "Two",
// //       "Three",
// //       "Four",
// //       "Five",
// //       "Six",
// //       "Seven",
// //       "Eight",
// //       "Nine",
// //       "Ten",
// //       "Eleven",
// //       "Twelve",
// //       "Thirteen",
// //       "Fourteen",
// //       "Fifteen",
// //       "Sixteen",
// //       "Seventeen",
// //       "Eighteen",
// //       "Nineteen",
// //     ];
// //     const tens = [
// //       "",
// //       "",
// //       "Twenty",
// //       "Thirty",
// //       "Forty",
// //       "Fifty",
// //       "Sixty",
// //       "Seventy",
// //       "Eighty",
// //       "Ninety",
// //     ];

// //     if (num === 0) return "Zero";

// //     if (num < 20) return units[num];

// //     const ten = Math.floor(num / 10);
// //     const unit = num % 10;

// //     if (unit === 0) return tens[ten];
// //     return `${tens[ten]} ${units[unit]}`;
// //   };

// //   return (
// //     <Box>
// //       <Typography variant="h4" gutterBottom>
// //         Score Entry
// //       </Typography>

// //       <Box mb={3}>
// //         <FormControl fullWidth>
// //           <InputLabel id="course-select-label">Select Course</InputLabel>
// //           <Select
// //             labelId="course-select-label"
// //             value={selectedCourse?._id || ""}
// //             onChange={handleCourseChange}
// //             label="Select Course"
// //           >
// //             {courses.map((course) => (
// //               <MenuItem key={course._id} value={course._id}>
// //                 {course.code} - {course.name}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //         </FormControl>
// //       </Box>

// //       {selectedCourse && (
// //         <>
// //           <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
// //             <Typography variant="h6">
// //               {selectedCourse.code} - {selectedCourse.name}
// //             </Typography>
// //             <Box sx={{ display: "flex", gap: 4, mt: 1 }}>
// //               <Typography>Type: {selectedCourse.type}</Typography>
// //               <Typography>Slot: {selectedCourse.slot}</Typography>
// //               <Typography>Venue: {selectedCourse.venue}</Typography>
// //             </Box>
// //           </Box>

// //           <Box mb={2}>
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={handleSaveScores}
// //               disabled={saveLoading}
// //               sx={{ mr: 2 }}
// //             >
// //               {saveLoading ? <CircularProgress size={24} /> : "Save All Scores"}
// //             </Button>
// //           </Box>

// //           <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
// //             <Tabs
// //               value={tabValue}
// //               onChange={handleTabChange}
// //               variant="scrollable"
// //               scrollButtons="auto"
// //             >
// //               {getActiveComponents().map((component, index) => (
// //                 <Tab key={component} label={component} value={index} />
// //               ))}
// //             </Tabs>
// //           </Box>

// //           {loading ? (
// //             <CircularProgress />
// //           ) : (
// //             <>
// //               {getActiveComponents().map((component, index) => (
// //                 <TabPanel key={component} value={tabValue} index={index}>
// //                   {component === "CA1" ||
// //                   component === "CA2" ||
// //                   component === "CA3"
// //                     ? renderCAComponent(component)
// //                     : component === "LAB"
// //                     ? renderLabComponent()
// //                     : component === "ASSIGNMENT"
// //                     ? renderAssignmentComponent()
// //                     : null}
// //                 </TabPanel>
// //               ))}
// //             </>
// //           )}
// //         </>
// //       )}

// //       <Snackbar
// //         open={!!error || !!success}
// //         autoHideDuration={6000}
// //         onClose={handleCloseSnackbar}
// //       >
// //         <Alert
// //           onClose={handleCloseSnackbar}
// //           severity={error ? "error" : "success"}
// //           sx={{ width: "100%" }}
// //         >
// //           {error || success}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default ScoresPage;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Typography,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Grid,
// } from "@mui/material";
// import { Course, Student } from "../types";
// import { courseService } from "../services/courseService";
// import { studentService } from "../services/studentService";
// import DynamicScoreEntry from "../components/scores/DynamicScoreEntry";

// const ScoresPage: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const location = useLocation();

//   // Fetch all courses on component mount
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const data = await courseService.getAllCourses();
//         setCourses(data);

//         // Check for courseId in URL query params
//         const searchParams = new URLSearchParams(location.search);
//         const courseId = searchParams.get("courseId");

//         if (courseId) {
//           const course = data.find((c) => c._id === courseId);
//           if (course) {
//             setSelectedCourse(course);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch courses:", err);
//         setError("Failed to fetch courses. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [location]);

//   // Fetch students when course changes
//   useEffect(() => {
//     if (!selectedCourse) {
//       setStudents([]);
//       return;
//     }

//     const fetchStudents = async () => {
//       try {
//         setLoading(true);
//         const students = await studentService.getStudentsByCourse(
//           selectedCourse._id
//         );
//         setStudents(students);
//       } catch (err) {
//         console.error("Failed to fetch students:", err);
//         setError("Failed to fetch students for this course.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [selectedCourse]);

//   const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     const courseId = event.target.value as string;
//     const course = courses.find((c) => c._id === courseId) || null;
//     setSelectedCourse(course);
//   };

//   const handleCloseSnackbar = () => {
//     setError(null);
//   };

//   return (
//     <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Score Entry
//       </Typography>

//       <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
//         <FormControl fullWidth>
//           <InputLabel id="course-select-label">Select Course</InputLabel>
//           <Select
//             labelId="course-select-label"
//             id="course-select"
//             value={selectedCourse?._id || ""}
//             onChange={handleCourseChange}
//             label="Select Course"
//           >
//             <MenuItem value="">
//               <em>Select a course</em>
//             </MenuItem>
//             {courses.map((course) => (
//               <MenuItem key={course._id} value={course._id}>
//                 {course.code} - {course.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Paper>

//       {loading && !selectedCourse ? (
//         <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : !selectedCourse ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1">
//             Please select a course to manage scores
//           </Typography>
//         </Paper>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <DynamicScoreEntry
//                 course={selectedCourse}
//                 students={students}
//                 onSaveComplete={() => {
//                   // You can add any refresh logic here if needed
//                 }}
//               />
//             )}
//           </Grid>
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="error">
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ScoresPage;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Course, Student } from "../types";
import { courseService } from "../services/courseService";
import { studentService } from "../services/studentService";
import DynamicScoreEntry from "../components/scores/DynamicScoreEntry";

const ScoresPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);

        // Check for courseId in URL query params
        const searchParams = new URLSearchParams(location.search);
        const courseId = searchParams.get("courseId");

        if (courseId) {
          const course = data.find((c) => c._id === courseId);
          if (course) {
            setSelectedCourse(course);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [location]);

  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentData = await studentService.getStudentsByCourse(
          selectedCourse._id
        );
        setStudents(studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to fetch students for this course.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourse]);

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const courseId = event.target.value as string;
    const course = courses.find((c) => c._id === courseId) || null;
    setSelectedCourse(course);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Score Entry
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="course-select-label">Select Course</InputLabel>
          <Select
            labelId="course-select-label"
            id="course-select"
            value={selectedCourse?._id || ""}
            onChange={handleCourseChange}
            label="Select Course"
          >
            <MenuItem value="">
              <em>Select a course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.code} - {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading && !selectedCourse ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : !selectedCourse ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1">
            Please select a course to manage scores
          </Typography>
        </Paper>
      ) : (
        <DynamicScoreEntry
          course={selectedCourse}
          students={students}
          onSaveComplete={() => {
            // You can add any refresh logic here if needed
          }}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScoresPage;
