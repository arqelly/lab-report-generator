import React from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
    Grid2 as Grid,  // Используем Grid2
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import type { ReportRequest } from '../types';

interface ReportFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = React.useState<ReportRequest>({
        title: '',
        student_name: '',
        group: '',
        objective: '',
        theory: '',
        analysis: '',
        conclusions: '',
        additional_notes: '',
    });

    const reportMutation = useMutation({
        mutationFn: api.generateReport,
        onSuccess: (data) => { 
            onSuccess(data.message);
            api.downloadReport(data.download_url); 
        },
        onError: (error: Error) => {
            onError(error.message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reportMutation.mutate(formData);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Генерация отчета
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required
                            fullWidth
                            label="Название работы"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            required
                            fullWidth
                            label="ФИО студента"
                            name="student_name"
                            value={formData.student_name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            required
                            fullWidth
                            label="Группа"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={3}
                            label="Цель работы"
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Теоретическая часть"
                            name="theory"
                            value={formData.theory}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={3}
                            label="Анализ результатов"
                            name="analysis"
                            value={formData.analysis}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={2}
                            label="Выводы"
                            name="conclusions"
                            value={formData.conclusions}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Дополнительные замечания (необязательно)"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={reportMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
                                disabled={reportMutation.isPending}
                                sx={{ minWidth: 200 }}
                            >
                                {reportMutation.isPending ? 'Генерация...' : 'Сгенерировать отчет'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            {reportMutation.isSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Отчет успешно сгенерирован! Скачивание началось.
                </Alert>
            )}
        </Paper>
    );
};