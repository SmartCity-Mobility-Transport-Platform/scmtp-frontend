'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { routeServiceApi, paymentServiceApi, ticketingServiceApi } from '@/lib/api';
import { GET_ROUTE } from '@/lib/graphql/queries';
import { useAuthStore, useWalletStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Bus, Calendar, Clock, MapPin, User, Mail, Phone, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function BookTicketPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { balance } = useWalletStore();
  const [route, setRoute] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    passengerName: user?.name || '',
    passengerEmail: user?.email || '',
    passengerPhone: user?.phone || '',
  });

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const data = await routeServiceApi.query(GET_ROUTE, { id: params.id });
        setRoute(data.route);
        if (data.route?.schedules?.length > 0) {
          setSelectedSchedule(data.route.schedules[0]);
        }
      } catch (error: any) {
        toast.error('Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRoute();
    }
  }, [params.id]);

  const handleBookTicket = async () => {
    if (!selectedSchedule) {
      toast.error('Please select a schedule');
      return;
    }

    if (!formData.passengerName || !formData.passengerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('Please login to book tickets');
      router.push('/login');
      return;
    }

    setBooking(true);

    try {
      const price = 25.0; // Default price, should come from schedule/route

      // Start payment saga
      const paymentResponse = await paymentServiceApi.payForTicket({
        userId: user.id,
        amount: price,
        routeId: route.id,
        scheduleId: selectedSchedule.id,
        seatNumber: selectedSeat || undefined,
        passengerName: formData.passengerName,
        passengerEmail: formData.passengerEmail,
        passengerPhone: formData.passengerPhone || undefined,
        currency: 'USD',
      });

      toast.success('Payment initiated! Processing your booking...');

      // Poll for payment status
      const pollPaymentStatus = async (paymentId: string) => {
        const maxAttempts = 30;
        let attempts = 0;

        const interval = setInterval(async () => {
          attempts++;
          try {
            const payment = await paymentServiceApi.getPayment(paymentId);
            if (payment.status === 'COMPLETED') {
              clearInterval(interval);
              toast.success('Ticket booked successfully!');
              router.push('/tickets');
            } else if (payment.status === 'FAILED') {
              clearInterval(interval);
              toast.error('Payment failed. Please try again.');
              setBooking(false);
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              toast.error('Payment is taking longer than expected. Please check your tickets.');
              router.push('/tickets');
            }
          } catch (error) {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              setBooking(false);
            }
          }
        }, 2000);

        return interval;
      };

      await pollPaymentStatus(paymentResponse.id);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to book ticket');
      setBooking(false);
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

  if (!route) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Route not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Route Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Bus className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{route.name}</h1>
              <p className="text-gray-600">{route.stops.length} stops</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>
                {route.stops[0]?.name} → {route.stops[route.stops.length - 1]?.name}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Schedule Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Schedule</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {route.schedules.map((schedule: any) => (
              <button
                key={schedule.id}
                onClick={() => setSelectedSchedule(schedule)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSchedule?.id === schedule.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {new Date(schedule.departureTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {schedule.daysOfWeek.join(', ')}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary-600">$25.00</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Passenger Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Passenger Details</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.passengerName}
                  onChange={(e) =>
                    setFormData({ ...formData, passengerName: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.passengerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, passengerEmail: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.passengerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, passengerPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Summary</span>
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Ticket Price</span>
              <span>$25.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Wallet Balance</span>
              <span className={balance && balance >= 25 ? 'text-green-600' : 'text-red-600'}>
                ${balance?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>$25.00</span>
            </div>
            {balance && balance < 25 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Insufficient balance. Please{' '}
                  <a href="/wallet" className="font-semibold underline">
                    top up your wallet
                  </a>{' '}
                  first.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleBookTicket}
            disabled={booking || !selectedSchedule || (balance !== null && balance < 25)}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {booking ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Book & Pay</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}

