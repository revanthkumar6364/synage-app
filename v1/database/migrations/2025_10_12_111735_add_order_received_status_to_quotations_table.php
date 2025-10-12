<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add order_received to the status enum
        DB::statement("ALTER TABLE quotations MODIFY COLUMN status ENUM('draft', 'pending', 'approved', 'rejected', 'order_received') DEFAULT 'draft'");
    }

    public function down()
    {
        // Remove order_received from the status enum
        DB::statement("ALTER TABLE quotations MODIFY COLUMN status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft'");
    }
};
