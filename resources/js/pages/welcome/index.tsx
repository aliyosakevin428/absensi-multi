import WelcomeLayout from './layouts/welcome-layout';
import HeroSection from './partials/hero-section';
import NewsSection from './partials/news-section';

export default function Welcome() {
    return (
        <WelcomeLayout>
            <HeroSection />
            <NewsSection />
        </WelcomeLayout>
    );
}
