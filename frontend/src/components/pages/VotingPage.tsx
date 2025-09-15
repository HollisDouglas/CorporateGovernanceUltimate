import React, { useState } from 'react'
import { useWeb3 } from '@/providers/Web3Provider'
import { Vote, AlertCircle, Wallet, Clock, Users, TrendingUp, CheckCircle, XCircle, MinusCircle, ChevronRight } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getActiveProposals, getVotingProgress, formatTimeRemaining, MockProposal } from '@/data/mockProposals'
import { PROPOSAL_TYPE_LABELS, VoteChoice, VOTE_CHOICE_LABELS } from '@/types/web3'
import { formatAddress } from '@/utils/web3'
import toast from 'react-hot-toast'

const VotingPage: React.FC = () => {
  const { wallet, contract } = useWeb3()
  const [selectedProposal, setSelectedProposal] = useState<MockProposal | null>(null)
  const [votingInProgress, setVotingInProgress] = useState<number | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const activeProposals = getActiveProposals()

  // If wallet is not connected
  if (!wallet.isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
          <p className="text-gray-300 mb-6">
            Please connect your MetaMask wallet to participate in voting
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // If contract is loading
  if (contract.isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading contract data..." />
      </div>
    )
  }

  // If contract failed to load
  if (contract.error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Contract Connection Failed</h2>
          <p className="text-gray-300 mb-6">{contract.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  const handleVote = async (proposalId: number, voteChoice: VoteChoice) => {
    if (!wallet.isConnected || !contract.contract) {
      toast.error('Please connect your wallet and ensure contract is loaded')
      return
    }

    setVotingInProgress(proposalId)
    
    try {
      // Simulate voting transaction
      toast.loading(`Submitting ${VOTE_CHOICE_LABELS[voteChoice]} vote...`, { id: 'voting' })
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would call the smart contract here:
      // const tx = await contract.contract.vote(proposalId, voteChoice)
      // await tx.wait()
      
      toast.success(`Vote submitted successfully! (${VOTE_CHOICE_LABELS[voteChoice]})`, { id: 'voting' })
      setShowVoteModal(false)
      setSelectedProposal(null)
      
    } catch (error: any) {
      console.error('Voting error:', error)
      toast.error(`Voting failed: ${error.message || 'Unknown error'}`, { id: 'voting' })
    } finally {
      setVotingInProgress(null)
    }
  }

  const openVoteModal = (proposal: MockProposal) => {
    setSelectedProposal(proposal)
    setShowVoteModal(true)
  }

  const getStatusColor = (proposal: MockProposal) => {
    const progress = getVotingProgress(proposal)
    if (progress.forPercent >= proposal.requiredMajority) return 'text-green-400'
    if (progress.againstPercent > (100 - proposal.requiredMajority)) return 'text-red-400'
    return 'text-yellow-400'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Vote className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Participate in Voting</h1>
            <p className="text-gray-300">View active proposals and cast your votes</p>
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Wallet Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-gray-300">
            <span className="text-white font-medium">Address:</span>{' '}
            <span className="font-mono">{formatAddress(wallet.account || '')}</span>
          </div>
          <div className="text-gray-300">
            <span className="text-white font-medium">Balance:</span>{' '}
            <span className="text-green-400">{wallet.balance || '0'} SEP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* Active Proposals */}
      {activeProposals.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Active Proposals ({activeProposals.length})</h2>
          
          {activeProposals.map((proposal) => {
            const progress = getVotingProgress(proposal)
            return (
              <div key={proposal.id} className="glass-card p-6 hover:bg-white/5 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                        {PROPOSAL_TYPE_LABELS[proposal.type]}
                      </span>
                      <span className="text-gray-400 text-sm">ID #{proposal.id}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{proposal.totalVotes} votes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeRemaining(proposal.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className={getStatusColor(proposal)}>
                          {progress.forPercent.toFixed(1)}% approval
                        </span>
                      </div>
                    </div>

                    {/* Voting Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
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

                    {/* Vote Counts */}
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
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => openVoteModal(proposal)}
                      disabled={votingInProgress === proposal.id}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      {votingInProgress === proposal.id ? (
                        <>
                          <LoadingSpinner size="small" />
                          <span>Voting...</span>
                        </>
                      ) : (
                        <>
                          <Vote className="h-4 w-4" />
                          <span>Vote Now</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Active Proposals</h2>
          <p className="text-gray-400 mb-6">
            There are currently no active proposals available for voting.
          </p>
        </div>
      )}

      {/* Voting Modal */}
      {showVoteModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Cast Your Vote</h2>
              <button
                onClick={() => setShowVoteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedProposal.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{selectedProposal.description}</p>
              
              <div className="text-sm text-gray-400">
                <div>Required majority: {selectedProposal.requiredMajority}%</div>
                <div>Total votes: {selectedProposal.totalVotes}</div>
                <div>Time remaining: {formatTimeRemaining(selectedProposal.endTime)}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleVote(selectedProposal.id, VoteChoice.FOR)}
                disabled={votingInProgress !== null}
                className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Vote For</span>
              </button>
              
              <button
                onClick={() => handleVote(selectedProposal.id, VoteChoice.AGAINST)}
                disabled={votingInProgress !== null}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <XCircle className="h-5 w-5" />
                <span>Vote Against</span>
              </button>
              
              <button
                onClick={() => handleVote(selectedProposal.id, VoteChoice.ABSTAIN)}
                disabled={votingInProgress !== null}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <MinusCircle className="h-5 w-5" />
                <span>Abstain</span>
              </button>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-300 text-sm font-semibold mb-1">Private Voting</p>
                  <p className="text-blue-200/80 text-xs">
                    Your vote will be encrypted using FHE technology to ensure complete privacy while maintaining verifiability.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowVoteModal(false)}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VotingPage