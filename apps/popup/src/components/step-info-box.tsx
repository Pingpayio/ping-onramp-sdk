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
  // Check if this is a failed state (has the special red border color)
  const isFailedState = box.color.includes("rgba(255,100,103");
  
  return (
    <div
      className={cn(
        "w-full flex gap-3 bg-[#303030] border rounded-lg p-4 mb-4",
        box.color,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full size-8",
          isFailedState ? "bg-[rgba(255,100,103,0.6)]" : "",
        )}
      >
        {box.icon}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-lg text-gray-100">{box.title}</span>
        <p className="text-[#99a1af] text-sm">{box.desc}</p>
      </div>
    </div>
  );
}
