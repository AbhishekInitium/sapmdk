// SAP Sales Order Service Integration
// This service handles communication with SAP Sales Order API via proxy

interface SalesOrderItem {
  SalesOrderItem: string;
  Material: string;
  SalesOrderItemText: string;
  OrderQuantity: string;
  OrderQuantityUnit: string;
  NetAmount: string;
  TransactionCurrency: string;
}

interface SalesOrder {
  SalesOrder: string;
  SalesOrderType: string;
  SoldToParty: string;
  SoldToPartyName: string;
  CreationDate: string;
  CreatedByUser: string;
  TotalNetAmount: string;
  TransactionCurrency: string;
  SalesOrderDate: string;
  OverallDeliveryStatus: string;
  OverallBillingStatus: string;
  to_Item?: {
    results: SalesOrderItem[];
  };
}

interface SAPSalesOrderResponse {
  d: {
    results: SalesOrder[];
  };
}

interface SAPCredentials {
  username: string;
  password: string;
  apiUrl: string;
}

class SAPSalesOrderService {
  private credentials: SAPCredentials | null = null;

  setCredentials(credentials: SAPCredentials) {
    this.credentials = credentials;
  }

  clearCredentials() {
    this.credentials = null;
  }

  hasCredentials(): boolean {
    return this.credentials !== null;
  }

  private async makeProxyRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.credentials) {
      throw new Error('No credentials provided. Please authenticate first.');
    }

    // Use the proxy API route instead of direct SAP API call
    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set('username', this.credentials.username);
    url.searchParams.set('password', this.credentials.password);
    url.searchParams.set('apiUrl', this.credentials.apiUrl);
    
    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status} ${response.statusText}`);
        } else {
          // If not JSON, read as text for better error message
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Request failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON response but received: ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}...`);
      }

      return await response.json();
    } catch (error) {
      console.error('SAP Sales Order Service Error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.credentials) {
      throw new Error('No credentials provided');
    }

    try {
      const response = await fetch('/api/sap/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.credentials),
      });

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Connection test failed: ${response.status} ${response.statusText}`);
        } else {
          // If not JSON, read as text for better error message
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Connection test failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON response but received: ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}...`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Connection test failed');
      }

      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  async getSalesOrders(top: number = 50): Promise<SalesOrder[]> {
    if (!this.credentials) {
      // Return mock data when no credentials are provided
      return this.getMockSalesOrders();
    }

    try {
      const response = await this.makeProxyRequest<SAPSalesOrderResponse>(
        `/api/sap/sales-orders?top=${top}`
      );
      return response.d.results;
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      throw error;
    }
  }

  async getSalesOrder(salesOrderId: string): Promise<SalesOrder | null> {
    if (!this.credentials) {
      return null;
    }

    try {
      // For individual sales order, we'd need another proxy endpoint
      // For now, return null or implement if needed
      return null;
    } catch (error) {
      console.error('Error fetching sales order:', error);
      return null;
    }
  }

  async getSalesOrdersByCustomer(customerId: string): Promise<SalesOrder[]> {
    if (!this.credentials) {
      return [];
    }

    try {
      // For filtered sales orders, we'd need another proxy endpoint
      // For now, return empty array or implement if needed
      return [];
    } catch (error) {
      console.error('Error fetching sales orders by customer:', error);
      return [];
    }
  }

  async getSalesOrdersByDateRange(startDate: string, endDate: string): Promise<SalesOrder[]> {
    if (!this.credentials) {
      return [];
    }

    try {
      // For date range filtering, we'd need another proxy endpoint
      // For now, return empty array or implement if needed
      return [];
    } catch (error) {
      console.error('Error fetching sales orders by date range:', error);
      return [];
    }
  }

  // Mock data for demo purposes
  private getMockSalesOrders(): SalesOrder[] {
    return [
      {
        SalesOrder: '0000000001',
        SalesOrderType: 'OR',
        SoldToParty: '0000100001',
        SoldToPartyName: 'ABC Corporation',
        CreationDate: '/Date(1704067200000)/',
        CreatedByUser: 'SALES001',
        TotalNetAmount: '15750.00',
        TransactionCurrency: 'USD',
        SalesOrderDate: '/Date(1704067200000)/',
        OverallDeliveryStatus: 'A',
        OverallBillingStatus: 'A',
        to_Item: {
          results: [
            {
              SalesOrderItem: '000010',
              Material: 'MAT001',
              SalesOrderItemText: 'Premium Widget Set',
              OrderQuantity: '5.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '7500.00',
              TransactionCurrency: 'USD',
            },
            {
              SalesOrderItem: '000020',
              Material: 'MAT002',
              SalesOrderItemText: 'Standard Widget',
              OrderQuantity: '10.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '8250.00',
              TransactionCurrency: 'USD',
            },
          ],
        },
      },
      {
        SalesOrder: '0000000002',
        SalesOrderType: 'OR',
        SoldToParty: '0000100002',
        SoldToPartyName: 'XYZ Industries',
        CreationDate: '/Date(1703980800000)/',
        CreatedByUser: 'SALES002',
        TotalNetAmount: '28900.00',
        TransactionCurrency: 'USD',
        SalesOrderDate: '/Date(1703980800000)/',
        OverallDeliveryStatus: 'B',
        OverallBillingStatus: 'A',
        to_Item: {
          results: [
            {
              SalesOrderItem: '000010',
              Material: 'MAT003',
              SalesOrderItemText: 'Enterprise Solution Package',
              OrderQuantity: '1.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '28900.00',
              TransactionCurrency: 'USD',
            },
          ],
        },
      },
      {
        SalesOrder: '0000000003',
        SalesOrderType: 'OR',
        SoldToParty: '0000100003',
        SoldToPartyName: 'Tech Solutions Ltd',
        CreationDate: '/Date(1703894400000)/',
        CreatedByUser: 'SALES001',
        TotalNetAmount: '12300.00',
        TransactionCurrency: 'USD',
        SalesOrderDate: '/Date(1703894400000)/',
        OverallDeliveryStatus: 'C',
        OverallBillingStatus: 'B',
        to_Item: {
          results: [
            {
              SalesOrderItem: '000010',
              Material: 'MAT004',
              SalesOrderItemText: 'Software License',
              OrderQuantity: '3.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '9000.00',
              TransactionCurrency: 'USD',
            },
            {
              SalesOrderItem: '000020',
              Material: 'MAT005',
              SalesOrderItemText: 'Support Package',
              OrderQuantity: '1.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '3300.00',
              TransactionCurrency: 'USD',
            },
          ],
        },
      },
      {
        SalesOrder: '0000000004',
        SalesOrderType: 'OR',
        SoldToParty: '0000100004',
        SoldToPartyName: 'Global Manufacturing Inc',
        CreationDate: '/Date(1703808000000)/',
        CreatedByUser: 'SALES003',
        TotalNetAmount: '45200.00',
        TransactionCurrency: 'USD',
        SalesOrderDate: '/Date(1703808000000)/',
        OverallDeliveryStatus: 'A',
        OverallBillingStatus: 'A',
        to_Item: {
          results: [
            {
              SalesOrderItem: '000010',
              Material: 'MAT006',
              SalesOrderItemText: 'Industrial Equipment',
              OrderQuantity: '2.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '35000.00',
              TransactionCurrency: 'USD',
            },
            {
              SalesOrderItem: '000020',
              Material: 'MAT007',
              SalesOrderItemText: 'Installation Service',
              OrderQuantity: '1.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '10200.00',
              TransactionCurrency: 'USD',
            },
          ],
        },
      },
      {
        SalesOrder: '0000000005',
        SalesOrderType: 'OR',
        SoldToParty: '0000100005',
        SoldToPartyName: 'Retail Chain Solutions',
        CreationDate: '/Date(1703721600000)/',
        CreatedByUser: 'SALES002',
        TotalNetAmount: '8750.00',
        TransactionCurrency: 'USD',
        SalesOrderDate: '/Date(1703721600000)/',
        OverallDeliveryStatus: 'C',
        OverallBillingStatus: 'C',
        to_Item: {
          results: [
            {
              SalesOrderItem: '000010',
              Material: 'MAT008',
              SalesOrderItemText: 'POS System',
              OrderQuantity: '5.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '7500.00',
              TransactionCurrency: 'USD',
            },
            {
              SalesOrderItem: '000020',
              Material: 'MAT009',
              SalesOrderItemText: 'Training Package',
              OrderQuantity: '1.000',
              OrderQuantityUnit: 'EA',
              NetAmount: '1250.00',
              TransactionCurrency: 'USD',
            },
          ],
        },
      },
    ];
  }

  // Utility methods
  formatSAPDate(sapDate: string): string {
    if (sapDate.includes('/Date(')) {
      const timestamp = parseInt(sapDate.match(/\d+/)?.[0] || '0');
      return new Date(timestamp).toLocaleDateString();
    }
    return sapDate;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'A':
        return 'Not Processed';
      case 'B':
        return 'Partially Processed';
      case 'C':
        return 'Completely Processed';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'A':
        return '#f59e0b'; // Yellow
      case 'B':
        return '#3b82f6'; // Blue
      case 'C':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  }
}

export const sapSalesOrderService = new SAPSalesOrderService();
export type { SalesOrder, SalesOrderItem, SAPCredentials };