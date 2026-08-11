import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, em, groupBy } from '@/lib/utils';
import { Permission, Role } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Edit, KeyRound, Plus, ShieldCheck } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';
import PermissionFormSheet from '../permission/components/permission-form-sheet';
import RoleFormSheet from './components/role-form-sheet';

type Props = {
    role: Role;
    permissions: Permission[];
};

const ShowRole: FC<Props> = ({ role, permissions }) => {
    const groupPermissions = groupBy(permissions, 'group');

    const { data, setData, put } = useForm({
        permissions: role.permissions.map((permission) => permission.name),
    });

    const handleSubmit = () => {
        put(route('role.update', role.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Role berhasil diperbarui');
            },
            onError: (e) => {
                toast.error(em(e));
            },
        });
    };

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        setData(
            'permissions',
            checked ? [...new Set([...data.permissions, permissionName])] : data.permissions.filter((permission) => permission !== permissionName),
        );
    };

    return (
        <AppLayout
            title="Detail Role"
            description={`Kelola role ${capitalizeWords(role.name)} beserta permission yang dimilikinya.`}
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <Link href={route('role.index')}>
                        <Button variant="outline">
                            <ArrowLeft />
                            Kembali
                        </Button>
                    </Link>

                    <RoleFormSheet purpose="edit" role={role}>
                        <Button variant="outline">
                            <Edit />
                            Edit Role
                        </Button>
                    </RoleFormSheet>

                    <Button onClick={handleSubmit}>
                        <Check />
                        Simpan Perubahan
                    </Button>
                </div>
            }
        >
            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/20 p-5">
                    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShieldCheck className="size-6" />
                            </div>

                            <div>
                                <CardTitle className="text-xl">{capitalizeWords(role.name)}</CardTitle>

                                <CardDescription className="mt-1">Role dan hak akses yang digunakan dalam sistem</CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-full border bg-background px-3 py-1.5 text-sm font-medium sm:self-auto">
                            <KeyRound className="size-4 text-primary" />
                            <span>{data.permissions.length} Permission Aktif</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-5">
                    {data.permissions.length > 0 ? (
                        <div>
                            <p className="mb-3 text-sm font-medium">Permission yang dimiliki</p>

                            <div className="flex flex-wrap gap-2">
                                {data.permissions.map((permission) => (
                                    <div key={permission} className="inline-flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                                        <ShieldCheck className="size-3.5 text-primary" />

                                        <span>{capitalizeWords(permission)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
                            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                                <KeyRound className="size-5 text-muted-foreground" />
                            </div>

                            <p className="text-sm font-medium">Belum ada permission</p>

                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                Role ini belum memiliki permission. Pilih permission di bawah untuk memberikan hak akses.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <HeadingSmall
                title="Permission"
                description="Pilih permission yang ingin diberikan kepada role ini."
                actions={
                    <PermissionFormSheet purpose="create">
                        <Button variant="secondary">
                            <Plus />
                            Tambah Permission
                        </Button>
                    </PermissionFormSheet>
                }
            />

            {Object.keys(groupPermissions).length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(groupPermissions).map(([group, groupPermissionList]) => {
                        const activePermissions = groupPermissionList.filter((permission) => data.permissions.includes(permission.name)).length;

                        return (
                            <Card key={group} className="overflow-hidden py-3 transition-shadow hover:shadow-sm">
                                <CardHeader className="border-b bg-muted/20 p-3 px-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base">{capitalizeWords(group)}</CardTitle>

                                            <CardDescription className="mt-1">
                                                {activePermissions} dari {groupPermissionList.length} dipilih
                                            </CardDescription>
                                        </div>

                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <KeyRound className="size-4" />
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        {groupPermissionList.map((permission) => {
                                            const isChecked = data.permissions.includes(permission.name);

                                            return (
                                                <Label
                                                    key={permission.id}
                                                    htmlFor={`permission-${permission.id}`}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                                        isChecked ? 'border-primary/30 bg-primary/5' : 'hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => handlePermissionChange(permission.name, checked === true)}
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm leading-none font-medium">{capitalizeWords(permission.name)}</p>

                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {isChecked ? 'Permission aktif' : 'Permission tidak aktif'}
                                                        </p>
                                                    </div>

                                                    {isChecked && <ShieldCheck className="size-4 shrink-0 text-primary" />}
                                                </Label>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                            <KeyRound className="size-6 text-muted-foreground" />
                        </div>

                        <h3 className="text-sm font-semibold">Belum ada permission</h3>

                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            Belum ada permission yang tersedia di sistem. Tambahkan permission terlebih dahulu untuk dapat memberikannya kepada role.
                        </p>

                        <PermissionFormSheet purpose="create">
                            <Button className="mt-4">
                                <Plus />
                                Tambah Permission
                            </Button>
                        </PermissionFormSheet>
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
};

export default ShowRole;
