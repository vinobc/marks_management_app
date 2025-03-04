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
