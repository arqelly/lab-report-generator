import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Box,
    Alert,
} from '@mui/material';
import type { FileUploadResponse } from '../types';

interface DataTableProps {
    data: FileUploadResponse;
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = data.columns;
    const previewData = data.preview;

    if (!previewData || previewData.length === 0) {
        return (
            <Alert severity="warning">
                Нет данных для отображения
            </Alert>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    Просмотр данных
                </Typography>
                <Box>
                    <Chip 
                        label={`Файл: ${data.filename}`} 
                        color="primary" 
                        variant="outlined" 
                        sx={{ mr: 1 }}
                    />
                    <Chip 
                        label={`Строк: ${data.shape[0]}`} 
                        color="secondary" 
                        variant="outlined" 
                        sx={{ mr: 1 }}
                    />
                    <Chip 
                        label={`Колонок: ${data.shape[1]}`} 
                        color="info" 
                        variant="outlined" 
                    />
                </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell 
                                    key={column}
                                    sx={{ 
                                        fontWeight: 'bold',
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    }}
                                >
                                    {column}
                                    {data.numeric_columns.includes(column) && (
                                        <Chip 
                                            label="числ." 
                                            size="small" 
                                            sx={{ ml: 1, bgcolor: 'white' }} 
                                        />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {previewData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => (
                                <TableRow key={rowIndex} hover>
                                    {columns.map((column) => (
                                        <TableCell key={`${rowIndex}-${column}`}>
                                            {typeof row[column] === 'number' 
                                                ? row[column].toFixed(4)
                                                : String(row[column])
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={previewData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
            />

            <Alert severity="info" sx={{ mt: 2 }}>
                Показаны первые {previewData.length} строк из {data.shape[0]}.
                Полные данные доступны при генерации отчета.
            </Alert>
        </Paper>
    );
};