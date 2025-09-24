import { Phone } from 'lucide-react';
import { FC } from 'react';
import SectionContainer from './layouts/section-container';
import WelcomeLayout from './layouts/welcome-layout';

type Props = {
    content?: string;
};

const AboutPage: FC<Props> = ({ content }) => {
    return (
        <WelcomeLayout>
            <SectionContainer>
                <div className="mx-auto max-w-6xl space-y-20">
                    {/* Header */}
                    <header className="space-y-4 text-center">
                        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Multimedia Lahai Roi Balikpapan</h1>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            Kami adalah tim multimedia yang melayani dengan hati untuk mendukung ibadah dan kegiatan gereja melalui teknologi, desain,
                            dan kreativitas.
                        </p>
                    </header>

                    {/* Visi & Misi */}
                    <section className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
                        {/* Teks */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-foreground">Visi Kami</h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    Menjadi tim multimedia yang mendukung pertumbuhan rohani jemaat melalui pelayanan media kreatif, inovatif, dan
                                    relevan dengan perkembangan teknologi.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-foreground">Misi Kami</h2>
                                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                                    <li>Melayani dengan excellence dalam setiap ibadah dan event.</li>
                                    <li>Mengembangkan kreativitas dan inovasi dalam media.</li>
                                    <li>Meningkatkan kualitas teknis melalui pelatihan berkelanjutan.</li>
                                    <li>Menjadi wadah pelayanan dan pengembangan potensi anak muda.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Gambar ilustrasi */}
                        <div className="flex justify-center">
                            <img
                                src="/images/tim-multi.jpg"
                                alt="Tim Multimedia Lahai Roi Balikpapan"
                                width={500}
                                height={400}
                                className="rounded-xl object-cover shadow-lg"
                            />
                        </div>
                    </section>

                    {/* Optional: Konten tambahan dari props */}
                    {content && (
                        <section className="prose prose-neutral dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </section>
                    )}

                    <footer className="space-y-4 text-center">
                        <p className="text-lg text-muted-foreground">Tertarik untuk melayani bersama kami?</p>
                        <ul className="inline-block space-y-2 text-left text-base font-medium">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-semibold">Gilbert Novalentino</span> – 0895-3418-25616
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-semibold">Sandison S. Tandiri Lambun</span> – 0852-4165-9828
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-semibold">Joni Salenda</span> – 0812-5058-2223
                            </li>
                        </ul>
                    </footer>
                </div>
            </SectionContainer>
        </WelcomeLayout>
    );
};

export default AboutPage;
