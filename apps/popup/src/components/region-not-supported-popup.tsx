import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronRight } from "lucide-react";

interface RegionNotSupportedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  region?: string;
}

export function RegionNotSupportedPopup({
  isOpen,
  onClose,
  region,
}: RegionNotSupportedPopupProps) {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;

    setIsSubmitting(true);

    try {
      // Dummy implementation - just log to console for now
      console.log("Region request submitted:", {
        country: country.trim(),
        email: email.trim() || undefined,
        timestamp: new Date().toISOString(),
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success and close popup
      alert(
        "Region request submitted successfully! We'll notify you when we support your region."
      );
      onClose();
    } catch (error) {
      console.error("Error submitting region request:", error);
      alert("Failed to submit region request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed dark inset-0 bg-[#1e1e1e] flex items-center justify-center z-50"
      onClick={(e) => e.preventDefault()}
    >
      <div
        className="rounded-xl shadow-sm border-white/[0.16] p-4 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center flex flex-col gap-[9px]">
          <div className="flex relative items-center justify-center">
            <img src="/close-tag.png" className="-top-4 right-41 absolute" />
            <img src="/globe.png" />
          </div>
          <h2 className="text-base">
            We're not available in your region ({region || "XX"})
          </h2>
          <p className="text-white/60 w-full text-[14px]">
            Our onramp services aren't supported in your region currently. We're
            expanding fast and aim to be available to you soon. Ping us below to
            request a region!
          </p>
        </div>

        {!showForm ? (
          <div className="pt-4">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] rounded-full! transition ease-in-out duration-150 flex items-center justify-center gap-1"
            >
              Request Region
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <form
            className="space-y-3 overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              handleSubmit(e);
            }}
          >
            <div
              className={`transition-all! duration-300! ease-in-out! ${
                showForm
                  ? "opacity-100 translate-y-0 max-h-96"
                  : "opacity-0 -translate-y-4 max-h-0"
              }`}
            >
              <div className="space-y-4 pt-4">
                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Your Country/Region
                  </label>
                  <Input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., Canada"
                    required
                    className="block w-full p-4 rounded-lg h-[54px] bg-[#303030]! border border-[rgba(255,255,255,0.18)] focus:ring-blue-500 focus:border-blue-500 focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 placeholder:text-base placeholder:font-base"
                  />
                </div>

                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Email Address (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="block w-full p-4 rounded-lg h-[54px] bg-[#303030]! border border-[rgba(255,255,255,0.18)] focus:ring-blue-500 focus:border-blue-500 focus-visible:border-[#AF9EF9] hover:border-[#AF9EF9]/70 placeholder:text-base placeholder:font-base"
                  />
                  <p className="text-xs text-gwhite/60 mt-1">
                    We'll notify you when we support your region
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`flex space-x-3 pt-4 transition-all duration-300 ease-in-out ${
                showForm
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Button
                type="submit"
                disabled={!country.trim() || isSubmitting}
                className="w-full rounded-full! border-none bg-[#AB9FF2] text-black hover:bg-[#AB9FF2]/90 disabled:opacity-70 px-4 h-[58px] transition ease-in-out duration-150"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
