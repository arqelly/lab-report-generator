import React from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid2 as Grid,  // Используем Grid2 вместо Grid
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface StatisticsViewProps {
    onError: (message: string) => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ onError }) => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['statistics'],
        queryFn: api.getStatistics,
    });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        onError(error instanceof Error ? error.message : 'Ошибка загрузки статистики');
        return (
            <Alert severity="error">
                Ошибка загрузки статистики
            </Alert>
        );
    }

    if (!stats || Object.keys(stats).length === 0) {
        return (
            <Alert severity="warning">
                Нет числовых данных для расчета статистики
            </Alert>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Статистические показатели
            </Typography>

            {/* Используем Grid2 с правильным синтаксисом */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    {Object.entries(stats).map(([col, values]) => (
                        <Grid 
                            key={col} 
                            size={{ 
                                xs: 12, 
                                md: 6, 
                                lg: 4 
                            }}
                        >
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {col}
                                    </Typography>
                                    <Typography variant="body2">
                                        Количество: {values.count}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Среднее: {values.mean.toFixed(4)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Стд. откл.: {values.std.toFixed(4)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Мин: {values.min.toFixed(4)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Макс: {values.max.toFixed(4)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Параметр</TableCell>
                            {Object.keys(stats).map(col => (
                                <TableCell key={col} align="center">
                                    <strong>{col}</strong>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            { key: 'mean', label: 'Среднее' },
                            { key: 'std', label: 'Стд. отклонение' },
                            { key: 'min', label: 'Минимум' },
                            { key: 'max', label: 'Максимум' },
                            { key: 'median', label: 'Медиана' },
                            { key: 'q1', label: 'Квартиль 25%' },
                            { key: 'q3', label: 'Квартиль 75%' },
                        ].map(({ key, label }) => (
                            <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                    <strong>{label}</strong>
                                </TableCell>
                                {Object.entries(stats).map(([col, values]) => (
                                    <TableCell key={`${col}-${key}`} align="center">
                                        {values[key as keyof typeof values]?.toFixed(4)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};