'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { routeServiceApi } from '@/lib/api';
import { GET_ROUTES } from '@/lib/graphql/queries';
import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, ArrowRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Route {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  schedules: Array<{
    id: string;
    routeId: string;
    departureTime: string;
    arrivalTime: string;
    daysOfWeek: string[];
  }>;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await routeServiceApi.query(GET_ROUTES);
        setRoutes(data.routes || []);
      } catch (error: any) {
        toast.error('Failed to load routes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.stops.some((stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Routes & Schedules</h1>
            <p className="text-gray-600">Explore available routes and book your journey</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes or stops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Routes Grid */}
        {filteredRoutes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Bus className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
                      <p className="text-sm text-gray-500">
                        {route.stops.length} stops • {route.schedules.length} schedules
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stops Preview */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Stops:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {route.stops.slice(0, 3).map((stop) => (
                      <span
                        key={stop.id}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        {stop.name}
                      </span>
                    ))}
                    {route.stops.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        +{route.stops.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Schedules Preview */}
                {route.schedules.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Next Departures:</span>
                    </div>
                    <div className="space-y-1">
                      {route.schedules.slice(0, 2).map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {new Date(schedule.departureTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-gray-500">
                            {schedule.daysOfWeek.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/routes/${route.id}/book`}
                  className="flex items-center justify-center space-x-2 w-full mt-4 px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  <span>Book Ticket</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Bus className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">No routes found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? 'Try a different search term' : 'Routes will appear here'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

