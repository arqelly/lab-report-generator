import React, { useState } from 'react';
import type { FileUploadResponse } from './types';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Box,
    Alert,
    Snackbar,
    ThemeProvider,
    CssBaseline,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';

import { FileUploader } from './components/FileUploader';
import { DataTable } from './components/DataTable';
import { StatisticsView } from './components/StatisticsView';
import { PlotBuilder } from './components/PlotBuilder';
import { ReportForm } from './components/ReportForm';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function App() {
    const [currentTab, setCurrentTab] = useState(0);
    const [fileData, setFileData] = useState<FileUploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleFileUploaded = (data: FileUploadResponse) => {
        setFileData(data);
        setSuccess(`Файл "${data.filename}" успешно загружен`);
        setCurrentTab(1);
    };

    const handleError = (message: string) => {
        setError(message);
    };

    const handleSuccess = (message: string) => {
        setSuccess(message);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, md: 3 } }}>
                    <AppBar position="static" color="default" elevation={0}>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
                                Конструктор инфографики
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
                            <Tab label="📁 Загрузка данных" />
                            <Tab label="📋 Данные" disabled={!fileData} />
                            <Tab label="📊 Статистика" disabled={!fileData} />
                            <Tab label="📈 Графики" disabled={!fileData} />
                            <Tab label="📝 Отчет" disabled={!fileData} />
                        </Tabs>
                    </Box>

                    <TabPanel value={currentTab} index={0}>
                        <FileUploader 
                            onUploadSuccess={handleFileUploaded}
                            onError={handleError}
                        />
                    </TabPanel>

                    <TabPanel value={currentTab} index={1}>
                        {fileData && <DataTable data={fileData} />}
                    </TabPanel>

                    <TabPanel value={currentTab} index={2}>
                        {fileData && <StatisticsView onError={handleError} />}
                    </TabPanel>

                    <TabPanel value={currentTab} index={3}>
                        {fileData && (
                            <PlotBuilder 
                                columns={fileData.numeric_columns}
                                onError={handleError}
                                onSuccess={handleSuccess}
                            />
                        )}
                    </TabPanel>

                    <TabPanel value={currentTab} index={4}>
                        {fileData && (
                            <ReportForm 
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        )}
                    </TabPanel>

                    <Snackbar 
                        open={!!error} 
                        autoHideDuration={6000} 
                        onClose={() => setError(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert severity="error" onClose={() => setError(null)} variant="filled">
                            {error}
                        </Alert>
                    </Snackbar>

                    <Snackbar 
                        open={!!success} 
                        autoHideDuration={4000} 
                        onClose={() => setSuccess(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert severity="success" onClose={() => setSuccess(null)} variant="filled">
                            {success}
                        </Alert>
                    </Snackbar>
                </Container>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;