// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KSRTCFleet
 * @dev Smart contract for managing KSRTC bus fleet as Digital Vehicle Passports (NFTs)
 * Each bus is represented as an ERC-721 token with immutable lifecycle records
 */
contract KSRTCFleet is ERC721, Ownable {
    
    // ==================== Data Structures ====================
    
    struct MaintenanceRecord {
        uint256 timestamp;
        string serviceType; // e.g., "40,000 km Service"
        string workshopId;
        string mechanicId;
        string supervisorId;
        string[] sparePartsUsed; // Array of unique part IDs
        uint256 odometerReading;
    }

    struct AccidentRecord {
        uint256 timestamp;
        string reportId;
        string location;
        string description;
        // Hash of the full report (photos, documents) stored off-chain (e.g., IPFS)
        bytes32 reportHash;
    }

    struct FuelRecord {
        uint256 timestamp;
        string depotId;
        uint256 litersDispensed; // Liters * 100 for fixed-point decimal (e.g., 50.25L = 5025)
        uint256 odometerReading;
    }

    struct BusPassport {
        string registrationNumber;
        string chassisNumber;
        string model;
        bool isCommissioned;
        uint256 commissioningDate;
        uint256 initialOdometer;
        MaintenanceRecord[] maintenanceHistory;
        AccidentRecord[] accidentHistory;
        FuelRecord[] fuelHistory;
    }

    // ==================== State Variables ====================
    
    uint256 private tokenIdCounter;
    
    // Mapping from tokenId to BusPassport
    mapping(uint256 => BusPassport) private busPassports;
    
    // Mapping from registration number to tokenId for easy lookup
    mapping(string => uint256) private registrationToTokenId;

    // ==================== Events ====================
    
    event BusMinted(uint256 indexed tokenId, string registrationNumber);
    event BusCommissioned(uint256 indexed tokenId);
    event MaintenanceRecorded(uint256 indexed tokenId, string serviceType);
    event AccidentRecorded(uint256 indexed tokenId, string reportId);
    event FuelRecorded(uint256 indexed tokenId, uint256 litersDispensed);

    // ==================== Constructor ====================
    
    constructor() ERC721("KSRTC Digital Vehicle Passport", "KSRTC-DVP") Ownable(msg.sender) {
        tokenIdCounter = 0;
    }

    // ==================== Core Functions ====================
    
    /**
     * @dev Mints a new bus passport NFT (Foundational Step)
     * @param owner Address to receive the NFT (typically KSRTC)
     * @param registrationNumber Vehicle registration number (e.g., "KA-01-F-1234")
     * @param chassisNumber Unique chassis/VIN number
     * @param model Bus model name
     * @return tokenId The ID of the newly minted NFT
     */
    function mintBusPassport(
        address owner,
        string memory registrationNumber,
        string memory chassisNumber,
        string memory model
    ) public onlyOwner returns (uint256) {
        require(bytes(registrationNumber).length > 0, "Registration number required");
        require(registrationToTokenId[registrationNumber] == 0, "Bus already exists");
        
        tokenIdCounter++;
        uint256 newTokenId = tokenIdCounter;
        
        // Mint the NFT
        _safeMint(owner, newTokenId);
        
        // Create the bus passport
        BusPassport storage passport = busPassports[newTokenId];
        passport.registrationNumber = registrationNumber;
        passport.chassisNumber = chassisNumber;
        passport.model = model;
        passport.isCommissioned = false;
        passport.commissioningDate = 0;
        passport.initialOdometer = 0;
        
        // Map registration to tokenId
        registrationToTokenId[registrationNumber] = newTokenId;
        
        emit BusMinted(newTokenId, registrationNumber);
        
        return newTokenId;
    }

    /**
     * @dev Commissions a bus, marking it as operational ("Birth Certificate" step)
     * @param tokenId The NFT token ID of the bus
     * @param initialOdometer Initial odometer reading at commissioning
     */
    function commissionBus(uint256 tokenId, uint256 initialOdometer) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        require(!busPassports[tokenId].isCommissioned, "Bus already commissioned");
        
        BusPassport storage passport = busPassports[tokenId];
        passport.isCommissioned = true;
        passport.commissioningDate = block.timestamp;
        passport.initialOdometer = initialOdometer;
        
        emit BusCommissioned(tokenId);
    }

    /**
     * @dev Records a maintenance event for a bus
     * @param tokenId The NFT token ID of the bus
     * @param serviceType Type of maintenance (e.g., "10,000 km Service")
     * @param workshopId Identifier of the workshop
     * @param mechanicId Identifier of the mechanic
     * @param supervisorId Identifier of the supervisor
     * @param sparePartsUsed Array of spare part IDs used
     * @param odometerReading Current odometer reading
     */
    function addMaintenanceRecord(
        uint256 tokenId,
        string memory serviceType,
        string memory workshopId,
        string memory mechanicId,
        string memory supervisorId,
        string[] memory sparePartsUsed,
        uint256 odometerReading
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        require(busPassports[tokenId].isCommissioned, "Bus not commissioned");
        
        MaintenanceRecord memory newRecord = MaintenanceRecord({
            timestamp: block.timestamp,
            serviceType: serviceType,
            workshopId: workshopId,
            mechanicId: mechanicId,
            supervisorId: supervisorId,
            sparePartsUsed: sparePartsUsed,
            odometerReading: odometerReading
        });
        
        busPassports[tokenId].maintenanceHistory.push(newRecord);
        
        emit MaintenanceRecorded(tokenId, serviceType);
    }

    /**
     * @dev Records an accident event for a bus
     * @param tokenId The NFT token ID of the bus
     * @param reportId Unique accident report identifier
     * @param location Location of the accident
     * @param description Brief description of the accident
     * @param reportHash Hash of the complete report stored off-chain
     */
    function addAccidentRecord(
        uint256 tokenId,
        string memory reportId,
        string memory location,
        string memory description,
        bytes32 reportHash
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        
        AccidentRecord memory newRecord = AccidentRecord({
            timestamp: block.timestamp,
            reportId: reportId,
            location: location,
            description: description,
            reportHash: reportHash
        });
        
        busPassports[tokenId].accidentHistory.push(newRecord);
        
        emit AccidentRecorded(tokenId, reportId);
    }

    /**
     * @dev Records a fuel consumption event for a bus
     * @param tokenId The NFT token ID of the bus
     * @param depotId Identifier of the fuel depot
     * @param litersDispensed Amount of fuel dispensed (liters * 100)
     * @param odometerReading Current odometer reading
     */
    function addFuelRecord(
        uint256 tokenId,
        string memory depotId,
        uint256 litersDispensed,
        uint256 odometerReading
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        require(busPassports[tokenId].isCommissioned, "Bus not commissioned");
        
        FuelRecord memory newRecord = FuelRecord({
            timestamp: block.timestamp,
            depotId: depotId,
            litersDispensed: litersDispensed,
            odometerReading: odometerReading
        });
        
        busPassports[tokenId].fuelHistory.push(newRecord);
        
        emit FuelRecorded(tokenId, litersDispensed);
    }

    // ==================== View Functions ====================
    
    /**
     * @dev Retrieves complete passport details for a bus
     * @param tokenId The NFT token ID of the bus
     * @return BusPassport struct containing all bus details and history
     */
    function getBusDetails(uint256 tokenId) public view returns (BusPassport memory) {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        return busPassports[tokenId];
    }

    /**
     * @dev Gets the tokenId for a given registration number
     * @param registrationNumber The registration number to look up
     * @return tokenId The token ID (0 if not found)
     */
    function getTokenIdByRegistration(string memory registrationNumber) public view returns (uint256) {
        return registrationToTokenId[registrationNumber];
    }

    /**
     * @dev Returns the total number of buses minted
     * @return Total number of buses
     */
    function getTotalBuses() public view returns (uint256) {
        return tokenIdCounter;
    }

    /**
     * @dev Gets the count of maintenance records for a bus
     * @param tokenId The NFT token ID of the bus
     * @return Number of maintenance records
     */
    function getMaintenanceCount(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        return busPassports[tokenId].maintenanceHistory.length;
    }

    /**
     * @dev Gets the count of accident records for a bus
     * @param tokenId The NFT token ID of the bus
     * @return Number of accident records
     */
    function getAccidentCount(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        return busPassports[tokenId].accidentHistory.length;
    }

    /**
     * @dev Gets the count of fuel records for a bus
     * @param tokenId The NFT token ID of the bus
     * @return Number of fuel records
     */
    function getFuelCount(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Bus does not exist");
        return busPassports[tokenId].fuelHistory.length;
    }
}
