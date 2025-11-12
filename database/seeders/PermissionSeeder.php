<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected function resetPermissionsOnly(): void {}

    public function run(): void
    {
        $permissionGroups = [
            'settings' => [
                'open adminer' => ['Superadmin'],
            ],
            'dashboard' => [
                'dashboard' => ['*'],
                'profile' => ['*'],
                'documentation' => ['*'],
            ],
            'user' => [
                'menu user' => ['*'],
                'index user' => ['*'],
                'show user' => ['*'],
                'create user' => ['Admin', 'Superadmin'],
                'edit user' => ['Admin', 'Superadmin'],
                'update user' => ['Admin', 'Superadmin'],
                'delete user' => ['Admin', 'Superadmin'],
            ],
            'team' => [
                'menu team' => ['*'],
                'index team' => ['*'],
                'show team' => ['*'],
                'create team' => ['Admin', 'Superadmin'],
                'edit team' => ['Admin', 'Superadmin'],
                'update team' => ['Admin', 'Superadmin'],
                'delete team' => ['Admin', 'Superadmin'],
            ],
            'position' => [
                'menu position' => ['*'],
                'index position' => ['*'],
                'show position' => ['*'],
                'create position' => ['Admin', 'Superadmin'],
                'edit position' => ['Admin', 'Superadmin'],
                'update position' => ['Admin', 'Superadmin'],
                'delete position' => ['Admin', 'Superadmin'],
            ],
            'role' => [
                'menu role' => ['Superadmin'],
                'index role' => ['Superadmin'],
                'show role' => ['Superadmin'],
                'create role' => ['Superadmin'],
                'edit role' => ['Superadmin'],
                'update role' => ['Superadmin'],
                'delete role' => ['Superadmin'],
            ],
            'event' => [
                'menu event' => ['*'],
                'index event' => ['*'],
                'show event' => ['*'],
                'create event' => ['Admin', 'Superadmin'],
                'edit event' => ['Admin', 'Superadmin'],
                'update event' => ['Admin', 'Superadmin'],
                'delete event' => ['Admin', 'Superadmin'],
            ],
            'event type' => [
                'menu eventType' => ['*'],
                'index eventType' => ['*'],
                'show eventType' => ['*'],
                'create eventType' => ['Admin', 'Superadmin'],
                'edit eventType' => ['Admin', 'Superadmin'],
                'update eventType' => ['Admin', 'Superadmin'],
                'delete eventType' => ['Admin', 'Superadmin'],
            ],
            'attendance' => [
                'menu attendance' => ['*'],
                'index attendance' => ['*'],
                'show attendance' => ['*'],
                'create attendance' => ['Admin', 'Superadmin'],
                'edit attendance' => ['Admin', 'Superadmin'],
                'update attendance' => ['Admin', 'Superadmin'],
                'delete attendance' => ['Admin', 'Superadmin'],
            ],
            'absent_reason' => [
                'menu absent reason' => ['*'],
                'index absent reason' => ['*'],
                'show absent reason' => ['*'],
                'create absent reason' => ['Admin', 'Superadmin'],
                'edit absent reason' => ['Admin', 'Superadmin'],
                'update absent reason' => ['Admin', 'Superadmin'],
                'delete absent reason' => ['Admin', 'Superadmin'],
            ],
            'permission' => [
                'menu permission' => ['Superadmin'],
                'index permission' => ['Superadmin'],
                'show permission' => ['Superadmin'],
                'create permission' => ['Superadmin'],
                'edit permission' => ['Superadmin'],
                'update permission' => ['Superadmin'],
                'delete permission' => ['Superadmin'],
            ],
            'news' => [
                'menu news' => ['*'],
                'index news' => ['*'],
                'show news' => ['*'],
                'create news' => ['Admin', 'Superadmin'],
                'edit news' => ['Admin', 'Superadmin'],
                'update news' => ['Admin', 'Superadmin'],
                'delete news' => ['Admin', 'Superadmin'],
            ],
        ];

        foreach ($permissionGroups as $group => $permissions) {
            foreach ($permissions as $permissionName => $roles) {
                $permission = Permission::updateOrCreate([
                    'name' => $permissionName,
                    'group' => $group,
                ], []);

                if ($roles === ['*']) {
                    $roles = Role::all()->pluck('name')->toArray();
                }

                foreach ($roles as $roleName) {
                    $role = Role::where('name', $roleName)->first();
                    if ($role) {
                        $role->givePermissionTo($permission);
                    }
                }
            }
        }
    }
}
