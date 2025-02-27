import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
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
    navigate(`/courses/${courseId}`);
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
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/courses")}
            >
              Manage Courses
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      {course.code}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="subtitle1">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {course.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Slot: {course.slot}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Venue: {course.venue || "Not specified"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<SchoolIcon />}
                    onClick={() => handleCourseClick(course._id)}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<AssignmentIcon />}
                    onClick={() => handleScoresClick(course._id)}
                  >
                    Manage Scores
                  </Button>
                </CardActions>
              </Card>
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
