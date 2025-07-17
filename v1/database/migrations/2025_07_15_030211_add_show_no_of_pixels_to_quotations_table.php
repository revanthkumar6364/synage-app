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
            $table->boolean('show_no_of_pixels')->default(true)->after('show_hsn_code');
            $table->boolean('show_billing_in_print')->default(true)->after('show_no_of_pixels');
            $table->boolean('show_shipping_in_print')->default(true)->after('show_billing_in_print');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn('show_no_of_pixels');
            $table->dropColumn('show_billing_in_print');
            $table->dropColumn('show_shipping_in_print');
        });
    }
};
