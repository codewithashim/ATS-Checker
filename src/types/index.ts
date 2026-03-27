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

// Re-export auth types from features
export type { 
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  AuthError,
  FormFieldError,
  ValidationResult,
  AuthContextType
} from '@/features/auth';

export interface AnalysisSession {
  id: string;
  userId: string;
  resumeFile: UploadedFile;
  jobDescription: JobDescription;
  analysis: ResumeAnalysis;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  createdAt: Date;
}
