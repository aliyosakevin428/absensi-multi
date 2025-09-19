import { FC } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type Props = {
    content: string;
};

const AboutPage: FC<Props> = () => {
    return (
        <WelcomeLayout>
            <h1>Multimedia Lahai Roi Balikpapan</h1>
        </WelcomeLayout>
    );
};

export default AboutPage;
