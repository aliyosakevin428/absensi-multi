import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';
import { Button } from './ui/button';

type Props = {
    label?: string;
};

const BackButton: FC<Props> = ({ label = 'Kembali' }) => {
    return (
        <Button
            variant={'secondary'}
            onClick={() => {
                window.history.back();
            }}
        >
            <ArrowLeft />
            {label}
        </Button>
    );
};

export default BackButton;
