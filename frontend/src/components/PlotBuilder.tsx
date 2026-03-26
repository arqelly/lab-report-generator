import React, { useState } from 'react';
import {
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid2 as Grid,  // Используем Grid2
} from '@mui/material';
import Plot from 'react-plotly.js';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

interface PlotBuilderProps {
    columns: string[];
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

type PlotType = 'line' | 'scatter' | 'bar' | 'box';

export const PlotBuilder: React.FC<PlotBuilderProps> = ({ 
    columns, 
    onError,
    onSuccess 
}) => {
    const [xColumn, setXColumn] = useState<string>(columns[0] || '');
    const [yColumn, setYColumn] = useState<string>(columns[1] || columns[0] || '');
    const [plotType, setPlotType] = useState<PlotType>('line');

    const plotMutation = useMutation({
        mutationFn: api.createPlot,
        onSuccess: () => {
            onSuccess('График успешно построен');
        },
        onError: (error: Error) => {
            onError(error.message);
        },
    });

    const handleCreatePlot = () => {
        if (!xColumn || !yColumn) {
            onError('Выберите колонки для построения графика');
            return;
        }
        plotMutation.mutate({
            x_column: xColumn,
            y_column: yColumn,
            plot_type: plotType,
        });
    };

    if (columns.length === 0) {
        return (
            <Alert severity="warning">
                Для построения графиков необходимы числовые колонки в данных.
            </Alert>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Построение графиков
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Ось X</InputLabel>
                                <Select
                                    value={xColumn}
                                    label="Ось X"
                                    onChange={(e) => setXColumn(e.target.value)}
                                >
                                    {columns.map((col) => (
                                        <MenuItem key={col} value={col}>
                                            {col}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Ось Y</InputLabel>
                                <Select
                                    value={yColumn}
                                    label="Ось Y"
                                    onChange={(e) => setYColumn(e.target.value)}
                                >
                                    {columns.map((col) => (
                                        <MenuItem key={col} value={col}>
                                            {col}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Тип графика</InputLabel>
                                <Select
                                    value={plotType}
                                    label="Тип графика"
                                    onChange={(e) => setPlotType(e.target.value as PlotType)}
                                >
                                    <MenuItem value="line">Линейный</MenuItem>
                                    <MenuItem value="scatter">Точечный</MenuItem>
                                    <MenuItem value="bar">Столбчатый</MenuItem>
                                    <MenuItem value="box">Ящик с усами</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCreatePlot}
                                disabled={plotMutation.isPending}
                                sx={{ height: '56px' }}
                            >
                                {plotMutation.isPending ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Построить график'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {plotMutation.isPending && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {plotMutation.data && (
                <Box sx={{ mt: 3, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                    <Plot
                        data={plotMutation.data.data}
                        layout={{
                            ...plotMutation.data.layout,
                            autosize: true,
                            height: 500,
                            margin: { l: 50, r: 50, t: 50, b: 50 },
                            plot_bgcolor: 'white',
                            paper_bgcolor: 'white',
                        }}
                        config={{ 
                            responsive: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                            displayModeBar: true,
                        }}
                        style={{ width: '100%', height: '500px' }}
                        useResizeHandler={true}
                    />
                </Box>
            )}
        </Paper>
    );
};