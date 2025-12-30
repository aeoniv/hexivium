import Hero from '@/app/components/hero';
import AboutSection from '@/app/components/about-section';
import ActivitiesSection from '@/app/components/activities-section';
import PhasesSection from '@/app/components/phases-section';
import MentorSection from '@/app/components/mentor-section';
import LocationSection from '@/app/components/location-section';
import MapSection from '@/app/components/map-section';
import FaqSection from '@/app/components/faq-section';
import VolunteerSection from '@/app/components/volunteer-section';
import Footer from '@/app/components/footer';
import UserDashboardOrCTA from '@/app/components/user-dashboard-or-cta';
import { Analytics } from "@vercel/analytics/react"
import HostingSection from '@/app/components/hosting-section';
import FloatingNav from '@/app/components/floating-nav';

export default function EventsPage() {
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
