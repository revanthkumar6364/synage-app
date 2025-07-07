<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, let's clean up any invalid data in the size fields
        DB::table('quotations')->where(function($query) {
            $query->where('available_size_width_mm', '')
                  ->orWhere('available_size_width_mm', null)
                  ->orWhere('available_size_height_mm', '')
                  ->orWhere('available_size_height_mm', null)
                  ->orWhere('available_size_width_ft', '')
                  ->orWhere('available_size_width_ft', null)
                  ->orWhere('available_size_height_ft', '')
                  ->orWhere('available_size_height_ft', null)
                  ->orWhere('available_size_sqft', '')
                  ->orWhere('available_size_sqft', null)
                  ->orWhere('proposed_size_width_mm', '')
                  ->orWhere('proposed_size_width_mm', null)
                  ->orWhere('proposed_size_height_mm', '')
                  ->orWhere('proposed_size_height_mm', null)
                  ->orWhere('proposed_size_width_ft', '')
                  ->orWhere('proposed_size_width_ft', null)
                  ->orWhere('proposed_size_height_ft', '')
                  ->orWhere('proposed_size_height_ft', null)
                  ->orWhere('proposed_size_sqft', '')
                  ->orWhere('proposed_size_sqft', null);
        })->update([
            'available_size_width_mm' => 0,
            'available_size_height_mm' => 0,
            'available_size_width_ft' => 0,
            'available_size_height_ft' => 0,
            'available_size_sqft' => 0,
            'proposed_size_width_mm' => 0,
            'proposed_size_height_mm' => 0,
            'proposed_size_width_ft' => 0,
            'proposed_size_height_ft' => 0,
            'proposed_size_sqft' => 0,
        ]);

        // Now let's convert any string values to proper decimal values
        $quotations = DB::table('quotations')->get();

        foreach ($quotations as $quotation) {
            $updates = [];

            // Clean up available size fields
            $updates['available_size_width_mm'] = $this->cleanNumericValue($quotation->available_size_width_mm);
            $updates['available_size_height_mm'] = $this->cleanNumericValue($quotation->available_size_height_mm);
            $updates['available_size_width_ft'] = $this->cleanNumericValue($quotation->available_size_width_ft);
            $updates['available_size_height_ft'] = $this->cleanNumericValue($quotation->available_size_height_ft);
            $updates['available_size_sqft'] = $this->cleanNumericValue($quotation->available_size_sqft);

            // Clean up proposed size fields
            $updates['proposed_size_width_mm'] = $this->cleanNumericValue($quotation->proposed_size_width_mm);
            $updates['proposed_size_height_mm'] = $this->cleanNumericValue($quotation->proposed_size_height_mm);
            $updates['proposed_size_width_ft'] = $this->cleanNumericValue($quotation->proposed_size_width_ft);
            $updates['proposed_size_height_ft'] = $this->cleanNumericValue($quotation->proposed_size_height_ft);
            $updates['proposed_size_sqft'] = $this->cleanNumericValue($quotation->proposed_size_sqft);

            DB::table('quotations')->where('id', $quotation->id)->update($updates);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this migration as it's just data cleanup
    }

    /**
     * Clean numeric value and convert to decimal
     */
    private function cleanNumericValue($value)
    {
        if (empty($value) || $value === null) {
            return 0;
        }

        // Remove any non-numeric characters except decimal point
        $cleaned = preg_replace('/[^0-9.]/', '', (string)$value);

        // Ensure it's a valid number
        if (!is_numeric($cleaned)) {
            return 0;
        }

        return (float)$cleaned;
    }
};
