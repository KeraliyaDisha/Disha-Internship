
import {
    Grid,
    Paper,
    Typography,
    Button,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { People } from '@mui/icons-material';
import { useState } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50',
        },
    },
});

const floors = [
    '9th', '8th', '7th', '6th', '5th',
    '4th', '3rd', '2nd', '1st', 'ground floor'
];

const floorToIndex = (floor) => floors.indexOf(floor);

export default function MuiElevatorGrid() {
    const [liftPositions, setLiftPositions] = useState(Array(5).fill(9));
    const [movingLifts, setMovingLifts] = useState(Array(5).fill(false));
    const [liftArrived, setLiftArrived] = useState(Array(5).fill(false)); 
    const [buttonsStatus, setButtonsStatus] = useState(Array(floors.length).fill(false)); 
    const [transitionDuration, setTransitionDuration] = useState(0.5);

    const playSound = () => {
        const audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'); 
        audio.play();
    };

    const handleCallClick = (floor) => {
        const floorIndex = floorToIndex(floor);

        if (buttonsStatus[floorIndex]) return; 

        setButtonsStatus((prev) =>
            prev.map((status, index) => (index === floorIndex ? true : status))
        );

        assignLiftToFloor(floorIndex);
    };

    const assignLiftToFloor = (floorIndex) => {
        const closestLiftIndex = liftPositions.reduce((closest, position, index) => {
            if (movingLifts[index]) return closest; 
            const distance = Math.abs(position - floorIndex);
            return distance < Math.abs(liftPositions[closest] - floorIndex) ? index : closest;
        }, 0);

        if (!movingLifts[closestLiftIndex]) {
            moveLift(closestLiftIndex, floorIndex);
        }
    };

    

    const moveLift = (liftIndex, floorIndex) => {
        const currentFloor = liftPositions[liftIndex];
        const travelTime = Math.abs(currentFloor - floorIndex) * 500;

        setTransitionDuration(travelTime / 1000);

        setMovingLifts((prev) =>
            prev.map((moving, index) => (index === liftIndex ? true : moving))
        );

        setLiftPositions((prev) =>
            prev.map((position, index) => (index === liftIndex ? floorIndex : position))
        );

        setTimeout(() => {
            playSound();

            setLiftArrived((prev) =>
                prev.map((arrived, index) => (index === liftIndex ? true : arrived))
            );

            setButtonsStatus((prev) =>
                prev.map((status, index) => (index === floorIndex ? 'Arrived' : status))
            );

            setTimeout(() => {
                setLiftArrived((prev) =>
                    prev.map((arrived, index) => (index === liftIndex ? false : arrived))
                );

                setButtonsStatus((prev) =>
                    prev.map((status, index) => (index === floorIndex ? false : status))
                );

                setMovingLifts((prev) =>
                    prev.map((moving, index) => (index === liftIndex ? false : moving))
                );
            }, 500); 
        }, travelTime);
    };


    return (
        <ThemeProvider theme={theme}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 1000,
                    margin: 'auto',
                    mt: 4,
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Elevator Exercise
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={1.5}>
                        {floors.map((floor) => (
                            <Paper
                                key={floor}
                                elevation={1}
                                sx={{
                                    height: 60,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #e0e0e0',
                                    mb: 1,
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                <Typography>{floor}</Typography>
                            </Paper>
                        ))}
                    </Grid>

                    {[...Array(5)].map((_, liftIndex) => (
                        <Grid item xs={1.7} key={liftIndex}>
                            <div
                                style={{
                                    position: 'relative',
                                    height: `${floors.length * 70}px`,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: liftArrived[liftIndex]
                                            ? '#4caf50' 
                                            : movingLifts[liftIndex]
                                                ? '#f44336' 
                                                : '#757575', 
                                        color: '#fff',
                                        borderRadius: '4px',
                                        transform: `translateY(${liftPositions[liftIndex] * 70}px)`,
                                        transition: `transform ${transitionDuration}s linear`,
                                    }}
                                >
                                    <People />
                                </div>
                            </div>
                        </Grid>
                    ))}

                    <Grid item xs={1.5}>
                        {floors.map((floor, index) => (
                            <Button
                                key={`call-${floor}`}
                                variant="contained"
                                color={
                                    buttonsStatus[index] === 'Arrived'
                                        ? 'success'
                                        : buttonsStatus[index]
                                            ? 'error'
                                            : 'primary'
                                }
                                onClick={() => handleCallClick(floor)}
                                fullWidth
                                sx={{
                                    height: 60,
                                    mb: 1.2,
                                    borderRadius: 1,
                                }}
                            >
                                {buttonsStatus[index] === 'Arrived'
                                    ? 'Arrived'
                                    : buttonsStatus[index]
                                        ? 'Waiting'
                                        : 'Call'}
                            </Button>
                        ))}
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
}


