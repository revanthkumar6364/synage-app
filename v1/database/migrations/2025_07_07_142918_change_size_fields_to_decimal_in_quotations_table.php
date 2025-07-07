<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Change size fields from varchar to decimal
            $table->decimal('available_size_width_mm', 10, 2)->change();
            $table->decimal('available_size_height_mm', 10, 2)->change();
            $table->decimal('available_size_width_ft', 10, 2)->change();
            $table->decimal('available_size_height_ft', 10, 2)->change();
            $table->decimal('available_size_sqft', 10, 2)->change();
            $table->decimal('proposed_size_width_mm', 10, 2)->change();
            $table->decimal('proposed_size_height_mm', 10, 2)->change();
            $table->decimal('proposed_size_width_ft', 10, 2)->change();
            $table->decimal('proposed_size_height_ft', 10, 2)->change();
            $table->decimal('proposed_size_sqft', 10, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Change back to varchar
            $table->string('available_size_width_mm')->change();
            $table->string('available_size_height_mm')->change();
            $table->string('available_size_width_ft')->change();
            $table->string('available_size_height_ft')->change();
            $table->string('available_size_sqft')->change();
            $table->string('proposed_size_width_mm')->change();
            $table->string('proposed_size_height_mm')->change();
            $table->string('proposed_size_width_ft')->change();
            $table->string('proposed_size_height_ft')->change();
            $table->string('proposed_size_sqft')->change();
        });
    }
};
