import LandingLayout from "./LandingLayout";
import Banner from "./Banner/Banner";
import HomeContent from "./Home/HomeContent";

export default function LandingPage() {
  return (
    <LandingLayout>
      <Banner />
      <HomeContent />
    </LandingLayout>
  );
}
