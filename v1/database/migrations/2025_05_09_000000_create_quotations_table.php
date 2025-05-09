<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('quotation_number')->unique()->nullable(); // Made nullable since we generate it
            $table->string('title');
            $table->foreignId('account_id')->constrained('accounts'); // Made required
            $table->foreignId('account_contact_id')->nullable()->constrained('account_contacts');
            $table->string('available_size');
            $table->string('proposed_size');
            $table->text('description');
            $table->date('estimate_date');

            // Billing Details
            $table->text('billing_address');
            $table->string('billing_location');
            $table->string('billing_city');
            $table->string('billing_zip_code');

            // Shipping Details
            $table->text('shipping_address');
            $table->string('shipping_location');
            $table->string('shipping_city');
            $table->string('shipping_zip_code');
            $table->boolean('same_as_billing')->default(false);

            // Additional Information
            $table->text('notes')->nullable();
            $table->text('client_scope')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft'); // Changed to enum

            // Financial Details
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotations');
    }
};