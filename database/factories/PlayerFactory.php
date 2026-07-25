<?php

namespace Database\Factories;

use App\Models\Player;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Player>
 */
class PlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->name(),
            'position' => fake()->randomElement([
                'Goalkeeper',
                'Defender',
                'Central Midfielder',
                'Attacking Midfielder',
                'Forward',
                'Striker',
            ]),
            'photo' => 'players/'.fake()->uuid().'.jpg',
            'is_active' => true,
        ];
    }
}
