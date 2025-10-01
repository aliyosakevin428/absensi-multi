import SectionContainer from '../layouts/section-container';

const HeroSection = () => {
    return (
        <SectionContainer>
            <div className="mx-auto w-full space-y-1 py-5 text-center md:px-20">
                <h2 className="py-4 text-4xl font-bold text-foreground">Selamat datang di</h2>
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold text-foreground uppercase">website Multimedia Lahai Roi Balikpapan</h1>
                </div>
                <p className="px-4 py-5 text-left text-lg text-foreground">
                    Situs ini dipersiapkan sebagai pusat informasi dan pengolahan data anggota Tim Multimedia Lahai Roi Balikpapan serta informasi
                    seputar kegiatan - Kegiatan Gereja Toraja Jemaat Lahai Roi Balikpapan.
                </p>
            </div>
        </SectionContainer>
    );
};

export default HeroSection;
