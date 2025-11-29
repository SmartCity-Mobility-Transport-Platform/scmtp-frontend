'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuthStore } from '@/lib/store';
import { ticketingServiceApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Ticket, Bus, Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TicketsPage() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        const params: any = { limit: 50 };
        if (filter !== 'all') {
          params.status = filter.toUpperCase();
        }
        const response = await ticketingServiceApi.getMyTickets(params);
        setTickets(response.data || []);
      } catch (error: any) {
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, filter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'RESERVED':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Ticket className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const filteredTickets = tickets;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
            <p className="text-gray-600">View and manage your bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'confirmed', 'reserved', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Bus className="h-6 w-6 text-primary-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {ticket.routeName || 'Route'}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(ticket.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">From</p>
                          <p className="font-medium">{ticket.originStop || 'Origin'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">To</p>
                          <p className="font-medium">{ticket.destinationStop || 'Destination'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium">
                            {ticket.departureTime
                              ? format(new Date(ticket.departureTime), 'MMM dd, yyyy')
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {ticket.departureTime
                            ? format(new Date(ticket.departureTime), 'hh:mm a')
                            : 'N/A'}
                        </span>
                      </div>
                      {ticket.seatNumber && (
                        <div className="flex items-center space-x-1">
                          <Ticket className="h-4 w-4" />
                          <span>Seat: {ticket.seatNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        ${ticket.price?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-gray-500">Ticket Price</p>
                    </div>
                    {ticket.status === 'RESERVED' && (
                      <div className="w-full md:w-auto">
                        <p className="text-xs text-yellow-600 mb-2 text-center">
                          Reservation expires soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">No tickets found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter !== 'all'
                ? `No ${filter} tickets`
                : 'Book your first ticket to get started'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

