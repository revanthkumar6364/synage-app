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
            $table->foreignId('parent_id')->nullable()->constrained('quotations');
            $table->string('reference')->unique();
            $table->string('quotation_number')->unique()->nullable(); // Made nullable since we generate it
            $table->string('title');
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->foreignId('account_contact_id')->nullable()->constrained('account_contacts')->onDelete('set null');
            $table->foreignId('sales_user_id')->constrained('users')->onDelete('restrict');
            $table->string('product_type')->nullable();
            $table->foreignId('selected_product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('available_size_width')->nullable();
            $table->string('available_size_height')->nullable();
            $table->string('available_size_unit')->nullable();
            $table->string('proposed_size_width')->nullable();
            $table->string('proposed_size_height')->nullable();
            $table->string('proposed_size_unit')->nullable();
            $table->string('quantity')->nullable();
            $table->string('max_quantity')->nullable();
            $table->string('available_size_width_mm')->nullable();
            $table->string('available_size_height_mm')->nullable();
            $table->string('proposed_size_width_mm')->nullable();
            $table->string('proposed_size_height_mm')->nullable();
            $table->string('available_size_width_ft')->nullable();
            $table->string('available_size_height_ft')->nullable();
            $table->string('proposed_size_width_ft')->nullable();
            $table->string('proposed_size_height_ft')->nullable();
            $table->string('available_size_sqft')->nullable();
            $table->string('proposed_size_sqft')->nullable();
            $table->string('facade_type')->nullable();
            $table->text('facade_notes')->nullable();

            $table->text('description');
            $table->date('estimate_date');
            $table->string('category')->nullable();

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
            $table->text('taxes_terms')->nullable();
            $table->text('warranty_terms')->nullable();
            $table->text('delivery_terms')->nullable();
            $table->text('payment_terms')->nullable();
            $table->text('electrical_terms')->nullable();

            // Financial Details
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft'); // Changed to enum
            $table->boolean('editable')->default(true);
            $table->text('last_action')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->unsignedBigInteger('rejected_by')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->foreign('approved_by')->references('id')->on('users');
            $table->foreign('rejected_by')->references('id')->on('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quotations');
    }
};
