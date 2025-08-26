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
            // Make billing address fields nullable
            $table->text('billing_address')->nullable()->change();
            $table->string('billing_location')->nullable()->change();
            $table->string('billing_city')->nullable()->change();
            $table->string('billing_zip_code')->nullable()->change();

            // Make shipping address fields nullable
            $table->text('shipping_address')->nullable()->change();
            $table->string('shipping_location')->nullable()->change();
            $table->string('shipping_city')->nullable()->change();
            $table->string('shipping_zip_code')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Revert billing address fields to required
            $table->text('billing_address')->nullable(false)->change();
            $table->string('billing_location')->nullable(false)->change();
            $table->string('billing_city')->nullable(false)->change();
            $table->string('billing_zip_code')->nullable(false)->change();

            // Revert shipping address fields to required
            $table->text('shipping_address')->nullable(false)->change();
            $table->string('shipping_location')->nullable(false)->change();
            $table->string('shipping_city')->nullable(false)->change();
            $table->string('shipping_zip_code')->nullable(false)->change();
        });
    }
};
