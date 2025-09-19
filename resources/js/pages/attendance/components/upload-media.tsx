import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Attendance } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const UploadMedia = ({ attendance }: { attendance: Attendance }) => {
    const { setData, post } = useForm({
        file: undefined as File | undefined,
    });

    const handleUploadMedia = () => {
        post(route('attendances.media.upload', attendance.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Media Berhasil Diupload');
                window.location.href = route('attendance.show', attendance.id);
            },
        });
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Foto Kegiatan Acara Di Sini</CardTitle>
                <CardDescription>Masukkan foto atau dokumentasi kegiatan acara di sini.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="file" onChange={(e) => setData('file', e.target.files?.[0])} className="px-2 pt-2" />
                <Button className='mt-2' onClick={handleUploadMedia}>Upload</Button>
            </CardContent>
        </Card>
    );
};

export default UploadMedia;
