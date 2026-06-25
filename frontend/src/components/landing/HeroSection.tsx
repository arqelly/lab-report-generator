// src/components/landing/HeroSection.tsx
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Левый столбец: текст */}
          <Grid item xs={12} md={6}>
            <Typography variant="h1" sx={{ mb: 2 }}>
              Конструктор лабораторных отчётов
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, color: 'text.secondary', maxWidth: 480 }}
            >
              Загрузите данные экспериментов, постройте графики и оформите
              отчёт в один поток без рутины в Excel и Word.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={onGetStarted}>
                Начать с загрузки данных
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  const el = document.getElementById('features-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Посмотреть возможности
              </Button>
            </Box>
          </Grid>

          {/* Правый столбец: инфографика‑карточки */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #E5E7EB',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 2, color: 'text.secondary' }}
              >
                Модули сервиса
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MiniCard
                    title="Загрузка файлов"
                    accent="1"
                    color="primary"
                    text="Импортируйте таблицы с результатами измерений."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiniCard
                    title="Таблица данных"
                    accent="2"
                    color="success"
                    text="Просматривайте, редактируйте и очищайте данные."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiniCard
                    title="Графики"
                    accent="3"
                    color="warning"
                    text="Стройте графики и подбирайте метод построения."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MiniCard
                    title="PDF‑отчёт"
                    accent="4"
                    color="error"
                    text="Формируйте готовый отчёт по заданному шаблону."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

interface MiniCardProps {
  title: string;
  text: string;
  accent: string;
  color: 'primary' | 'success' | 'warning' | 'error';
}

function MiniCard({ title, text, accent, color }: MiniCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: `${color}.main`,
          color: `${color}.contrastText`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 14,
          mb: 1,
        }}
      >
        {accent}
      </Box>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
}