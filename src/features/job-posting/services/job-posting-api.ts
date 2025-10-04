import { apiClient } from '@/lib/api-client';

export interface JobPosting {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  remote_work: boolean;
  status: 'draft' | 'published' | 'closed';
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobPostingRequest {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  remote_work: boolean;
  application_deadline?: string;
}

export interface UpdateJobPostingRequest extends Partial<CreateJobPostingRequest> {
  status?: 'draft' | 'published' | 'closed';
}

export class JobPostingAPI {
  async createJobPosting(data: CreateJobPostingRequest): Promise<JobPosting> {
    const response = await apiClient.post<JobPosting>('/job-postings', data);
    return response.data;
  }

  async getJobPostings(): Promise<JobPosting[]> {
    const response = await apiClient.get<JobPosting[]>('/job-postings');
    return response.data;
  }

  async getJobPosting(id: string): Promise<JobPosting> {
    const response = await apiClient.get<JobPosting>(`/job-postings/${id}`);
    return response.data;
  }

  async updateJobPosting(id: string, data: UpdateJobPostingRequest): Promise<JobPosting> {
    const response = await apiClient.put<JobPosting>(`/job-postings/${id}`, data);
    return response.data;
  }

  async deleteJobPosting(id: string): Promise<void> {
    await apiClient.delete(`/job-postings/${id}`);
  }

  async publishJobPosting(id: string): Promise<JobPosting> {
    const response = await apiClient.patch<JobPosting>(`/job-postings/${id}/publish`);
    return response.data;
  }

  async closeJobPosting(id: string): Promise<JobPosting> {
    const response = await apiClient.patch<JobPosting>(`/job-postings/${id}/close`);
    return response.data;
  }

  async searchJobPostings(query: string): Promise<JobPosting[]> {
    const response = await apiClient.get<JobPosting[]>(`/job-postings/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const jobPostingAPI = new JobPostingAPI();
