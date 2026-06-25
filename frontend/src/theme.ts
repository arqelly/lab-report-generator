import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#165C7B', // Основной цвет (кнопки, акценты)
            light: '#4A90A4',
            dark: '#0E3D52',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#2C2C2E', // Цвет для заголовков и второстепенных элементов
            light: '#48484A',
            dark: '#1C1C1E',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F5F5F7', // Фон всей страницы
            paper: '#FFFFFF',    // Фон карточек и модальных окон
        },
        text: {
            primary: '#1C1C1E',
            secondary: '#3A3A3C',
        },
        error: {
            main: '#D32F2F',
        },
        warning: {
            main: '#ED6C02',
        },
        info: {
            main: '#0288D1',
        },
        success: {
            main: '#2E7D32',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2rem', fontWeight: 600 },
        h2: { fontSize: '1.75rem', fontWeight: 600 },
        h3: { fontSize: '1.5rem', fontWeight: 600 },
        h4: { fontSize: '1.25rem', fontWeight: 600 },
        h5: { fontSize: '1.125rem', fontWeight: 500 },
        h6: { fontSize: '1rem', fontWeight: 500 },
        body1: { fontSize: '0.875rem', lineHeight: 1.5 },
        body2: { fontSize: '0.8rem', lineHeight: 1.43 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#F5F5F7',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '2rem', // Скругленные кнопки, как в PDF
                    padding: '6px 16px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #EAEAEF',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #EAEAEF',
                    padding: '12px 16px',
                    fontSize: '0.875rem',
                },
                head: {
                    backgroundColor: '#F8F9FA',
                    fontWeight: 600,
                    color: '#1C1C1E',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#F8F9FA',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#1C1C1E',
                    boxShadow: '0 1px 0 0 #EAEAEF',
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    paddingLeft: '24px !important',
                    paddingRight: '24px !important',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#165C7B',
                    },
                },
                notchedOutline: {
                    borderColor: '#D1D1D6',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                },
            },
        },
    },
});