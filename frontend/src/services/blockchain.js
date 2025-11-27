import { ethers } from 'ethers'
import KSRTCFleetABI from '../../../artifacts/contracts/KSRTCFleet.sol/KSRTCFleet.json'

// Contract address (update after deployment)
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

class BlockchainService {
  constructor() {
    this.provider = null
    this.contract = null
    this.signer = null
  }

  async connect() {
    try {
      // Connect to local Hardhat node
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545')
      
      // Get signer
      const signers = await this.provider.listAccounts()
      this.signer = await this.provider.getSigner(signers[0].address)
      
      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        KSRTCFleetABI.abi,
        this.signer
      )
      
      return true
    } catch (error) {
      console.error('Failed to connect to blockchain:', error)
      return false
    }
  }

  // Get all buses
  async getAllBuses() {
    try {
      const totalBuses = await this.contract.getTotalBuses()
      const buses = []
      
      for (let i = 1; i <= Number(totalBuses); i++) {
        const busDetails = await this.contract.getBusDetails(i)
        buses.push({
          tokenId: i,
          registrationNumber: busDetails.registrationNumber,
          chassisNumber: busDetails.chassisNumber,
          model: busDetails.model,
          isCommissioned: busDetails.isCommissioned,
          commissioningDate: Number(busDetails.commissioningDate),
          initialOdometer: Number(busDetails.initialOdometer),
          maintenanceCount: busDetails.maintenanceHistory.length,
          accidentCount: busDetails.accidentHistory.length,
          fuelCount: busDetails.fuelHistory.length
        })
      }
      
      return buses
    } catch (error) {
      console.error('Error fetching buses:', error)
      return []
    }
  }

  // Get bus details
  async getBusDetails(tokenId) {
    try {
      const details = await this.contract.getBusDetails(tokenId)
      
      return {
        tokenId,
        registrationNumber: details.registrationNumber,
        chassisNumber: details.chassisNumber,
        model: details.model,
        isCommissioned: details.isCommissioned,
        commissioningDate: Number(details.commissioningDate) * 1000,
        initialOdometer: Number(details.initialOdometer),
        maintenanceHistory: details.maintenanceHistory.map(record => ({
          timestamp: Number(record.timestamp) * 1000,
          serviceType: record.serviceType,
          workshopId: record.workshopId,
          mechanicId: record.mechanicId,
          supervisorId: record.supervisorId,
          sparePartsUsed: record.sparePartsUsed,
          odometerReading: Number(record.odometerReading)
        })),
        accidentHistory: details.accidentHistory.map(record => ({
          timestamp: Number(record.timestamp) * 1000,
          reportId: record.reportId,
          location: record.location,
          description: record.description,
          reportHash: record.reportHash
        })),
        fuelHistory: details.fuelHistory.map(record => ({
          timestamp: Number(record.timestamp) * 1000,
          depotId: record.depotId,
          litersDispensed: Number(record.litersDispensed) / 100,
          odometerReading: Number(record.odometerReading)
        }))
      }
    } catch (error) {
      console.error('Error fetching bus details:', error)
      return null
    }
  }

  // Mint new bus
  async mintBusPassport(registrationNumber, chassisNumber, model) {
    try {
      // Ensure we're connected
      if (!this.signer || !this.contract) {
        await this.connect()
      }
      
      const ownerAddress = await this.signer.getAddress()
      const tx = await this.contract.mintBusPassport(
        ownerAddress,
        registrationNumber,
        chassisNumber,
        model
      )
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error minting bus:', error)
      throw error
    }
  }

  // Commission bus
  async commissionBus(tokenId, initialOdometer) {
    try {
      // Ensure we're connected
      if (!this.signer || !this.contract) {
        await this.connect()
      }
      
      const tx = await this.contract.commissionBus(tokenId, initialOdometer)
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error commissioning bus:', error)
      throw error
    }
  }

  // Add maintenance record
  async addMaintenanceRecord(tokenId, serviceType, workshopId, mechanicId, supervisorId, sparePartsUsed, odometerReading) {
    try {
      const tx = await this.contract.addMaintenanceRecord(
        tokenId,
        serviceType,
        workshopId,
        mechanicId,
        supervisorId,
        sparePartsUsed,
        odometerReading
      )
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error adding maintenance record:', error)
      throw error
    }
  }

  // Add fuel record
  async addFuelRecord(tokenId, depotId, litersDispensed, odometerReading) {
    try {
      const tx = await this.contract.addFuelRecord(
        tokenId,
        depotId,
        Math.floor(litersDispensed * 100), // Convert to fixed point
        odometerReading
      )
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error adding fuel record:', error)
      throw error
    }
  }

  // Add accident record
  async addAccidentRecord(tokenId, reportId, location, description, reportHash) {
    try {
      const tx = await this.contract.addAccidentRecord(
        tokenId,
        reportId,
        location,
        description,
        reportHash
      )
      const receipt = await tx.wait()
      return receipt
    } catch (error) {
      console.error('Error adding accident record:', error)
      throw error
    }
  }

  // Get transaction details
  async getTransactionDetails(txHash) {
    try {
      const tx = await this.provider.getTransaction(txHash)
      const receipt = await this.provider.getTransactionReceipt(txHash)
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        blockNumber: receipt.blockNumber,
        timestamp: (await this.provider.getBlock(receipt.blockNumber)).timestamp * 1000,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'Success' : 'Failed'
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }
}

export default new BlockchainService()
