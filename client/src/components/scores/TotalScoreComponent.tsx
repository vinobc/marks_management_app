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
//   Typography,
//   Chip,
//   Button,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Download as DownloadIcon,
//   Print as PrintIcon,
// } from "@mui/icons-material";
// import { Course, Student } from "../../types";
// import { scoreService } from "../../services/scoreService";
// import { EVALUATION_SCHEMES } from "../../utils/evaluationSchemes";

// interface TotalScoreComponentProps {
//   course: Course;
//   students: Student[];
// }

// interface StudentScore {
//   studentId: string;
//   scores: {
//     componentName: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
//   totalMarks: number;
// }

// const TotalScoreComponent: React.FC<TotalScoreComponentProps> = ({
//   course,
//   students,
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [studentScores, setStudentScores] = useState<StudentScore[]>([]);

//   useEffect(() => {
//     fetchScores();
//   }, [course, students]);

//   const fetchScores = async () => {
//     if (!course || students.length === 0) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const scores = await scoreService.getScoresByCourse(course._id);
//       setStudentScores(scores);
//     } catch (error) {
//       console.error("Error fetching scores:", error);
//       setError("Failed to load scores. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPassingMarks = (componentName: string) => {
//     const evaluationScheme = EVALUATION_SCHEMES[course.type];
//     if (!evaluationScheme) return 0;

//     const weight = course.evaluationScheme[componentName];
//     if (!weight) return 0;

//     const totalMarks = evaluationScheme.totalScore[componentName] || 0;
//     const passingPercentage =
//       evaluationScheme.passingCriteria[componentName] || 0.4;

//     return Math.round(totalMarks * passingPercentage);
//   };

//   const formatMark = (value: number) => {
//     return value.toFixed(1);
//   };

//   const getScoreForStudent = (studentId: string, componentName: string) => {
//     const studentScore = studentScores.find((score) =>
//       typeof score.studentId === "string"
//         ? score.studentId === studentId
//         : score.studentId._id === studentId
//     );

//     if (!studentScore) return { obtainedMarks: 0, isPassing: false };

//     const componentScore = studentScore.scores.find(
//       (score) => score.componentName === componentName
//     );

//     if (!componentScore) return { obtainedMarks: 0, isPassing: false };

//     const passingMark = getPassingMarks(componentName);
//     const isPassing = componentScore.obtainedMarks >= passingMark;

//     return {
//       obtainedMarks: componentScore.obtainedMarks,
//       isPassing,
//     };
//   };

//   const calculateTotalScore = (studentId: string) => {
//     const studentScore = studentScores.find((score) =>
//       typeof score.studentId === "string"
//         ? score.studentId === studentId
//         : score.studentId._id === studentId
//     );

//     if (!studentScore) return 0;

//     return studentScore.totalMarks || 0;
//   };

//   const isStudentPassing = (studentId: string) => {
//     // A student passes if they pass all individual components
//     const components = Object.keys(course.evaluationScheme);

//     for (const component of components) {
//       const { isPassing } = getScoreForStudent(studentId, component);
//       if (!isPassing) return false;
//     }

//     return true;
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//         {error}
//       </Alert>
//     );
//   }

//   if (students.length === 0) {
//     return <Alert severity="info">No students enrolled in this course.</Alert>;
//   }

//   const components = Object.keys(course.evaluationScheme);

//   return (
//     <Box>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h6">Total Course Scores (100%)</Typography>
//         <Box>
//           <Button
//             variant="outlined"
//             startIcon={<PrintIcon />}
//             sx={{ mr: 1 }}
//             onClick={() => window.print()}
//           >
//             Print
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<DownloadIcon />}
//             onClick={() => {}}
//           >
//             Export CSV
//           </Button>
//         </Box>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>

//               {components.map((component) => {
//                 const weight = course.evaluationScheme[component];
//                 const percentage = Math.round(weight * 100);

//                 return (
//                   <TableCell key={component} align="center">
//                     {component} ({percentage}%)
//                     <br />
//                     <small>Pass: {getPassingMarks(component)}</small>
//                   </TableCell>
//                 );
//               })}

//               <TableCell align="center">TOTAL (100%)</TableCell>
//               <TableCell align="center">Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, index) => {
//               const totalScore = calculateTotalScore(student._id);
//               const passing = isStudentPassing(student._id);

//               return (
//                 <TableRow key={student._id} hover>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{student.academicYear}</TableCell>
//                   <TableCell>{student.program}</TableCell>
//                   <TableCell>{student.registrationNumber}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.semester}</TableCell>

//                   {components.map((component) => {
//                     const { obtainedMarks, isPassing } = getScoreForStudent(
//                       student._id,
//                       component
//                     );

//                     return (
//                       <TableCell
//                         key={component}
//                         align="center"
//                         sx={{
//                           color: isPassing ? "success.main" : "error.main",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {formatMark(obtainedMarks)}
//                       </TableCell>
//                     );
//                   })}

//                   <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                     {formatMark(totalScore)}
//                   </TableCell>
//                   <TableCell align="center">
//                     <Chip
//                       label={passing ? "PASS" : "FAIL"}
//                       color={passing ? "success" : "error"}
//                       size="small"
//                     />
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default TotalScoreComponent;

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
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import { Course, Student } from "../../types";
import { scoreService } from "../../services/scoreService";
import { EVALUATION_SCHEMES } from "../../utils/evaluationSchemes";

interface TotalScoreComponentProps {
  course: Course;
  students: Student[];
}

interface StudentScore {
  studentId: string;
  scores: {
    componentName: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
  totalMarks: number;
}

const TotalScoreComponent: React.FC<TotalScoreComponentProps> = ({
  course,
  students,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentScores, setStudentScores] = useState<StudentScore[]>([]);

  useEffect(() => {
    fetchScores();
  }, [course, students]);

  const fetchScores = async () => {
    if (!course || students.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const scores = await scoreService.getScoresByCourse(course._id);
      setStudentScores(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      setError("Failed to load scores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPassingMarks = (componentName: string) => {
    const evaluationScheme = EVALUATION_SCHEMES[course.type];
    if (!evaluationScheme) return 0;

    const weight = course.evaluationScheme[componentName];
    if (!weight) return 0;

    const totalMarks = evaluationScheme.totalScore[componentName] || 0;
    const passingPercentage =
      evaluationScheme.passingCriteria[componentName] || 0.4;

    return Math.round(totalMarks * passingPercentage);
  };

  const formatMark = (value: number) => {
    return value.toFixed(1);
  };

  const getScoreForStudent = (studentId: string, componentName: string) => {
    const studentScore = studentScores.find((score) =>
      typeof score.studentId === "string"
        ? score.studentId === studentId
        : score.studentId._id === studentId
    );

    if (!studentScore) return { obtainedMarks: 0, isPassing: false };

    const componentScore = studentScore.scores.find(
      (score) => score.componentName === componentName
    );

    if (!componentScore) return { obtainedMarks: 0, isPassing: false };

    const passingMark = getPassingMarks(componentName);
    const isPassing = componentScore.obtainedMarks >= passingMark;

    return {
      obtainedMarks: componentScore.obtainedMarks,
      isPassing,
    };
  };

  const calculateTotalScore = (studentId: string) => {
    const studentScore = studentScores.find((score) =>
      typeof score.studentId === "string"
        ? score.studentId === studentId
        : score.studentId._id === studentId
    );

    if (!studentScore) return 0;

    return studentScore.totalMarks || 0;
  };

  const isStudentPassing = (studentId: string) => {
    // A student passes if they pass all individual components
    const components = Object.keys(course.evaluationScheme);

    for (const component of components) {
      const { isPassing } = getScoreForStudent(studentId, component);
      if (!isPassing) return false;
    }

    return true;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (students.length === 0) {
    return <Alert severity="info">No students enrolled in this course.</Alert>;
  }

  const components = Object.keys(course.evaluationScheme);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {}}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>SNo.</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Enrollment No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>

              {components.map((component) => {
                const weight = course.evaluationScheme[component];
                const percentage = Math.round(weight * 100);

                return (
                  <TableCell key={component} align="center">
                    {component} ({percentage}%)
                    <br />
                    <small>Pass: {getPassingMarks(component)}</small>
                  </TableCell>
                );
              })}

              <TableCell align="center">TOTAL (100%)</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => {
              const totalScore = calculateTotalScore(student._id);
              const passing = isStudentPassing(student._id);

              return (
                <TableRow key={student._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.academicYear}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>

                  {components.map((component) => {
                    const { obtainedMarks, isPassing } = getScoreForStudent(
                      student._id,
                      component
                    );

                    return (
                      <TableCell
                        key={component}
                        align="center"
                        sx={{
                          color: isPassing ? "success.main" : "error.main",
                          fontWeight: "bold",
                        }}
                      >
                        {formatMark(obtainedMarks)}
                      </TableCell>
                    );
                  })}

                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {formatMark(totalScore)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={passing ? "PASS" : "FAIL"}
                      color={passing ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TotalScoreComponent;
