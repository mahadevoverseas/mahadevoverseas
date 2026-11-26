import Journey from "@/components/sections/Journey";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = { title: "Your Journey", description: "Six clear steps from free counselling to boarding your flight — see how Mahadev Overseas guides you." };

export default function JourneyPage() {
  return (
    <>
      <Journey />
      <CtaBand />
    </>
  );
}
