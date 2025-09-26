export interface ResumeAnalysis {
  id: string;
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: {
    matched: string[];
    missing: string[];
  };
  sections: {
    contact: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  atsCompatibility: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  createdAt: Date;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
  keywords: string[];
  requirements: string[];
  createdAt: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  createdAt: Date;
}

export interface AnalysisSession {
  id: string;
  userId: string;
  resumeFile: UploadedFile;
  jobDescription: JobDescription;
  analysis: ResumeAnalysis;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  createdAt: Date;
}
