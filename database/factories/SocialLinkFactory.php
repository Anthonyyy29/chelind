<?php

namespace Database\Factories;

use App\Models\SocialLink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SocialLink>
 */
class SocialLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $platform = fake()->unique()->randomElement(['facebook', 'instagram', 'twitter', 'youtube', 'tiktok']);

        return [
            'platform' => $platform,
            'handle' => '@'.fake()->userName(),
            'url' => 'https://'.$platform.'.com/'.fake()->userName(),
            'description' => fake()->optional()->sentence(),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
