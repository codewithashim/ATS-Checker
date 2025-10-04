import { User } from '../types';
import { authAPI } from '../services/auth-api';

export interface SessionInfo {
  user: User;
  lastActivity: number;
  sessionId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

export class SessionManager {
  private static readonly SESSION_KEY = 'auth_session';
  private static readonly ACTIVITY_KEY = 'last_activity';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_IDLE_TIME = 2 * 60 * 60 * 1000; // 2 hours
  private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

  private static activityCheckInterval: NodeJS.Timeout | null = null;
  private static refreshTimeout: NodeJS.Timeout | null = null;

  static initialize(): void {
    this.startActivityMonitoring();
    this.scheduleTokenRefresh();
  }

  static cleanup(): void {
    this.stopActivityMonitoring();
    this.clearRefreshTimeout();
  }

  static saveSession(sessionInfo: SessionInfo): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionInfo));
      this.updateLastActivity();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  static getSession(): SessionInfo | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData) as SessionInfo;
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      this.clearSession();
      return null;
    }
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.ACTIVITY_KEY);
      this.cleanup();
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  static updateLastActivity(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to update last activity:', error);
    }
  }

  static getLastActivity(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const lastActivity = localStorage.getItem(this.ACTIVITY_KEY);
      return lastActivity ? parseInt(lastActivity, 10) : 0;
    } catch (error) {
      console.error('Failed to get last activity:', error);
      return 0;
    }
  }

  static isSessionExpired(session?: SessionInfo): boolean {
    if (!session) {
      session = this.getSession();
    }
    
    if (!session) return true;
    
    const now = Date.now();
    const lastActivity = this.getLastActivity();
    
    // Check if session has been idle too long
    if (now - lastActivity > this.MAX_IDLE_TIME) {
      return true;
    }
    
    // Check if session timeout has been reached
    if (now - session.lastActivity > this.SESSION_TIMEOUT) {
      return true;
    }
    
    return false;
  }

  static isTokenNearExpiry(): boolean {
    const token = authAPI.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - now;
      
      return timeUntilExpiry < this.REFRESH_THRESHOLD / 1000;
    } catch {
      return true;
    }
  }

  static async refreshSession(): Promise<boolean> {
    try {
      if (!authAPI.isAuthenticated()) {
        return false;
      }
      
      const refreshed = await authAPI.refreshToken();
      if (refreshed) {
        const session = this.getSession();
        if (session) {
          session.lastActivity = Date.now();
          this.saveSession(session);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  }

  static startActivityMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    // Check activity every minute
    this.activityCheckInterval = setInterval(() => {
      const session = this.getSession();
      if (session && this.isSessionExpired(session)) {
        this.clearSession();
        // Redirect to login or show session expired message
        this.handleSessionExpired();
      }
    }, 60000);

    // Update activity on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const updateActivity = () => {
      this.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  static stopActivityMonitoring(): void {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
  }

  static scheduleTokenRefresh(): void {
    this.clearRefreshTimeout();
    
    if (!authAPI.isAuthenticated()) return;
    
    // Check if token needs refresh every 5 minutes
    this.refreshTimeout = setInterval(async () => {
      if (this.isTokenNearExpiry()) {
        const refreshed = await this.refreshSession();
        if (!refreshed) {
          this.clearSession();
          this.handleSessionExpired();
        }
      }
    }, 5 * 60 * 1000);
  }

  static clearRefreshTimeout(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  static handleSessionExpired(): void {
    // Clear any existing alerts or modals
    const alerts = document.querySelectorAll('[role="alert"]');
    alerts.forEach(alert => alert.remove());
    
    // Show session expired message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50';
    message.innerHTML = `
      <div class="flex items-center">
        <div class="flex-1">
          <p class="font-medium">Session Expired</p>
          <p class="text-sm">Your session has expired. Please sign in again.</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove(); window.location.href='/auth/login'" 
                class="ml-4 text-yellow-700 hover:text-yellow-900">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto redirect after 5 seconds
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 5000);
  }

  static getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      online: navigator.onLine
    };
  }

  static generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  static async createSession(user: User): Promise<SessionInfo> {
    const sessionInfo: SessionInfo = {
      user,
      lastActivity: Date.now(),
      sessionId: this.generateSessionId(),
      deviceInfo: this.getDeviceInfo()
    };
    
    this.saveSession(sessionInfo);
    this.initialize();
    
    return sessionInfo;
  }

  static isConcurrentSession(): boolean {
    // Check if there are multiple sessions for the same user
    // This is a simplified check - in a real app, you'd check against server
    const session = this.getSession();
    if (!session) return false;
    
    // For now, just check if session is valid
    return !this.isSessionExpired(session);
  }

  static async handleConcurrentLogin(): Promise<void> {
    // Clear current session
    this.clearSession();
    
    // Show message about concurrent login
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50';
    message.innerHTML = `
      <div class="flex items-center">
        <div class="flex-1">
          <p class="font-medium">New Login Detected</p>
          <p class="text-sm">You have been signed out due to a new login from another device.</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove(); window.location.href='/auth/login'" 
                class="ml-4 text-blue-700 hover:text-blue-900">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 3000);
  }
}
