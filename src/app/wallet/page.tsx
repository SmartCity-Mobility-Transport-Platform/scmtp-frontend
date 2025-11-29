'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuthStore, useWalletStore } from '@/lib/store';
import { walletServiceApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Wallet, Plus, ArrowUp, ArrowDown, History, TrendingUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const { user } = useAuthStore();
  const { balance, setBalance } = useWalletStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          walletServiceApi.getBalance(user.id),
          walletServiceApi.getTransactions(user.id, { limit: 10 }),
        ]);

        setBalance(balanceRes.data?.balance || 0);
        setTransactions(transactionsRes.data?.transactions || []);
      } catch (error: any) {
        toast.error('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setBalance]);

  const handleTopup = async () => {
    if (!user) return;

    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setTopupLoading(true);

    try {
      const response = await walletServiceApi.topup({
        userId: user.id,
        amount,
        reference: `topup-${Date.now()}`,
        description: 'Wallet top-up',
      });

      if (response.success) {
        setBalance((balance || 0) + amount);
        setTopupAmount('');
        toast.success(`Successfully topped up $${amount.toFixed(2)}`);
        
        // Refresh transactions
        const transactionsRes = await walletServiceApi.getTransactions(user.id, { limit: 10 });
        setTransactions(transactionsRes.data?.transactions || []);
      } else {
        toast.error(response.error?.message || 'Top-up failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Top-up failed');
    } finally {
      setTopupLoading(false);
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Wallet Balance</h2>
              <p className="text-white/80">Available for ticket purchases</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <div className="text-5xl font-bold mb-4">
            ${balance?.toFixed(2) || '0.00'}
          </div>
        </motion.div>

        {/* Top Up Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary-600" />
            <span>Top Up Wallet</span>
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTopup}
                disabled={topupLoading || !topupAmount}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ArrowUp className="h-5 w-5" />
                <span>{topupLoading ? 'Processing...' : 'Top Up'}</span>
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopupAmount(amount.toString())}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <History className="h-5 w-5 text-primary-600" />
            <span>Transaction History</span>
          </h3>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'TOPUP'
                          ? 'bg-green-100 text-green-600'
                          : transaction.type === 'DEBIT'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {transaction.type === 'TOPUP' ? (
                        <ArrowUp className="h-5 w-5" />
                      ) : transaction.type === 'REFUND' ? (
                        <RefreshCw className="h-5 w-5" />
                      ) : (
                        <ArrowDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type === 'TOPUP'
                          ? 'Top Up'
                          : transaction.type === 'DEBIT'
                          ? 'Payment'
                          : 'Refund'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === 'TOPUP'
                          ? 'text-green-600'
                          : transaction.type === 'DEBIT'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {(transaction.type === 'TOPUP' || transaction.type === 'REFUND') ? '+' : '-'}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    {transaction.reference && (
                      <p className="text-xs text-gray-400 mt-1">
                        {transaction.reference}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Top-ups</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              $
              {transactions
                .filter((t) => t.type === 'TOPUP')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Spent</span>
              <ArrowDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              $
              {transactions
                .filter((t) => t.type === 'DEBIT')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Transactions</span>
              <History className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

