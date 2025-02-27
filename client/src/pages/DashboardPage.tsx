// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   //   const handleCourseClick = (courseId: string) => {
//   //     navigate(`/courses/${courseId}`);
//   //   };

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         // <Grid container spacing={3}>
//         //   {courses.map((course) => (
//         //     <Grid item key={course._id} xs={12} sm={6} md={4}>
//         //       <Card
//         //         variant="outlined"
//         //         sx={{
//         //           height: "100%",
//         //           display: "flex",
//         //           flexDirection: "column",
//         //         }}
//         //       >
//         //         <CardContent sx={{ flexGrow: 1 }}>
//         //           <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//         //             <SchoolIcon color="primary" sx={{ mr: 1 }} />
//         //             <Typography variant="h6" component="div">
//         //               {course.code}
//         //             </Typography>
//         //           </Box>
//         //           <Typography gutterBottom variant="subtitle1">
//         //             {course.name}
//         //           </Typography>
//         //           <Typography variant="body2" color="text.secondary">
//         //             Type: {course.type}
//         //           </Typography>
//         //           <Typography variant="body2" color="text.secondary">
//         //             Slot: {course.slot}
//         //           </Typography>
//         //           <Typography variant="body2" color="text.secondary">
//         //             Venue: {course.venue || "Not specified"}
//         //           </Typography>
//         //         </CardContent>
//         //         <CardActions>
//         //           <Button
//         //             size="small"
//         //             startIcon={<SchoolIcon />}
//         //             onClick={() => handleCourseClick(course._id)}
//         //           >
//         //             Details
//         //           </Button>
//         //           <Button
//         //             size="small"
//         //             color="primary"
//         //             startIcon={<AssignmentIcon />}
//         //             onClick={() => handleScoresClick(course._id)}
//         //           >
//         //             Manage Scores
//         //           </Button>
//         //         </CardActions>
//         //       </Card>
//         //     </Grid>
//         //   ))}
//         // </Grid>
//         // <Grid container spacing={3}>
//         //   {courses.map((course) => (
//         //     <Grid item key={course._id} xs={12} sm={6} md={4}>
//         //       <Card
//         //         variant="outlined"
//         //         sx={{
//         //           height: "100%",
//         //           display: "flex",
//         //           flexDirection: "column",
//         //           p: 1.5, // Add padding inside the card
//         //           boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Add shadow for depth
//         //         }}
//         //       >
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={6} md={6} lg={4}>
//               <Card
//                 variant="outlined"
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   p: 1,
//                   minHeight: 250,
//                 }}
//               >
//                 {/* <CardContent sx={{ flexGrow: 1, pb: 1 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
//                     <Typography variant="h5" component="div">
//                       {course.code}
//                     </Typography>
//                   </Box>
//                   <Typography gutterBottom variant="h6" sx={{ mb: 2 }}>
//                     {course.name}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     Type: {course.type}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     Slot: {course.slot}
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary">
//                     Venue: {course.venue || "Not specified"}
//                   </Typography> */}

//                 <CardContent sx={{ flexGrow: 1, px: 3, py: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <SchoolIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
//                     <Typography variant="h5" component="div">
//                       {course.code}
//                     </Typography>
//                   </Box>
//                   <Typography
//                     gutterBottom
//                     variant="h6"
//                     sx={{ mb: 2, fontWeight: 500 }}
//                   >
//                     {course.name}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     <strong>Type:</strong> {course.type}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     <strong>Slot:</strong> {course.slot}
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     color="text.secondary"
//                     sx={{ mb: 1 }}
//                   >
//                     <strong>Venue:</strong> {course.venue || "Not specified"}
//                   </Typography>
//                 </CardContent>

//                 {/* <CardActions sx={{ pt: 2, borderTop: "1px solid #eee" }}>
//                   <Button
//                     size="medium"
//                     variant="outlined"
//                     startIcon={<SchoolIcon />}
//                     onClick={() => handleCourseClick(course._id)}
//                     sx={{ mr: 1 }}
//                   >
//                     Details
//                   </Button>
//                   <Button
//                     size="medium"
//                     color="primary"
//                     variant="contained"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleScoresClick(course._id)}
//                   >
//                     Manage Scores
//                   </Button>
//                 </CardActions> */}

//                 <CardActions sx={{ px: 3, pb: 2, pt: 0 }}>
//                   <Button
//                     variant="outlined"
//                     size="medium"
//                     startIcon={<SchoolIcon />}
//                     onClick={() => handleCourseClick(course._id)}
//                     sx={{ mr: 1 }}
//                   >
//                     Details
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="medium"
//                     color="primary"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleScoresClick(course._id)}
//                   >
//                     Manage Scores
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={6} md={6} lg={4}>
//               <Card
//                 elevation={2}
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   borderRadius: 2,
//                   minHeight: 280,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//                     <SchoolIcon
//                       color="primary"
//                       sx={{ mr: 1.5, fontSize: 28 }}
//                     />
//                     <Typography variant="h5" component="div" fontWeight="500">
//                       {course.code}
//                     </Typography>
//                   </Box>

//                   <Typography
//                     variant="h6"
//                     component="h2"
//                     gutterBottom
//                     sx={{ mb: 3, fontWeight: "medium" }}
//                   >
//                     {course.name}
//                   </Typography>

//                   <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
//                     <Typography
//                       variant="body1"
//                       component="span"
//                       color="text.secondary"
//                       fontWeight="500"
//                     >
//                       Type:
//                     </Typography>
//                     <Typography variant="body1" component="span" sx={{ ml: 1 }}>
//                       {course.type}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
//                     <Typography
//                       variant="body1"
//                       component="span"
//                       color="text.secondary"
//                       fontWeight="500"
//                     >
//                       Slot:
//                     </Typography>
//                     <Typography variant="body1" component="span" sx={{ ml: 1 }}>
//                       {course.slot}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                     <Typography
//                       variant="body1"
//                       component="span"
//                       color="text.secondary"
//                       fontWeight="500"
//                     >
//                       Venue:
//                     </Typography>
//                     <Typography variant="body1" component="span" sx={{ ml: 1 }}>
//                       {course.venue || "Not specified"}
//                     </Typography>
//                   </Box>
//                 </CardContent>

//                 <CardActions
//                   sx={{ p: 3, pt: 0, justifyContent: "space-between" }}
//                 >
//                   <Button
//                     variant="outlined"
//                     size="medium"
//                     startIcon={<SchoolIcon />}
//                     onClick={() => handleCourseClick(course._id)}
//                     sx={{ minWidth: 120 }}
//                   >
//                     Details
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="medium"
//                     color="primary"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleScoresClick(course._id)}
//                     sx={{ minWidth: 170 }}
//                   >
//                     Manage Scores
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   const cardStyle = {
//     display: "flex",
//     flexDirection: "column" as "column",
//     height: "100%",
//     minHeight: "280px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   };

//   const cardContentStyle = {
//     flexGrow: 1,
//     padding: "24px",
//   };

//   const cardActionsStyle = {
//     padding: "16px",
//     display: "flex",
//     justifyContent: "space-between",
//   };

//   const headerStyle = {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "16px",
//   };

//   const titleStyle = {
//     fontSize: "1.5rem",
//     fontWeight: 600,
//     marginBottom: "16px",
//   };

//   const detailStyle = {
//     display: "flex",
//     marginBottom: "8px",
//   };

//   const labelStyle = {
//     fontWeight: 600,
//     color: "#666",
//     marginRight: "8px",
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={6} md={6} lg={4}>
//               <Card style={cardStyle}>
//                 <CardContent style={cardContentStyle}>
//                   <div style={headerStyle}>
//                     <SchoolIcon
//                       color="primary"
//                       style={{ marginRight: "12px", fontSize: "28px" }}
//                     />
//                     <Typography variant="h5">{course.code}</Typography>
//                   </div>

//                   <Typography style={titleStyle}>{course.name}</Typography>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Type:</span>
//                     <span>{course.type}</span>
//                   </div>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Slot:</span>
//                     <span>{course.slot}</span>
//                   </div>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Venue:</span>
//                     <span>{course.venue || "Not specified"}</span>
//                   </div>
//                 </CardContent>

//                 <CardActions style={cardActionsStyle}>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     startIcon={<SchoolIcon />}
//                     onClick={() => handleCourseClick(course._id)}
//                     style={{ minWidth: "120px" }}
//                   >
//                     Details
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="large"
//                     color="primary"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleScoresClick(course._id)}
//                     style={{ minWidth: "170px" }}
//                   >
//                     Manage Scores
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   const cardStyle = {
//     display: "flex",
//     flexDirection: "column" as "column",
//     height: "100%",
//     minHeight: "280px",
//     width: "100%",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   };

//   const cardContentStyle = {
//     flexGrow: 1,
//     padding: "24px",
//   };

//   const cardActionsStyle = {
//     padding: "16px",
//     display: "flex",
//     justifyContent: "space-between",
//   };

//   const headerStyle = {
//     display: "flex",
//     alignItems: "center",
//     marginBottom: "16px",
//   };

//   const titleStyle = {
//     fontSize: "1.5rem",
//     fontWeight: 600,
//     marginBottom: "16px",
//     whiteSpace: "normal" as "normal", // Ensure text wraps
//     wordBreak: "break-word" as "break-word",
//   };

//   const detailStyle = {
//     display: "flex",
//     marginBottom: "12px",
//     flexWrap: "wrap" as "wrap", // Allow wrapping for long content
//   };

//   const labelStyle = {
//     fontWeight: 600,
//     color: "#666",
//     marginRight: "12px",
//     minWidth: "70px", // Fixed width for labels to align values
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={12} md={6}>
//               <Card style={cardStyle}>
//                 <CardContent style={cardContentStyle}>
//                   <div style={headerStyle}>
//                     <SchoolIcon
//                       color="primary"
//                       style={{ marginRight: "12px", fontSize: "28px" }}
//                     />
//                     <Typography variant="h5">{course.code}</Typography>
//                   </div>

//                   <Typography style={titleStyle}>{course.name}</Typography>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Type:</span>
//                     <span>{course.type}</span>
//                   </div>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Slot:</span>
//                     <span>{course.slot}</span>
//                   </div>

//                   <div style={detailStyle}>
//                     <span style={labelStyle}>Venue:</span>
//                     <span>{course.venue || "Not specified"}</span>
//                   </div>
//                 </CardContent>

//                 <CardActions style={cardActionsStyle}>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     startIcon={<SchoolIcon />}
//                     onClick={() => handleCourseClick(course._id)}
//                     style={{ minWidth: "120px" }}
//                   >
//                     Details
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="large"
//                     color="primary"
//                     startIcon={<AssignmentIcon />}
//                     onClick={() => handleScoresClick(course._id)}
//                     style={{ minWidth: "170px" }}
//                   >
//                     Manage Scores
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={12} md={6}>
//               <div
//                 style={{
//                   border: "1px solid #e0e0e0",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                   backgroundColor: "white",
//                   minHeight: "300px",
//                   width: "100%",
//                 }}
//               >
//                 {/* Course Header */}
//                 <div style={{ padding: "24px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     <SchoolIcon
//                       style={{
//                         color: "#1976d2",
//                         marginRight: "12px",
//                         fontSize: "28px",
//                       }}
//                     />
//                     <span style={{ fontSize: "24px", fontWeight: 500 }}>
//                       {course.code}
//                     </span>
//                   </div>

//                   <h2
//                     style={{
//                       fontSize: "22px",
//                       fontWeight: 600,
//                       marginTop: "0",
//                       marginBottom: "24px",
//                       color: "#212121",
//                     }}
//                   >
//                     {course.name}
//                   </h2>

//                   <div style={{ marginBottom: "16px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Type:
//                     </span>
//                     <span>{course.type}</span>
//                   </div>

//                   <div style={{ marginBottom: "16px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Slot:
//                     </span>
//                     <span>{course.slot}</span>
//                   </div>

//                   <div style={{ marginBottom: "24px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Venue:
//                     </span>
//                     <span>{course.venue || "Not specified"}</span>
//                   </div>
//                 </div>

//                 {/* Course Actions */}
//                 <div
//                   style={{
//                     padding: "16px 24px",
//                     display: "flex",
//                     borderTop: "1px solid #eee",
//                     width: "100%",
//                   }}
//                 >
//                   <button
//                     onClick={() => handleCourseClick(course._id)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "8px 24px",
//                       borderRadius: "4px",
//                       border: "1px solid #1976d2",
//                       backgroundColor: "white",
//                       color: "#1976d2",
//                       fontSize: "14px",
//                       fontWeight: 500,
//                       cursor: "pointer",
//                       marginRight: "12px",
//                       width: "45%",
//                     }}
//                   >
//                     <SchoolIcon
//                       style={{ marginRight: "8px", fontSize: "18px" }}
//                     />
//                     Details
//                   </button>

//                   <button
//                     onClick={() => handleScoresClick(course._id)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "8px 24px",
//                       borderRadius: "4px",
//                       border: "none",
//                       backgroundColor: "#1976d2",
//                       color: "white",
//                       fontSize: "14px",
//                       fontWeight: 500,
//                       cursor: "pointer",
//                       width: "55%",
//                     }}
//                   >
//                     <AssignmentIcon
//                       style={{ marginRight: "8px", fontSize: "18px" }}
//                     />
//                     Manage Scores
//                   </button>
//                 </div>
//               </div>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
//   Paper,
// } from "@mui/material";
// import {
//   School as SchoolIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { facultyService } from "../services/facultyService";
// import { Course } from "../types";

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const assignedCourses = await facultyService.getAssignedCourses();
//         setCourses(assignedCourses);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleCourseClick = (courseId: string) => {
//     // Navigate to the courses page with the selected course
//     navigate(`/courses?courseId=${courseId}`);
//   };

//   const handleScoresClick = (courseId: string) => {
//     navigate(`/scores?courseId=${courseId}`);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Welcome, {user?.name}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary">
//           {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
//         </Typography>
//       </Paper>

//       <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
//         Your Assigned Courses
//       </Typography>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="textSecondary">
//             You don't have any assigned courses yet.
//             {user?.isAdmin &&
//               " As an admin, you can manage all courses from the Courses page."}
//           </Typography>
//           {user?.isAdmin && (
//             <Button
//               variant="contained"
//               sx={{ mt: 2 }}
//               onClick={() => navigate("/courses")}
//             >
//               Manage Courses
//             </Button>
//           )}
//         </Paper>
//       ) : (
//         <Grid container spacing={4}>
//           {courses.map((course) => (
//             <Grid item key={course._id} xs={12} sm={12} md={6}>
//               <div
//                 style={{
//                   border: "1px solid #e0e0e0",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                   backgroundColor: "white",
//                   minHeight: "300px",
//                   width: "100%",
//                 }}
//               >
//                 {/* Course Header */}
//                 <div style={{ padding: "24px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     <SchoolIcon
//                       style={{
//                         color: "#1976d2",
//                         marginRight: "12px",
//                         fontSize: "28px",
//                       }}
//                     />
//                     <span style={{ fontSize: "24px", fontWeight: 500 }}>
//                       {course.code}
//                     </span>
//                   </div>

//                   <h2
//                     style={{
//                       fontSize: "22px",
//                       fontWeight: 600,
//                       marginTop: "0",
//                       marginBottom: "24px",
//                       color: "#212121",
//                     }}
//                   >
//                     {course.name}
//                   </h2>

//                   <div style={{ marginBottom: "16px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Type:
//                     </span>
//                     <span>{course.type}</span>
//                   </div>

//                   <div style={{ marginBottom: "16px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Slot:
//                     </span>
//                     <span>{course.slot}</span>
//                   </div>

//                   <div style={{ marginBottom: "24px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: "80px",
//                         fontWeight: 600,
//                         color: "#666",
//                       }}
//                     >
//                       Venue:
//                     </span>
//                     <span>{course.venue || "Not specified"}</span>
//                   </div>
//                 </div>

//                 {/* Course Actions */}
//                 <div
//                   style={{
//                     padding: "16px 24px",
//                     display: "flex",
//                     borderTop: "1px solid #eee",
//                     width: "100%",
//                   }}
//                 >
//                   <button
//                     onClick={() => handleCourseClick(course._id)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "8px 24px",
//                       borderRadius: "4px",
//                       border: "1px solid #1976d2",
//                       backgroundColor: "white",
//                       color: "#1976d2",
//                       fontSize: "14px",
//                       fontWeight: 500,
//                       cursor: "pointer",
//                       marginRight: "12px",
//                       width: "45%",
//                     }}
//                   >
//                     <SchoolIcon
//                       style={{ marginRight: "8px", fontSize: "18px" }}
//                     />
//                     Details
//                   </button>

//                   <button
//                     onClick={() => handleScoresClick(course._id)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       padding: "8px 24px",
//                       borderRadius: "4px",
//                       border: "none",
//                       backgroundColor: "#1976d2",
//                       color: "white",
//                       fontSize: "14px",
//                       fontWeight: 500,
//                       cursor: "pointer",
//                       width: "55%",
//                     }}
//                   >
//                     <AssignmentIcon
//                       style={{ marginRight: "8px", fontSize: "18px" }}
//                     />
//                     Manage Scores
//                   </button>
//                 </div>
//               </div>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DashboardPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { facultyService } from "../services/facultyService";
import { Course } from "../types";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const assignedCourses = await facultyService.getAssignedCourses();
        setCourses(assignedCourses);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses?courseId=${courseId}`);
  };

  const handleScoresClick = (courseId: string) => {
    navigate(`/scores?courseId=${courseId}`);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user?.department} - {user?.isAdmin ? "Administrator" : "Faculty"}
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Your Assigned Courses
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            You don't have any assigned courses yet.
            {user?.isAdmin &&
              " As an admin, you can manage all courses from the Courses page."}
          </Typography>
          {user?.isAdmin && (
            <button
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "16px",
              }}
              onClick={() => navigate("/courses")}
            >
              Manage Courses
            </button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={12} md={6}>
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                  minHeight: "40%",
                  width: "100%",
                }}
              >
                {/* Course Header */}
                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <SchoolIcon
                      style={{
                        color: "#1976d2",
                        marginRight: "12px",
                        fontSize: "28px",
                      }}
                    />
                    <span style={{ fontSize: "24px", fontWeight: 500 }}>
                      {course.code}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      marginTop: "0",
                      marginBottom: "0px",
                      color: "#212121",
                    }}
                  >
                    {course.name}
                  </h2>

                  <div
                    style={{
                      marginBottom: "0px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#666",
                        width: "80px",
                        display: "inline-block",
                      }}
                    >
                      Type:
                    </span>
                    <span style={{ display: "inline-block" }}>
                      {course.type}
                    </span>
                  </div>

                  <div
                    style={{
                      marginBottom: "0px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#666",
                        width: "80px",
                        display: "inline-block",
                      }}
                    >
                      Slot:
                    </span>
                    <span style={{ display: "inline-block" }}>
                      {course.slot}
                    </span>
                  </div>

                  <div
                    style={{
                      marginBottom: "24px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#666",
                        width: "80px",
                        display: "inline-block",
                      }}
                    >
                      Venue:
                    </span>
                    <span style={{ display: "inline-block" }}>
                      {course.venue || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Course Actions */}
                <div
                  style={{
                    padding: "16px 24px",
                    display: "flex",
                    borderTop: "1px solid #eee",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => handleCourseClick(course._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 24px",
                      borderRadius: "4px",
                      border: "1px solid #1976d2",
                      backgroundColor: "white",
                      color: "#1976d2",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      marginRight: "12px",
                      width: "45%",
                    }}
                  >
                    <SchoolIcon
                      style={{ marginRight: "8px", fontSize: "18px" }}
                    />
                    Details
                  </button>

                  <button
                    onClick={() => handleScoresClick(course._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 24px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: "#1976d2",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      width: "55%",
                    }}
                  >
                    <AssignmentIcon
                      style={{ marginRight: "8px", fontSize: "18px" }}
                    />
                    Manage Scores
                  </button>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;
