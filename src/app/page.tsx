'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Bus,
      title: 'Real-time Tracking',
      description: 'Track your bus in real-time with live location updates',
      color: 'text-blue-500',
    },
    {
      icon: MapPin,
      title: 'Smart Routes',
      description: 'Discover optimized routes and schedules for your journey',
      color: 'text-green-500',
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Book tickets instantly with our seamless booking system',
      color: 'text-purple-500',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with wallet integration',
      color: 'text-red-500',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Lightning-fast service with 99.9% uptime guarantee',
      color: 'text-yellow-500',
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Intuitive interface designed for the best user experience',
      color: 'text-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                SCMTP
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart City Mobility
            <br />
            & Transport Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of urban transportation with real-time tracking,
            seamless booking, and intelligent route planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Your Journey
            </Link>
            <Link
              href="/routes"
              className="px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-all"
            >
              Explore Routes
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose SCMTP?
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need for a seamless travel experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <div className={`${feature.color} mb-4`}>
                <feature.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Commute?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of satisfied commuters using SCMTP every day
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bus className="h-6 w-6" />
              <span className="text-xl font-bold">SCMTP</span>
            </div>
            <p className="text-gray-400">
              © 2024 Smart City Mobility & Transport Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

