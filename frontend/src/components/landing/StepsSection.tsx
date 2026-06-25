// src/components/landing/StepsSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

const steps = [
  {
    title: 'Загрузите данные',
    text: 'Выберите файл с результатами лабораторной работы.',
  },
  {
    title: 'Проверьте и визуализируйте',
    text: 'Просмотрите таблицу, задайте параметры анализа и графиков.',
  },
  {
    title: 'Сформируйте отчёт',
    text: 'Получите аккуратный PDF по требованиям методички.',
  },
];

export const StepsSection: React.FC = () => {
  return (
    <Box
      id="features-section"
      sx={{
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 1 }}>
          Как работает сервис
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: 'text.secondary', maxWidth: 560 }}
        >
          Всего несколько шагов от исходных данных до готового отчёта.
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid key={step.title} item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};