//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Eventify is ERC1155URIStorage, ERC1155Holder {
    address owner;

    constructor() ERC1155("") {
        owner = payable(msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    struct Ticket {
        address host;
        uint supply;
        uint remaining;
        address owner;
        uint256 tokenId;
    }

    mapping (uint256 => string[]) public idToShortlist;

    mapping(uint256 => Ticket) public idToTicket;

    function host(uint _supply, string memory _tokenURI) public {
        _tokenId.increment();
        uint256 currentToken = _tokenId.current();
        _mint(msg.sender, currentToken, _supply, "");
        _setURI(currentToken, _tokenURI);
        _safeTransferFrom(msg.sender, address(this), currentToken, _supply, "");
        idToTicket[currentToken] = Ticket(msg.sender, _supply, _supply, address(this), currentToken);
    }

    function claimTicket(uint256 _ticketId, string memory _email) public returns (bool) {
        Ticket storage ticket = idToTicket[_ticketId];

        for (uint256 i = 0; i < ticket.supply; i++) {
            string memory currentEmail = idToShortlist[_ticketId][i];
            if ( keccak256(abi.encodePacked(currentEmail)) == keccak256(abi.encodePacked(_email)) ) {
                require(ticket.remaining > 0, "No tickets left to claim");
                require(balanceOf(msg.sender, _ticketId) < 1, "You already own a ticket");
                _safeTransferFrom(address(this), msg.sender, _ticketId, 1, "");
                ticket.owner = msg.sender;
                ticket.remaining = ticket.remaining - 1;
                return true;
            }
        }

        return false;
    }

    function updatShortlist(uint256 _ticketId, string[] memory _shortlist) public {    
        idToShortlist[_ticketId] = _shortlist;
    }

    function inventory(address _user) public view returns (Ticket[] memory) {
        uint256 counter = 0;
        uint256 length;

        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].owner == _user) {
                length++;
            }
        }

        Ticket[] memory myTickets = new Ticket[](length);
        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].owner == _user) {
                uint256 currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                myTickets[counter] = currentItem;
                counter++;
            }
        }
        return myTickets;
    }

    function activeEvents() public view returns (Ticket[] memory) {
        uint256 counter = 0;
        uint256 length;

        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].remaining > 0 ) {
                length++;
            }
        }

        Ticket[] memory unsoldTickets = new Ticket[](length);
        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].remaining > 0) {
                uint256 currentId = i + 1;
                Ticket storage currentItem = idToTicket[currentId];
                unsoldTickets[counter] = currentItem;
                counter++;
            }
        }
        return unsoldTickets;
    }
}