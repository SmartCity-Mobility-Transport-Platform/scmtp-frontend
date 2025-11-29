import axios from 'axios';

const API_BASE_URLS = {
  user: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3000',
  route: process.env.NEXT_PUBLIC_ROUTE_SERVICE_URL || 'http://localhost:4000',
  ticketing: process.env.NEXT_PUBLIC_TICKETING_SERVICE_URL || 'http://localhost:3002',
  payment: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:3004',
  wallet: process.env.NEXT_PUBLIC_WALLET_SERVICE_URL || 'http://localhost:3003',
};

// Create axios instances with default config
const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token interceptor
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export const userApi = createApiClient(API_BASE_URLS.user);
export const routeApi = createApiClient(API_BASE_URLS.route);
export const ticketingApi = createApiClient(API_BASE_URLS.ticketing);
export const paymentApi = createApiClient(API_BASE_URLS.payment);
export const walletApi = createApiClient(API_BASE_URLS.wallet);

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string; name?: string; phone?: string }) => {
    const response = await userApi.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await userApi.post('/auth/login', data);
    return response.data;
  },
};

// User API
export const userServiceApi = {
  getProfile: async () => {
    const response = await userApi.get('/users/me');
    return response.data;
  },
  updateProfile: async (data: { name?: string; phone?: string; preferences?: Record<string, unknown> }) => {
    const response = await userApi.put('/users/me', data);
    return response.data;
  },
};

// Route API (GraphQL) - Using Next.js API route as proxy to avoid CORS issues
export const routeServiceApi = {
  query: async (query: string, variables?: Record<string, unknown>) => {
    // Use Next.js API route as proxy instead of direct GraphQL call
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    return data.data;
  },
};

// Ticketing API
export const ticketingServiceApi = {
  bookTicket: async (data: {
    routeId: string;
    scheduleId: string;
    seatNumber?: string;
    passengerName: string;
    passengerEmail: string;
    passengerPhone?: string;
    price: number;
    currency?: string;
  }) => {
    const response = await ticketingApi.post('/api/tickets/commands/book', data);
    return response.data;
  },
  reserveTicket: async (data: {
    routeId: string;
    scheduleId: string;
    seatNumber?: string;
    passengerName: string;
    passengerEmail: string;
    passengerPhone?: string;
    price: number;
    currency?: string;
    reservationDurationMinutes?: number;
  }) => {
    const response = await ticketingApi.post('/api/tickets/commands/reserve', data);
    return response.data;
  },
  confirmTicket: async (data: { bookingId: string; paymentId: string }) => {
    const response = await ticketingApi.post('/api/tickets/commands/confirm', data);
    return response.data;
  },
  cancelTicket: async (data: { bookingId: string; reason?: string }) => {
    const response = await ticketingApi.post('/api/tickets/commands/cancel', data);
    return response.data;
  },
  getMyTickets: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await ticketingApi.get('/api/tickets/queries/my-tickets', { params });
    return response.data;
  },
  getTicketDetails: async (bookingId: string) => {
    const response = await ticketingApi.get(`/api/tickets/queries/${bookingId}`);
    return response.data;
  },
};

// Payment API
export const paymentServiceApi = {
  payForTicket: async (data: {
    userId: string;
    bookingId?: string;
    amount: number;
    routeId?: string;
    scheduleId?: string;
    seatNumber?: string;
    passengerName?: string;
    passengerEmail?: string;
    passengerPhone?: string;
    currency?: string;
  }) => {
    const response = await paymentApi.post('/payments/pay-for-ticket', data);
    return response.data;
  },
  getPayment: async (paymentId: string) => {
    const response = await paymentApi.get(`/payments/${paymentId}`);
    return response.data;
  },
};

// Wallet API
export const walletServiceApi = {
  getBalance: async (userId: string) => {
    const response = await walletApi.get(`/wallet/balance/${userId}`);
    return response.data;
  },
  topup: async (data: { userId: string; amount: number; reference?: string; description?: string }) => {
    const response = await walletApi.post('/wallet/topup', data);
    return response.data;
  },
  getTransactions: async (userId: string, params?: { page?: number; limit?: number; type?: string }) => {
    const response = await walletApi.get(`/wallet/transactions/${userId}`, { params });
    return response.data;
  },
  createWallet: async (data: { userId: string }) => {
    const response = await walletApi.post('/wallet/create', data);
    return response.data;
  },
};

