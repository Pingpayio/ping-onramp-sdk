import { useState, useMemo } from "react";
import type { PaymentCurrency } from "@pingpay/onramp-types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Logo } from "./logo";

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currencies: PaymentCurrency[];
  selectedCurrency: string;
  onSelectCurrency: (currencyId: string) => void;
}

const currenciesList = [
  {
    id: "USD",
    name: "United States Dollar",
    flag: "/usd.svg",
  },
  {
    id: "GBP",
    name: "Great British Pound",
    flag: "/gbp 1.svg",
  },
  {
    id: "EUR",
    name: "EURO",
    flag: "/eur.svg.svg",
  },
  {
    id: "CAD",
    name: "Canadian Dollar",
    flag: "/cad.svg.svg",
  },
  {
    id: "AUD",
    name: "Australian Dollar",
    flag: "/aud 1.svg",
  },
  {
    id: "INR",
    name: "Indian Rupee",
    flag: "/inr 1.svg",
  },
  {
    id: "HKD",
    name: "Hong Kong Dollar",
    flag: "/hkd 1.svg",
  },
  {
    id: "THB",
    name: "Thai Bhat",
    flag: "/thb 1.svg",
  },
];

export function CurrencySelector({
  isOpen,
  onClose,
  // currencies,
  selectedCurrency,
  onSelectCurrency,
}: CurrencySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return currenciesList;
    return currenciesList.filter(
      (currency) =>
        currency.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectCurrency = (currencyId: string) => {
    onSelectCurrency(currencyId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] backdrop-blur-sm">
      <div className="flex flex-col h-full gap-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between py-[12px] px-[16px] ">
          {/* Spacer for centering */}
          <Logo />
          <h2 className="text-[24px] font-bold text-white">
            Select Fiat Currency
          </h2>
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
              placeholder="Search name or currency code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none mx-3 p-0 placeholder:text-base! placeholder:text-[#FFFFFF99]!"
            />
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {filteredCurrencies.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                No currencies found
              </div>
            ) : (
              filteredCurrencies.map((currency) => (
                <Button
                  key={currency.id}
                  onClick={() => handleSelectCurrency(currency.id)}
                  variant="ghost"
                  className={`w-full justify-start p-4 h-auto rounded-[8px] hover:bg-white/10 hover:border-[#AF9EF9]! ${
                    selectedCurrency === currency.id
                      ? "bg-[#AB9FF2]/20 border border-[#AB9FF2]"
                      : "bg-white/5 border border-white/[0.18]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[23px]">
                    <img
                      src={currency.flag}
                      alt={currency.name}
                      width="28"
                      height="28"
                      className="rounded-full"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-white text-sm font-medium">
                        {currency.id}
                      </span>
                      <span className="text-white/60 text-sm">
                        {currency.name}
                      </span>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
