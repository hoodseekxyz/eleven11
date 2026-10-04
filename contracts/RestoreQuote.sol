// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title RestoreQuote
/// @notice Pure Percentage Paradox quote. Deploy this alone in Remix if you
///         only want the math on-chain. 10% is 1_000 bps.
///         A loss of r needs r/(1-r) to undo. A gain of r gives back r/(1+r).
///         This contract holds nothing and pays nothing.
///         Not affiliated with Him Gajria, Equation, Hims & Hers, or Robinhood.
contract RestoreQuote {
    uint256 public constant BPS = 10_000;
    uint256 public constant SHOCK_MIN = 100; // 1%
    uint256 public constant SHOCK_MAX = 8_000; // 80%

    error Shock();

    /// @param shockBps Rate in basis points. 1_000 = 10%.
    /// @return restoreBps Percent, in bps, required to walk a loss back.
    /// @return givebackBps Percent, in bps, required to give a gain back.
    /// @return gapBps restoreBps - givebackBps.
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

    /// @param principal Any unit. The contract does not hold this amount.
    function walk(uint256 principal, uint256 shockBps)
        external
        pure
        returns (uint256 down, uint256 up, uint256 restoreBps, uint256 givebackBps, uint256 gapBps)
    {
        (restoreBps, givebackBps, gapBps) = quote(shockBps);
        down = principal * (BPS - shockBps) / BPS;
        up = principal * (BPS + shockBps) / BPS;
    }
}
