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
            $table->enum('sub_status', ['open', 'hot', 'cold'])->nullable()->after('status');
            $table->timestamp('sub_status_updated_at')->nullable()->after('sub_status');
            $table->text('sub_status_notes')->nullable()->after('sub_status_updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn(['sub_status', 'sub_status_updated_at', 'sub_status_notes']);
        });
    }
};
