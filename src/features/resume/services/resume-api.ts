import { apiClient } from '@/lib/api-client';

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ResumeAnalysis {
  id: string;
  resume_id: string;
  analysis_type: string;
  score: number;
  details: {
    ats_checks: Record<string, any>;
    strengths: string[];
    weaknesses: string[];
    keyword_analysis: Record<string, any>;
    content_length: number;
    word_count: number;
    extracted_keywords: string[];
    ai_suggestions: any[];
  };
  recommendations: {
    ai_recommendations: string[];
    improvement_suggestions: string[];
    priority: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface UploadResumeResponse {
  resume: Resume;
  message: string;
}

export interface AnalysisRequest {
  analysis_type: string;
  job_posting_id?: string;
}

export class ResumeAPI {
  async uploadResume(file: File): Promise<UploadResumeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to upload resume');
    }

    return await response.json();
  }

  async getResumes(): Promise<Resume[]> {
    const response = await apiClient.get<Resume[]>('/resumes');
    return response.data;
  }

  async getResume(id: string): Promise<Resume> {
    const response = await apiClient.get<Resume>(`/resumes/${id}`);
    return response.data;
  }

  async deleteResume(id: string): Promise<void> {
    await apiClient.delete(`/resumes/${id}`);
  }

  async analyzeResume(resumeId: string, analysisRequest: AnalysisRequest): Promise<ResumeAnalysis> {
    const response = await apiClient.post<ResumeAnalysis>(
      `/resumes/${resumeId}/analyze`,
      analysisRequest
    );
    return response.data;
  }

  async getResumeAnalyses(resumeId: string): Promise<ResumeAnalysis[]> {
    const response = await apiClient.get<ResumeAnalysis[]>(`/resumes/${resumeId}/analyses`);
    return response.data;
  }

  async getAnalysis(analysisId: string): Promise<ResumeAnalysis> {
    const response = await apiClient.get<ResumeAnalysis>(`/resumes/analyses/${analysisId}`);
    return response.data;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
}

export const resumeAPI = new ResumeAPI();
