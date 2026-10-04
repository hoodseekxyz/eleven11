// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title RestoreDesk
/// @notice Twelve seats. A print records a shock and the asymmetric walk back.
///         If the book is full, the smallest gap is displaced.
///         Spark is 0.0001 ether and stays in this contract. There is no withdraw.
///         Bind the long.xyz token once, after you deploy it. This desk does not
///         mint that token, custody a stock, or pay yield.
///         Not affiliated with Him Gajria, Equation, Hims & Hers, or Robinhood.
///
/// Remix: compiler 0.8.24, optimizer on, 200 runs. Paste this file alone.
contract RestoreDesk {
    uint256 public constant CAP = 12;
    uint256 public constant SPARK = 0.0001 ether;
    uint256 public constant BPS = 10_000;
    uint256 public constant SHOCK_MIN = 100;
    uint256 public constant SHOCK_MAX = 8_000;

    address public immutable scribe;
    address public token;
    uint256 public filled;

    struct Seat {
        address who;
        uint256 principal;
        uint256 shockBps;
        uint256 restoreBps;
        uint256 givebackBps;
        uint256 gapBps;
        uint64 at;
    }

    Seat[12] public seats;

    event Printed(
        address indexed who,
        uint256 indexed seat,
        uint256 shockBps,
        uint256 restoreBps,
        uint256 givebackBps,
        uint256 gapBps
    );
    event Displaced(address indexed who, uint256 gapBps);
    event Bound(address indexed token);
    event Ping(address indexed who, uint256 at);

    error Shock();
    error BadSpark();
    error Zero();
    error BoundAlready();
    error NotScribe();

    constructor() {
        scribe = msg.sender;
    }

    /// @notice Call once with the token you deployed on long.xyz. Cannot be changed.
    function bindToken(address next) external {
        if (msg.sender != scribe) revert NotScribe();
        if (token != address(0)) revert BoundAlready();
        if (next == address(0)) revert Zero();
        token = next;
        emit Bound(next);
    }

    function ping() external {
        emit Ping(msg.sender, block.timestamp);
    }

    function quote(uint256 shockBps)
        public
        pure
        returns (uint256 restoreBps, uint256 givebackBps, uint256 gapBps)
    {
        if (shockBps < SHOCK_MIN || shockBps > SHOCK_MAX) revert Shock();
        restoreBps = shockBps * BPS / (BPS - shockBps);
        givebackBps = shockBps * BPS / (BPS + shockBps);
        gapBps = restoreBps - givebackBps;
    }

    /// @param principal Recorded number only. Send no tokens.
    /// @param shockBps 1_000 means 10%.
    function print(uint256 principal, uint256 shockBps) external payable {
        if (msg.value != SPARK) revert BadSpark();
        if (principal == 0) revert Zero();
        (uint256 restoreBps, uint256 givebackBps, uint256 gapBps) = quote(shockBps);

        uint256 idx = CAP;
        uint256 light;
        bool saw;
        for (uint256 i; i < CAP; ++i) {
            if (seats[i].who == address(0)) {
                idx = i;
                break;
            }
            if (!saw || seats[i].gapBps < seats[light].gapBps) {
                light = i;
                saw = true;
            }
        }

        if (idx == CAP) {
            emit Displaced(seats[light].who, seats[light].gapBps);
            idx = light;
        } else {
            unchecked {
                filled += 1;
            }
        }

        seats[idx] = Seat({
            who: msg.sender,
            principal: principal,
            shockBps: shockBps,
            restoreBps: restoreBps,
            givebackBps: givebackBps,
            gapBps: gapBps,
            at: uint64(block.timestamp)
        });

        emit Printed(msg.sender, idx, shockBps, restoreBps, givebackBps, gapBps);
    }

    function book() external view returns (Seat[12] memory) {
        return seats;
    }
}
