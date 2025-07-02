// SAP Sales Order Service Integration
// This service handles communication with SAP Sales Order API

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

class SAPSalesOrderService {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_SAP_SALES_ORDER_API || 'https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SALES_ORDER_SRV';
    this.username = process.env.EXPO_PUBLIC_SAP_USERNAME || '';
    this.password = process.env.EXPO_PUBLIC_SAP_PASSWORD || '';
  }

  private getAuthHeaders(): HeadersInit {
    const credentials = btoa(`${this.username}:${this.password}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`SAP API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SAP Sales Order Service Error:', error);
      throw error;
    }
  }

  async getSalesOrders(top: number = 50): Promise<SalesOrder[]> {
    try {
      const response = await this.makeRequest<SAPSalesOrderResponse>(
        `/A_SalesOrder?$top=${top}&$expand=to_Item&$orderby=CreationDate desc`
      );
      return response.d.results;
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      // Return mock data for demo purposes when API fails
      return this.getMockSalesOrders();
    }
  }

  async getSalesOrder(salesOrderId: string): Promise<SalesOrder | null> {
    try {
      const response = await this.makeRequest<{ d: SalesOrder }>(
        `/A_SalesOrder('${salesOrderId}')?$expand=to_Item`
      );
      return response.d;
    } catch (error) {
      console.error('Error fetching sales order:', error);
      return null;
    }
  }

  async getSalesOrdersByCustomer(customerId: string): Promise<SalesOrder[]> {
    try {
      const response = await this.makeRequest<SAPSalesOrderResponse>(
        `/A_SalesOrder?$filter=SoldToParty eq '${customerId}'&$expand=to_Item&$orderby=CreationDate desc`
      );
      return response.d.results;
    } catch (error) {
      console.error('Error fetching sales orders by customer:', error);
      return [];
    }
  }

  async getSalesOrdersByDateRange(startDate: string, endDate: string): Promise<SalesOrder[]> {
    try {
      const response = await this.makeRequest<SAPSalesOrderResponse>(
        `/A_SalesOrder?$filter=CreationDate ge datetime'${startDate}' and CreationDate le datetime'${endDate}'&$expand=to_Item&$orderby=CreationDate desc`
      );
      return response.d.results;
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
export type { SalesOrder, SalesOrderItem };