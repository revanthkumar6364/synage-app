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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('business_id')->nullable();
            $table->string('business_name');
            $table->string('gst_number')->nullable();
            $table->string('industry_type')->nullable();

            // Billing Address
            $table->text('billing_address')->nullable();
            $table->string('billing_location')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_zip_code')->nullable();

            // Shipping Address
            $table->text('shipping_address')->nullable();
            $table->string('shipping_location')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_zip_code')->nullable();
            $table->boolean('same_as_billing')->default(false);

            // Status
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
