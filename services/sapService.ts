// SAP Service Integration Layer
// This service handles communication with SAP systems

interface SAPConfig {
  baseUrl: string;
  clientId: string;
  serviceUrl: string;
  apiKey: string;
}

interface ODataResponse<T> {
  d: {
    results: T[];
  };
}

interface SAPEmployee {
  EmployeeID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Department: string;
  Position: string;
  HireDate: string;
  Status: string;
}

interface SAPDocument {
  DocumentID: string;
  Title: string;
  Type: string;
  CreatedBy: string;
  CreatedDate: string;
  Status: string;
  Size: number;
}

class SAPService {
  private config: SAPConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.EXPO_PUBLIC_SAP_BASE_URL || '',
      clientId: process.env.EXPO_PUBLIC_SAP_CLIENT_ID || '',
      serviceUrl: process.env.EXPO_PUBLIC_SAP_SERVICE_URL || '',
      apiKey: process.env.EXPO_PUBLIC_API_KEY || '',
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.serviceUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Requested-With': 'XMLHttpRequest',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`SAP API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SAP Service Error:', error);
      throw error;
    }
  }

  // Employee Management
  async getEmployees(): Promise<SAPEmployee[]> {
    try {
      const response = await this.makeRequest<ODataResponse<SAPEmployee>>('/EmployeeSet');
      return response.d.results;
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Return mock data for demo purposes
      return this.getMockEmployees();
    }
  }

  async getEmployee(employeeId: string): Promise<SAPEmployee | null> {
    try {
      const response = await this.makeRequest<{ d: SAPEmployee }>(`/EmployeeSet('${employeeId}')`);
      return response.d;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  async createEmployee(employee: Partial<SAPEmployee>): Promise<SAPEmployee> {
    try {
      const response = await this.makeRequest<{ d: SAPEmployee }>('/EmployeeSet', {
        method: 'POST',
        body: JSON.stringify(employee),
      });
      return response.d;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(employeeId: string, employee: Partial<SAPEmployee>): Promise<SAPEmployee> {
    try {
      const response = await this.makeRequest<{ d: SAPEmployee }>(`/EmployeeSet('${employeeId}')`, {
        method: 'PUT',
        body: JSON.stringify(employee),
      });
      return response.d;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Document Management
  async getDocuments(): Promise<SAPDocument[]> {
    try {
      const response = await this.makeRequest<ODataResponse<SAPDocument>>('/DocumentSet');
      return response.d.results;
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Return mock data for demo purposes
      return this.getMockDocuments();
    }
  }

  async getDocument(documentId: string): Promise<SAPDocument | null> {
    try {
      const response = await this.makeRequest<{ d: SAPDocument }>(`/DocumentSet('${documentId}')`);
      return response.d;
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }

  async uploadDocument(document: FormData): Promise<SAPDocument> {
    try {
      const response = await this.makeRequest<{ d: SAPDocument }>('/DocumentSet', {
        method: 'POST',
        body: document,
        headers: {
          // Don't set Content-Type for FormData, let the browser set it
        },
      });
      return response.d;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getAnalyticsData(period: string = 'month'): Promise<any> {
    try {
      const response = await this.makeRequest(`/AnalyticsSet?$filter=Period eq '${period}'`);
      return response;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return mock data for demo purposes
      return this.getMockAnalytics();
    }
  }

  // Workflow and Approvals
  async getPendingApprovals(): Promise<any[]> {
    try {
      const response = await this.makeRequest<ODataResponse<any>>('/ApprovalSet?$filter=Status eq \'Pending\'');
      return response.d.results;
    } catch (error) {
      console.error('Error fetching approvals:', error);
      return [];
    }
  }

  async approveRequest(requestId: string, comments?: string): Promise<boolean> {
    try {
      await this.makeRequest(`/ApprovalSet('${requestId}')/Approve`, {
        method: 'POST',
        body: JSON.stringify({ Comments: comments || '' }),
      });
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      return false;
    }
  }

  async rejectRequest(requestId: string, comments: string): Promise<boolean> {
    try {
      await this.makeRequest(`/ApprovalSet('${requestId}')/Reject`, {
        method: 'POST',
        body: JSON.stringify({ Comments: comments }),
      });
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      return false;
    }
  }

  // Mock data methods for demo purposes
  private getMockEmployees(): SAPEmployee[] {
    return [
      {
        EmployeeID: '001',
        FirstName: 'Sarah',
        LastName: 'Johnson',
        Email: 'sarah.johnson@company.com',
        Department: 'Engineering',
        Position: 'Senior Software Engineer',
        HireDate: '2022-03-15',
        Status: 'Active',
      },
      {
        EmployeeID: '002',
        FirstName: 'Michael',
        LastName: 'Chen',
        Email: 'michael.chen@company.com',
        Department: 'Marketing',
        Position: 'Product Manager',
        HireDate: '2021-08-22',
        Status: 'Active',
      },
    ];
  }

  private getMockDocuments(): SAPDocument[] {
    return [
      {
        DocumentID: '001',
        Title: 'Q4 Financial Report 2024',
        Type: 'PDF',
        CreatedBy: 'Sarah Johnson',
        CreatedDate: '2024-01-15',
        Status: 'Approved',
        Size: 2400000,
      },
      {
        DocumentID: '002',
        Title: 'Employee Handbook v3.2',
        Type: 'DOCX',
        CreatedBy: 'HR Department',
        CreatedDate: '2024-01-12',
        Status: 'Approved',
        Size: 1800000,
      },
    ];
  }

  private getMockAnalytics(): any {
    return {
      revenue: [
        { month: 'Jan', value: 65000 },
        { month: 'Feb', value: 78000 },
        { month: 'Mar', value: 52000 },
        { month: 'Apr', value: 89000 },
        { month: 'May', value: 95000 },
        { month: 'Jun', value: 87000 },
      ],
      departments: [
        { name: 'Sales', percentage: 35 },
        { name: 'Marketing', percentage: 25 },
        { name: 'Engineering', percentage: 20 },
        { name: 'HR', percentage: 12 },
        { name: 'Finance', percentage: 8 },
      ],
    };
  }
}

export const sapService = new SAPService();
export type { SAPEmployee, SAPDocument };