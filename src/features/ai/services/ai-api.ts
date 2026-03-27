import { apiClient } from '@/lib/api-client';

export interface ResumeAnalysisRequest {
  resume_content: string;
  job_description?: string;
}

export interface KeywordExtractionRequest {
  text: string;
}

export interface ResumeImprovementRequest {
  resume_content: string;
  job_description?: string;
}

export interface JobMatchRequest {
  resume_content: string;
  job_description: string;
}

export interface AIAnalysisResult {
  overall_score: number;
  ats_checks: Record<string, any>;
  strengths: string[];
  weaknesses: string[];
  keyword_analysis: Record<string, any>;
  recommendations: string[];
}

export interface KeywordExtractionResult {
  keywords: string[];
}

export interface ResumeImprovementResult {
  action_items: string[];
}

export interface JobMatchResult {
  match_score: number;
  match_details: Record<string, any>;
}

export class AIAPI {
  async analyzeResume(data: ResumeAnalysisRequest): Promise<AIAnalysisResult> {
    const response = await apiClient.post<AIAnalysisResult>('/ai/analyze-resume', data);
    return response.data;
  }

  async extractKeywords(data: KeywordExtractionRequest): Promise<KeywordExtractionResult> {
    const response = await apiClient.post<KeywordExtractionResult>('/ai/extract-keywords', data);
    return response.data;
  }

  async improveResume(data: ResumeImprovementRequest): Promise<ResumeImprovementResult> {
    const response = await apiClient.post<ResumeImprovementResult>('/ai/improve-resume', data);
    return response.data;
  }

  async matchJob(data: JobMatchRequest): Promise<JobMatchResult> {
    const response = await apiClient.post<JobMatchResult>('/ai/match-job', data);
    return response.data;
  }

  async getAIStatus(): Promise<{ status: string; model: string; ai_available: boolean }> {
    const response = await apiClient.get<{ status: string; model: string; ai_available: boolean }>('/ai/ai-status');
    return response.data;
  }
}

export const aiAPI = new AIAPI();
