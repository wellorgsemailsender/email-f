const API_URL = 'https://emailsender-zhym.onrender.com';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data, message: data.message };
      } else {
        return { success: false, error: data.error || 'Request failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  // Auto-reply specific method
  async sendAutoReply(responseId: string, templateType: string = 'default'): Promise<ApiResponse> {
    return this.request('/auto-reply', {
      method: 'POST',
      body: JSON.stringify({
        response_id: responseId,
        reply_template: templateType
      })
    });
  }

  // Get email responses
  async getEmailResponses(): Promise<ApiResponse> {
    return this.request('/email-responses');
  }

  // Get pending reviews
  async getPendingReviews(): Promise<ApiResponse> {
    return this.request('/pending-reviews');
  }

  // Complete a manual review
  async completeReview(reviewId: string, actionTaken: string, notes: string = ''): Promise<ApiResponse> {
    return this.request(`/manual-review/${reviewId}/process`, {
      method: 'POST',
      body: JSON.stringify({
        action: actionTaken,
        notes: notes
      })
    });
  }
}

export const apiClient = new ApiClient(); 