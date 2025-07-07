<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('product_type')->nullable();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->text('description')->nullable();
            $table->string('size')->nullable();
            $table->decimal('h_mm', 10, 2)->nullable();
            $table->decimal('w_mm', 10, 2)->nullable();
            $table->string('size_inch')->nullable();
            $table->decimal('upto_pix', 10, 2)->nullable();
            $table->decimal('price', 10, 2);
            $table->string('unit')->nullable();
            $table->decimal('price_per_sqft', 10, 2)->nullable();
            $table->string('brand')->nullable();
            $table->string('hsn_code')->nullable();
            $table->string('type')->nullable();
            $table->decimal('gst_percentage', 5, 2)->nullable();
            $table->decimal('min_price', 10, 2)->nullable();
            $table->decimal('max_price', 10, 2)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
