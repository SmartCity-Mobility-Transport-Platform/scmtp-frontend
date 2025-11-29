'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuthStore, useWalletStore } from '@/lib/store';
import { walletServiceApi, ticketingServiceApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Wallet, Ticket, TrendingUp, Clock, MapPin, Bus } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { balance, setBalance } = useWalletStore();
  const [stats, setStats] = useState({
    totalTickets: 0,
    upcomingTrips: 0,
    totalSpent: 0,
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch wallet balance
        const walletRes = await walletServiceApi.getBalance(user.id);
        setBalance(walletRes.data?.balance || 0);

        // Fetch tickets
        const ticketsRes = await ticketingServiceApi.getMyTickets({ limit: 5 });
        setRecentTickets(ticketsRes.data || []);
        setStats({
          totalTickets: ticketsRes.data?.length || 0,
          upcomingTrips: ticketsRes.data?.filter((t: any) => 
            new Date(t.departureTime) > new Date()
          ).length || 0,
          totalSpent: ticketsRes.data?.reduce((sum: number, t: any) => sum + (t.price || 0), 0) || 0,
        });
      } catch (error: any) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setBalance]);

  const statCards = [
    {
      title: 'Wallet Balance',
      value: `$${balance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      color: 'bg-blue-500',
      link: '/wallet',
    },
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: Ticket,
      color: 'bg-green-500',
      link: '/tickets',
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingTrips,
      icon: Clock,
      color: 'bg-purple-500',
      link: '/tickets',
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/tickets',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-white/90">
            Here's what's happening with your account today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/routes"
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Browse Routes</span>
              </Link>
              <Link
                href="/wallet"
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Wallet className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Top Up Wallet</span>
              </Link>
              <Link
                href="/tickets"
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Ticket className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">View Tickets</span>
              </Link>
            </div>
          </motion.div>

          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
              <Link
                href="/tickets"
                className="text-primary-600 hover:underline text-sm font-medium"
              >
                View All
              </Link>
            </div>
            {recentTickets.length > 0 ? (
              <div className="space-y-3">
                {recentTickets.slice(0, 3).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Bus className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {ticket.routeName || 'Route'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.departureTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${ticket.price?.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          ticket.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : ticket.status === 'RESERVED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Ticket className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No tickets yet</p>
                <Link
                  href="/routes"
                  className="text-primary-600 hover:underline mt-2 inline-block"
                >
                  Book your first ticket
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

