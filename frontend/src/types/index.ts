export interface FileUploadResponse {
    filename: string;
    columns: string[];
    numeric_columns: string[];
    preview: Record<string, any>[];
    shape: [number, number];
    message: string;
}

export interface StatisticsResponse {
    [column: string]: {
        mean: number;
        std: number;
        min: number;
        max: number;
        median: number;
        q1: number;
        q3: number;
        count: number;
    };
}

export interface PlotRequest {
    x_column: string;
    y_column: string;
    plot_type: 'line' | 'scatter' | 'bar' | 'box';
    title?: string;
}

export interface ReportRequest {
    title: string;
    student_name: string;
    group: string;
    objective: string;
    theory: string;
    analysis: string;
    conclusions: string;
    additional_notes?: string;
}

export interface ReportResponse {
    report_path: string;
    download_url: string;
    message: string;
}

export interface DataInfo {
    shape: [number, number];
    has_data: boolean;
    filename: string | null;
    columns_count: number;
    rows_count: number;
}