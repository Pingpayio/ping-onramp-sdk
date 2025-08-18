import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Logo } from "./logo";

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: string;
  onSelectAsset: (assetId: string) => void;
}

const assetsList = [
  {
    id: "USD",
    name: "ZEC",
    flag: "/Zcash.png",
  },
  {
    id: "Near",
    name: "NEAR",
    flag: "/Near.png",
  },
  {
    id: "Tether USD",
    name: "USDT",
    flag: "/Tether USD.png",
  },
  {
    id: "USD Coin",
    name: "USDC",
    flag: "/USD Coin.png",
  },
  {
    id: "Solana",
    name: "SOL",
    flag: "/Solana.png",
  },
  {
    id: "Bitcoin",
    name: "BTC",
    flag: "/Bitcoin.png",
  },
  {
    id: "Loud",
    name: "LOUD",
    flag: "/Loud.png",
  },
  {
    id: "Ethereum",
    name: "ETH",
    flag: "/ETH.png",
  },
];

export function AssetSelector({
  isOpen,
  onClose,
  selectedAsset,
  onSelectAsset,
}: AssetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assetsList;
    return assetsList.filter(
      (asset) =>
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectAsset = (assetId: string) => {
    onSelectAsset(assetId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#121212] backdrop-blur-sm">
      <div className="flex flex-col h-full gap-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between py-[12px] px-[16px] bg-[#121212] relative z-[10000]">
          <Logo />
          <h2 className="text-[24px] font-bold text-white">Select Asset</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="w-6 h-6 border-none! hover:border-none!"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M13.1836 1.14453L1.18359 13.1445M1.18359 1.14453L13.1836 13.1445"
                stroke="#AF9EF9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Button>
        </div>

        {/* Search Bar */}
        <div className=" px-[16px] flex justify-between w-full items-center">
          <div className="relative px-[16px] py-[5px] w-full items-center flex gap-[8px] bg-[#FFFFFF0D]! rounded-[8px]! border-[1px]! border-[#FFFFFF2E]! hover:border-[#AF9EF9]! focus:border-[#AF9EF9]! focus:border!">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M25 25L19.6833 19.6833M12.7778 22.5556C15.371 22.5556 17.858 21.5254 19.6917 19.6917C21.5254 17.858 22.5556 15.371 22.5556 12.7778C22.5556 10.1845 21.5254 7.69753 19.6917 5.86384C17.858 4.03016 15.371 3 12.7778 3C10.1845 3 7.69753 4.03016 5.86384 5.86384C4.03016 7.69753 3 10.1845 3 12.7778C3 15.371 4.03016 17.858 5.86384 19.6917C7.69753 21.5254 10.1845 22.5556 12.7778 22.5556Z"
                stroke="#AF9EF9"
                strokeWidth="1.57143"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search name or asset code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none mx-3 p-0 placeholder:text-base! placeholder:text-[#FFFFFF99]!"
            />
          </div>
        </div>

        {/* Asset List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredAssets.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                No assets found
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <Button
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset.id)}
                  variant="ghost"
                  className={`w-full justify-start p-4 h-auto rounded-[8px] hover:bg-white/10 hover:border-[#AF9EF9]! ${
                    selectedAsset === asset.id
                      ? "bg-[#AB9FF2]/20 border border-[#AB9FF2]"
                      : "bg-white/5 border border-white/[0.18]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[23px]">
                    <img
                      src={asset.flag}
                      alt={asset.name}
                      width="28"
                      height="28"
                      className="rounded-full"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-white text-sm font-medium">
                        {asset.id}
                      </span>
                      <span className="text-white/60 text-sm">
                        {asset.name}
                      </span>
                    </div>
                  </div>
                  {selectedAsset === asset.id && (
                    <svg
                      className="w-5 h-5 text-[#AB9FF2] ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
