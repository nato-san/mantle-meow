import type { Address } from "viem";
import { isAddress } from "viem";

export const internCatPassportAbi = [
  {
    type: "function",
    name: "mintPassport",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI_", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
] as const;

const configuredAddress = process.env.NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS;
const mantleSepoliaPassportAddress = "0x6010A49bCe00D0535472F636f80f30709ec5F414";
const fallbackAddress = process.env.NEXT_PUBLIC_MANTLE_CHAIN === "mainnet" ? undefined : mantleSepoliaPassportAddress;
const contractAddress = configuredAddress || fallbackAddress;

export const internCatPassportAddress =
  contractAddress && isAddress(contractAddress) ? (contractAddress as Address) : undefined;
