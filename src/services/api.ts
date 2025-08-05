// API Service for centralized backend communication
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_URL || import.meta.env.VITE_API_URL;
console.log("API_BASE_URL", API_BASE_URL);

// Check if we're in development mode without a backend
const isDevelopmentWithoutBackend = !API_BASE_URL && import.meta.env.DEV;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiService {
  private defaultTimeout = 30000; // 30 seconds

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // If no API URL is configured and we're in development, return mock responses
    if (isDevelopmentWithoutBackend) {
      console.warn("No backend API configured. Running in frontend-only mode.");
      return this.getMockResponse<T>(endpoint, options);
    }

    if (!API_BASE_URL) {
      return {
        success: false,
        error:
          "API URL not configured. Please set VITE_REACT_APP_API_URL or VITE_API_URL environment variable.",
      };
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const timeout = options.timeout || this.defaultTimeout;

    const config: RequestInit = {
      credentials: "include", // <-- This line ensures cookies (session) are sent with requests
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    // If you want to set a custom session header (e.g., for JWT or custom session id):
    // config.headers['Authorization'] = `Bearer ${yourToken}`;
    // or
    // config.headers['x-session-id'] = yourSessionId;

    // Remove custom timeout from options
    delete (config as any).timeout;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return {
        success: true,
        data: data?.data || data,
        message: data?.message,
        ...(data?.pagination ? { pagination: data.pagination } : {}),
      };
    } catch (error) {
      console.error("API Error:", error);

      // Provide more specific error messages for common issues
      let errorMessage = "Unknown error occurred";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection and ensure the backend API is running.";
      } else if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Mock responses for development without backend
  private getMockResponse<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different responses based on endpoint
        if (endpoint.includes("/auth/verify")) {
          resolve({
            success: false,
            error:
              "Backend API not configured. Please set up your backend server.",
          });
        } else if (endpoint.includes("/auth/me")) {
          resolve({
            success: false,
            error: "Backend API not configured",
          });
        } else if (endpoint.includes("/auth/linkedin/connect")) {
          resolve({
            success: true,
            message: "LinkedIn cookie saved successfully (mock)",
          });
        } else {
          resolve({
            success: false,
            error: "Backend API not configured",
          });
        }
      }, 500); // Simulate network delay
    });
  }

  async testLinkedInCookie(
    cookie: string
  ): Promise<ApiResponse<{ isVerified: boolean }>> {
    console.log("*******************************88888");
    return this.request("/auth/linkedin/connect", {
      method: "POST",
      body: JSON.stringify({
        linkedinCookie: cookie,
        mode: "test",
      }),
    });
  }

  async fetchOptions(fieldId: string, query: string): Promise<any> {
    const url = `/filter/options/${fieldId}?fieldId=${fieldId}&query=${encodeURIComponent(
      query
    )}`;
    return this.request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async importFromLinkedIn(id: string): Promise<any> {
    const url = `/lead/batch/${id}`;
    return this.request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async saveFilters(filters: any, name: string): Promise<any> {
    const url = `/filter/save`;
    return this.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters,
        name,
      }),
    });
  }

  async getFilters(): Promise<ApiResponse<any[]>> {
    return this.request(`/filter/list`, {
      method: "GET",
    });
  }

  async getFilterById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/filter/load/${id}`, {
      method: "GET",
    });
  }
  async submitLinkedInCookie(
    cookie: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request("/auth/linkedin/connect", {
      method: "POST",
      body: JSON.stringify({
        linkedinCookie: cookie,
        mode: "submit",
      }),
    });
  }

  // Authentication APIs
  async verifyIdentity(): Promise<ApiResponse<{ redirectUrl: string }>> {
    return this.request("/auth/initiate", {
      method: "GET",
    });
  }

  async checkAuthStatus(): Promise<
    ApiResponse<{ isAuthenticated: boolean; user?: any }>
  > {
    return this.request("/auth/me", {
      method: "GET",
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async handleAuthCallback(
    code: string,
    state?: string
  ): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request("/auth/callback", {
      method: "POST",
      body: JSON.stringify({ code, state }),
    });
  }

  // User APIs
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request("/user/profile");
  }

  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async uploadUserAvatar(
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.request("/user/avatar", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // LinkedIn Setup APIs
  async saveLinkedInCookie(cookie: string): Promise<ApiResponse> {
    return this.request("/auth/linkedin/connect", {
      method: "POST",
      body: JSON.stringify({ cookie }),
    });
  }

  async validateLinkedInCookie(): Promise<ApiResponse<{ isValid: boolean }>> {
    return this.request("/linkedin/validate");
  }

  async getLinkedInStatus(): Promise<
    ApiResponse<{ isConnected: boolean; lastValidated?: string }>
  > {
    return this.request("/linkedin/status");
  }

  async disconnectLinkedIn(): Promise<ApiResponse> {
    return this.request("/linkedin/disconnect", {
      method: "POST",
    });
  }

  // Lead Management APIs
  async getLeads(
    filters?: any,
    page = 1,
    limit = 50
  ): Promise<
    ApiResponse<{
      items: any[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/leads?${params.toString()}`);
  }

  async getLead(id: string): Promise<ApiResponse<any>> {
    return this.request(`/leads/${id}`);
  }

  async createLead(data: any): Promise<ApiResponse<any>> {
    return this.request("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string): Promise<ApiResponse> {
    return this.request(`/leads/${id}`, {
      method: "DELETE",
    });
  }

  async bulkUpdateLeads(ids: string[], data: any): Promise<ApiResponse> {
    return this.request("/leads/bulk-update", {
      method: "PUT",
      body: JSON.stringify({ ids, data }),
    });
  }

  async bulkDeleteLeads(ids: string[]): Promise<ApiResponse> {
    return this.request("/leads/bulk-delete", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }

  async exportLeads(
    format: "csv" | "xlsx" = "csv",
    filters?: any
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.request(`/leads/export`, {
      method: "POST",
      body: JSON.stringify({ format, filters }),
    });
  }

  async importLeads(
    file: File
  ): Promise<ApiResponse<{ imported: number; errors: any[] }>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request("/leads/import", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Lead Filters APIs
  async saveLeadFilters(filters: any): Promise<ApiResponse> {
    return this.request("/lead-filters", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async getLeadFilters(): Promise<ApiResponse<any>> {
    return this.request("/lead-filters");
  }

  async deleteLeadFilter(id: string): Promise<ApiResponse> {
    return this.request(`/lead-filters/${id}`, {
      method: "DELETE",
    });
  }

  async startLeadGeneration(
    filters: any
  ): Promise<ApiResponse<{ workflowId: string }>> {
    return this.request("/lead-generation/start", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async estimateLeadCount(
    filters: any
  ): Promise<ApiResponse<{ estimatedCount: number }>> {
    return this.request("/lead-generation/estimate", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  // History APIs
  async getHistory(
    page = 1,
    limit = 10,
    filters?: any
  ): Promise<
    ApiResponse<{
      items: any[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/history?${params.toString()}`);
  }

  async getHistoryItem(id: string): Promise<ApiResponse<any>> {
    return this.request(`/history/${id}`);
  }

  async deleteHistoryItem(id: string): Promise<ApiResponse> {
    return this.request(`/history/${id}`, {
      method: "DELETE",
    });
  }

  async clearHistory(): Promise<ApiResponse> {
    return this.request("/history/clear", {
      method: "DELETE",
    });
  }

  // Workflow APIs
  async getWorkflows(status?: string): Promise<ApiResponse<any[]>> {
    const params = status ? `?status=${status}` : "";
    return this.request(`/workflows${params}`);
  }

  async getWorkflow(id: string): Promise<ApiResponse<any>> {
    return this.request(`/workflows/${id}`);
  }

  async getWorkflowStatus(id: string): Promise<ApiResponse<any>> {
    return this.request(`/workflows/${id}/status`);
  }

  async pauseWorkflow(id: string): Promise<ApiResponse> {
    return this.request(`/workflows/${id}/pause`, {
      method: "POST",
    });
  }

  async resumeWorkflow(id: string): Promise<ApiResponse> {
    return this.request(`/workflows/${id}/resume`, {
      method: "POST",
    });
  }

  async cancelWorkflow(id: string): Promise<ApiResponse> {
    return this.request(`/workflows/${id}/cancel`, {
      method: "POST",
    });
  }

  async retryWorkflow(id: string): Promise<ApiResponse> {
    return this.request(`/workflows/${id}/retry`, {
      method: "POST",
    });
  }

  async deleteWorkflow(id: string): Promise<ApiResponse> {
    return this.request(`/workflows/${id}`, {
      method: "DELETE",
    });
  }

  // Settings APIs
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request("/settings");
  }

  async updateSettings(settings: any): Promise<ApiResponse> {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  async resetSettings(): Promise<ApiResponse> {
    return this.request("/settings/reset", {
      method: "POST",
    });
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request("/dashboard/stats");
  }

  async getRecentActivity(limit = 10): Promise<ApiResponse<any[]>> {
    return this.request(`/dashboard/activity?limit=${limit}`);
  }

  async getDashboardCharts(period = "30d"): Promise<ApiResponse<any>> {
    return this.request(`/dashboard/charts?period=${period}`);
  }

  // Analytics APIs
  async getAnalytics(
    period = "30d",
    metrics?: string[]
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams({ period });
    if (metrics?.length) {
      params.append("metrics", metrics.join(","));
    }
    return this.request(`/analytics?${params.toString()}`);
  }

  async getLeadAnalytics(leadId: string): Promise<ApiResponse<any>> {
    return this.request(`/analytics/leads/${leadId}`);
  }

  async getCampaignAnalytics(campaignId: string): Promise<ApiResponse<any>> {
    return this.request(`/analytics/campaigns/${campaignId}`);
  }

  // Notification APIs
  async getNotifications(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<{ items: any[]; total: number; unread: number }>> {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    return this.request(`/notifications/${id}/read`, {
      method: "POST",
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse> {
    return this.request("/notifications/read-all", {
      method: "POST",
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse> {
    return this.request(`/notifications/${id}`, {
      method: "DELETE",
    });
  }

  async verifyLinkedInAccess(): Promise<ApiResponse> {
    return this.request(`/auth/linkedin/status`, {
      method: "GET",
    });
  }

  // Health check
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request("/health");
  }

  // Utility method for file downloads
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }
  async getProfile(id: string): Promise<ApiResponse> {
    return this.request(`/user/${id}`, {
      method: "GET",
    });
  }

  async leadProfile(id: string): Promise<ApiResponse> {
    return this.request(`/lead/profile/${id}`, {
      method: "GET",
    });
  }

  async updateProfile(id: string, payload: any): Promise<ApiResponse> {
    return this.request(`/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async updateLinkedInCookie(
    cookie: string,
    cookieStatus: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.request("/user/save/cookie", {
      method: "POST",
      body: JSON.stringify({ cookie, cookieStatus }),
    });
  }

  async getLeadsData(data: any): Promise<ApiResponse<any[]>> {
    console.log("Fetching leads data for user ID:", JSON.stringify(data));
    return this.request(`/extract/leads-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async createLeadBatch(data: any): Promise<ApiResponse<any[]>> {
    console.log("Fetching leads data for user ID:", JSON.stringify(data));
    return this.request(`/lead/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  async getFilterOptions(data: any): Promise<ApiResponse<any[]>> {
    console.log("Fetching leads data for user ID:", JSON.stringify(data));
    return this.request(`/extract/lead/options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  async deleteBatch(batchId: any): Promise<ApiResponse<any[]>> {
    console.log("Fetching leads data for user ID:", JSON.stringify(batchId));
    return this.request(`/lead/batch/${batchId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
