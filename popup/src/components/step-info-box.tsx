import { cn } from "@/lib/utils";

interface StepInfoBoxProps {
  box: StepBox;
}

export interface StepBox {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

export function StepInfoBox({ box }: StepInfoBoxProps) {
  return (
    <div
      className={cn(
        "w-full flex gap-3 bg-[#303030] border border-white/20 rounded-lg p-4 mb-4",
        box.color
      )}
    >
      <div className="flex">{box.icon}</div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-lg text-gray-100">{box.title}</span>
        <p className="text-gray-400 text-sm">{box.desc}</p>
      </div>
    </div>
  );
}
