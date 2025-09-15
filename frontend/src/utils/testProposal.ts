import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants'

export const createTestProposal = async () => {
  try {
    // Get provider and signer
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    console.log('Creating test proposal...')
    console.log('Contract address:', CONTRACT_ADDRESS)
    console.log('Signer address:', await signer.getAddress())

    // Create a test proposal
    const tx = await (contract as any).createProposal(
      1, // proposalType: 1 = Board Election
      "Test Proposal: Elect New Board Member", // title
      7  // duration in days
    )

    console.log('Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('Transaction confirmed in block:', receipt.blockNumber)
    
    return receipt
  } catch (error: any) {
    console.error('Error creating test proposal:', error)
    throw error
  }
}

export const initializeCompany = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    console.log('Initializing company...')
    
    const tx = await (contract as any).initCompany(
      "Test Corporate DAO", // company name
      1000000 // total shares
    )

    console.log('Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('Company initialized in block:', receipt.blockNumber)
    
    return receipt
  } catch (error: any) {
    console.error('Error initializing company:', error)
    throw error
  }
}

export const addBoardMember = async (memberAddress: string) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    console.log('Adding board member:', memberAddress)
    
    const tx = await (contract as any).addBoard(memberAddress)

    console.log('Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('Board member added in block:', receipt.blockNumber)
    
    return receipt
  } catch (error: any) {
    console.error('Error adding board member:', error)
    throw error
  }
}