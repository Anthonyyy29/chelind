<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            PlayerSeeder::class,
            SocialLinkSeeder::class,
        ]);

        $masterRole = Role::where('name', 'master')->first();

        User::firstOrCreate(
            ['email' => 'owner@chelind.test'],
            [
                'name' => 'Owner Chelind',
                'password' => 'password',
                'role_id' => $masterRole->id,
            ]
        );
    }
}
