<?php

namespace Database\Factories;

use App\Models\Transfer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transfer>
 */
class TransferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $direction = fake()->randomElement(['in', 'out']);
        $otherClub = fake()->company();

        return [
            'direction' => $direction,
            'is_loan' => false,
            'player_name' => fake()->name(),
            'position' => fake()->randomElement(['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST']),
            'club_from' => $direction === 'in' ? $otherClub : 'Chelsea FC',
            'club_to' => $direction === 'in' ? 'Chelsea FC' : $otherClub,
            'fee' => fake()->randomFloat(1, 5, 150),
        ];
    }

    /**
     * Indicate that the transfer is a loan.
     */
    public function loan(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_loan' => true,
            'fee' => null,
        ]);
    }

    /**
     * Indicate that the transfer is a free transfer (no fee).
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'fee' => null,
        ]);
    }
}
