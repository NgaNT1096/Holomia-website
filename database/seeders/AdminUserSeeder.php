<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /** Credentials come from .env (ADMIN_EMAIL / ADMIN_PASSWORD) so no password lives in git. */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin user.');

            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            ['name' => 'Holomia Admin', 'password' => Hash::make($password)],
        );
    }
}
