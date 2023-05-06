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
        uint price;
        address owner;
        uint256 tokenId;
    }

    mapping(uint256 => Ticket) public idToTicket;

    function host(uint _price, uint _supply, string memory _tokenURI) public payable {
        _tokenId.increment();
        uint256 currentToken = _tokenId.current();
        _mint(msg.sender, currentToken, _supply, "");
        _setURI(currentToken, _tokenURI);
        idToTicket[currentToken] = Ticket(msg.sender, _supply, _supply, _price, msg.sender, currentToken);
        _safeTransferFrom(msg.sender, address(this), currentToken, _supply, "");
    }

    function claimTicket(uint256 _ticketId) public payable {
        Ticket memory ticket = idToTicket[_ticketId];
        require(balanceOf((msg.sender), _ticketId) < 1, "");
        require(ticket.remaining > 0);
        _safeTransferFrom(address(this), msg.sender, _ticketId, 1, "");
        ticket.owner = payable(msg.sender);
        ticket.remaining--;
    }

    function inventory() public view returns (Ticket[] memory) {
        uint256 counter = 0;
        uint256 length;

        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
                length++;
            }
        }

        Ticket[] memory myTickets = new Ticket[](length);
        for (uint256 i = 0; i < _tokenId.current(); i++) {
            if (idToTicket[i + 1].owner == msg.sender) {
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