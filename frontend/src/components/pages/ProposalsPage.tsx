import React from 'react'
import { useWeb3 } from '@/providers/Web3Provider'
import { FileText, Plus, Wallet } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

const ProposalsPage: React.FC = () => {
  const { wallet, contract } = useWeb3()

  // If wallet is not connected
  if (!wallet.isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-300 mb-6">
            Please connect your MetaMask wallet to view proposals
          </p>
        </div>
      </div>
    )
  }

  // If contract is loading
  if (contract.isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading proposal data..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-400" />
            <span>Proposal Management</span>
          </h1>
          <p className="text-gray-400">
            View and manage corporate governance proposals
          </p>
        </div>
        
        <button className="gradient-button flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Proposal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {['All', 'Active', 'Pending Review', 'Completed'].map((tab) => (
          <button
            key={tab}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/10"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-12 text-center">
        <FileText className="h-24 w-24 text-blue-400 mx-auto mb-6 opacity-50" />
        <h2 className="text-3xl font-bold text-white mb-4">Proposal Management Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Complete proposal creation, review, and management features are in development. Stay tuned!
        </p>
        
        {/* Placeholder List */}
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-lg p-6 text-left animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-white/10 rounded mb-2 w-2/3"></div>
                  <div className="h-3 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </div>
                <div className="ml-4">
                  <div className="h-6 w-16 bg-blue-500/20 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-white/10 rounded w-32"></div>
                <div className="h-8 w-24 bg-green-500/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProposalsPage