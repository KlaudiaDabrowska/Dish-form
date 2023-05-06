import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useMediaQuery, useTheme } from "@mui/material";
import { Form } from "../components/Form";

export const MainView = () => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      style={{
        flexGrow: 1,
        backgroundColor: "#8EC5FC",
        backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Grid item>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              width: isSmallScreen ? 300 : 600,
              height: 600,
            }}
          >
            <Form />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
