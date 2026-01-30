<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update LED products (indoor_led, outdoor_led) to use 'sqft' unit
        DB::table('products')
            ->whereIn('product_type', ['indoor_led', 'outdoor_led'])
            ->update(['unit' => 'sqft']);

        // Update all other products (controllers, cables, accessories, etc.) to use 'qty' unit
        DB::table('products')
            ->whereNotIn('product_type', ['indoor_led', 'outdoor_led'])
            ->orWhereNull('product_type')
            ->update(['unit' => 'qty']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: We're not reversing to 'INR' as that was incorrect data.
        // If you need to rollback, you'll need to restore from a backup.
        // Leaving this empty as restoring incorrect data is not recommended.
    }
};
