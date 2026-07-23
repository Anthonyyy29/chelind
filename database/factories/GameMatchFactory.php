<?php

namespace Database\Factories;

use App\Models\GameMatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GameMatch>
 */
class GameMatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'external_id' => fake()->unique()->numberBetween(100000, 999999),
            'competition' => 'Premier League',
            'opponent' => fake()->company(),
            'is_home' => fake()->boolean(),
            'kickoff_at' => fake()->dateTimeBetween('now', '+2 months'),
            'status' => 'SCHEDULED',
            'score_home' => null,
            'score_away' => null,
            'last_synced_at' => now(),
        ];
    }

    /**
     * Indicate that the match has finished, with a final score.
     */
    public function finished(): static
    {
        return $this->state(fn (array $attributes) => [
            'kickoff_at' => fake()->dateTimeBetween('-2 months', 'now'),
            'status' => 'FINISHED',
            'score_home' => fake()->numberBetween(0, 5),
            'score_away' => fake()->numberBetween(0, 5),
        ]);
    }
}
