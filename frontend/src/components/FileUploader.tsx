import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Paper,
    Typography,
    Box,
    LinearProgress,
    Alert,
    Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import type { FileUploadResponse } from '../types';

interface FileUploaderProps {
    onUploadSuccess: (data: FileUploadResponse) => void;
    onError: (message: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
    onUploadSuccess, 
    onError 
}) => {
    const uploadMutation = useMutation({
        mutationFn: api.uploadFile,
        onSuccess: (data) => {
            onUploadSuccess(data);
        },
        onError: (error: Error) => {
            onError(error.message);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            uploadMutation.mutate(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/plain': ['.txt'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10 MB
    });

    const selectedFile = acceptedFiles[0];

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.400',
                    borderRadius: 2,
                    p: 4,
                    mb: 3,
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                    },
                }}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    {isDragActive
                        ? 'Отпустите файл для загрузки'
                        : 'Перетащите файл с данными сюда'}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    или кликните для выбора файла
                </Typography>
                <Button variant="contained" startIcon={<InsertDriveFileIcon />}>
                    Выбрать файл
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Поддерживаемые форматы: CSV, Excel (.xlsx, .xls), TXT (до 10 MB)
                </Typography>
            </Box>

            {selectedFile && !uploadMutation.isSuccess && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Выбран файл: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Alert>
            )}

            {uploadMutation.isPending && (
                <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Загрузка и обработка файла...
                    </Typography>
                </Box>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                    Пример формата данных:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1,
                    mt: 1,
                    fontFamily: 'monospace'
                }}>
                    X,Y,Experiment<br/>
                    1,2.3,A<br/>
                    2,4.1,A<br/>
                    3,5.8,B<br/>
                    4,7.2,B<br/>
                    5,9.0,C
                </Typography>
            </Alert>
        </Paper>
    );
};