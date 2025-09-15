import React, { useState, useMemo } from 'react'
import { useWeb3 } from '@/providers/Web3Provider'
import { FileText, Plus, Wallet, Clock, Users, TrendingUp, Filter, Search, Eye, Vote, ChevronRight } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { mockProposals, getVotingProgress, formatTimeRemaining, MockProposal } from '@/data/mockProposals'
import { ProposalTypeLabels as PROPOSAL_TYPE_LABELS } from '@/types/web3'
import { formatAddress } from '@/utils/web3'
import { Link } from 'react-router-dom'

const ProposalsPage: React.FC = () => {
  const { wallet, contract } = useWeb3()
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'pending' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter proposals based on tab and search
  const filteredProposals = useMemo(() => {
    let filtered = mockProposals

    // Filter by status
    if (selectedTab !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === selectedTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(proposal => 
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        PROPOSAL_TYPE_LABELS[proposal.type].toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [selectedTab, searchTerm])

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

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', 
      completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      executed: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getStatusColor = (proposal: MockProposal) => {
    const progress = getVotingProgress(proposal)
    if (progress.forPercent >= proposal.requiredMajority) return 'text-green-400'
    if (progress.againstPercent > (100 - proposal.requiredMajority)) return 'text-red-400'
    return 'text-yellow-400'
  }

  const tabs = [
    { id: 'all', label: 'All', count: mockProposals.length },
    { id: 'active', label: 'Active', count: mockProposals.filter(p => p.status === 'active').length },
    { id: 'pending', label: 'Pending Review', count: mockProposals.filter(p => p.status === 'pending').length },
    { id: 'completed', label: 'Completed', count: mockProposals.filter(p => p.status === 'completed').length }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Proposal Management</h1>
            <p className="text-gray-300">View and manage corporate governance proposals</p>
          </div>
        </div>
        
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Proposal</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Tab Filters */}
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length > 0 ? (
        <div className="space-y-6">
          {filteredProposals.map((proposal) => {
            const progress = getVotingProgress(proposal)
            return (
              <div key={proposal.id} className="glass-card p-6 hover:bg-white/5 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {PROPOSAL_TYPE_LABELS[proposal.type]}
                      </span>
                      {getStatusBadge(proposal.status)}
                      <span className="text-gray-400 text-sm">ID #{proposal.id}</span>
                    </div>
                    
                    {/* Title and Description */}
                    <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{proposal.description}</p>
                    
                    {/* Metadata */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{proposal.totalVotes} votes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeRemaining(proposal.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className={getStatusColor(proposal)}>
                          {progress.forPercent.toFixed(1)}% approval
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span>Creator: {formatAddress(proposal.creator)}</span>
                      </div>
                    </div>

                    {/* Progress Bar (only for active proposals) */}
                    {proposal.status === 'active' && (
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div className="relative h-full rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progress.forPercent}%` }}
                          />
                          <div 
                            className="absolute top-0 h-full bg-red-500 transition-all duration-300"
                            style={{ 
                              left: `${progress.forPercent}%`, 
                              width: `${progress.againstPercent}%` 
                            }}
                          />
                          <div 
                            className="absolute top-0 h-full bg-yellow-500 transition-all duration-300"
                            style={{ 
                              left: `${progress.forPercent + progress.againstPercent}%`, 
                              width: `${progress.abstainPercent}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Vote Distribution */}
                    <div className="flex space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-300">For: {proposal.forVotes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-300">Against: {proposal.againstVotes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-300">Abstain: {proposal.abstainVotes}</span>
                      </div>
                      <div className="text-gray-400">
                        Required: {proposal.requiredMajority}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="btn-secondary flex items-center space-x-2 text-sm">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    
                    {proposal.status === 'active' && (
                      <Link 
                        to={`/vote`}
                        className="btn-primary flex items-center space-x-2 text-sm"
                      >
                        <Vote className="h-4 w-4" />
                        <span>Vote Now</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {searchTerm ? 'No Matching Proposals' : 'No Proposals Found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {searchTerm 
              ? `No proposals match your search for "${searchTerm}"`
              : `There are no ${selectedTab === 'all' ? '' : selectedTab + ' '}proposals at the moment.`
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{mockProposals.length}</div>
          <div className="text-gray-300 text-sm">Total Proposals</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {mockProposals.filter(p => p.status === 'active').length}
          </div>
          <div className="text-gray-300 text-sm">Active Proposals</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {mockProposals.reduce((acc, p) => acc + p.totalVotes, 0)}
          </div>
          <div className="text-gray-300 text-sm">Total Votes Cast</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {Math.round(mockProposals.filter(p => p.status === 'active').reduce((acc, p) => {
              const progress = getVotingProgress(p)
              return acc + progress.forPercent
            }, 0) / Math.max(mockProposals.filter(p => p.status === 'active').length, 1))}%
          </div>
          <div className="text-gray-300 text-sm">Avg. Approval Rate</div>
        </div>
      </div>
    </div>
  )
}

export default ProposalsPage