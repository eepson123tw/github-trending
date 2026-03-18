import { I18nProvider } from "@/lib/i18n-context";
import StarField from "@/components/StarField";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendChart from "@/components/TrendChart";
import TimelineRiver from "@/components/TimelineRiver";
import CategoryBubbles from "@/components/CategoryBubbles";
import InsightCards from "@/components/InsightCards";
import SearchExplorer from "@/components/SearchExplorer";
import TopRepos from "@/components/TopRepos";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { fetchTrendingData } from "@/lib/sheets";

export const revalidate = 86400; // ISR: regenerate every 24 hours

export default async function Home() {
  const data = await fetchTrendingData();

  return (
    <I18nProvider>
      <main className="relative min-h-screen">
        <SmoothScroll />
        <StarField />
        <Navbar />
        <MusicPlayer />
        <LanguageSwitcher />
        <div className="relative z-10">
          <HeroSection />
          <div id="trends">
            <TrendChart data={data} />
          </div>
          <div id="timeline">
            <TimelineRiver data={data} />
          </div>
          <div id="categories">
            <CategoryBubbles data={data} />
          </div>
          <div id="insights">
            <InsightCards />
          </div>
          <div id="explore">
            <SearchExplorer data={data} />
          </div>
          <div id="leaderboard">
            <TopRepos data={data} />
          </div>
          <Footer />
        </div>
      </main>
    </I18nProvider>
  );
}
