
import Hero from '@/components/hero';
import AboutSection from '@/components/about-section';
import ActivitiesSection from '@/components/activities-section';
import PhasesSection from '@/components/phases-section';
import MentorSection from '@/components/mentor-section';
import LocationSection from '@/components/location-section';
import MapSection from '@/components/map-section';
import FaqSection from '@/components/faq-section';
import VolunteerSection from '@/components/volunteer-section';
import Footer from '@/components/footer';
import UserDashboardOrCTA from '@/components/user-dashboard-or-cta';
import { Analytics } from "@vercel/analytics/react"
import HostingSection from '@/components/hosting-section';
import FloatingNav from '@/components/floating-nav';

export function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <FloatingNav />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <ActivitiesSection />
        <PhasesSection />
        <MentorSection />
        <UserDashboardOrCTA />
        <LocationSection />
        <MapSection />
        <FaqSection />
        <VolunteerSection />
        <HostingSection />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
