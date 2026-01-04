import Illustration from '@/components/illustration';
import SectionContainer from '../layouts/section-container';

const HeroSection = () => {
    return (
        <SectionContainer>
            <div className="grid items-center gap-16 py-16 md:grid-cols-2">
                <div className="mx-auto max-w-xl space-y-6 text-center md:mx-0 md:text-left">
                    <h2 className="text-base font-medium tracking-wide text-muted-foreground">Selamat datang di</h2>

                    <h1 className="text-4xl leading-tight font-bold text-foreground md:text-5xl">
                        Website Multimedia
                        <br />
                        Lahai Roi Balikpapan
                    </h1>

                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Situs ini dipersiapkan sebagai pusat informasi dan pengolahan data anggota Tim Multimedia Lahai Roi Balikpapan serta informasi
                        seputar kegiatan Gereja Toraja Jemaat Lahai Roi Balikpapan.
                    </p>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
                        <Illustration src="/images/undraw/undraw_getting-coffee_rzv2.svg" variant="primary" className="opacity-90" />
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
};

export default HeroSection;
