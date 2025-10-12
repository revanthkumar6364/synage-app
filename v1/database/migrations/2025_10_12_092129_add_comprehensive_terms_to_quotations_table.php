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
            // Add new comprehensive terms fields

            // General terms (applies to all)
            $table->text('general_pricing_terms')->nullable()->after('electrical_terms');
            $table->text('general_warranty_terms')->nullable()->after('general_pricing_terms');
            $table->text('general_delivery_terms')->nullable()->after('general_warranty_terms');
            $table->text('general_payment_terms')->nullable()->after('general_delivery_terms');
            $table->text('general_site_readiness_terms')->nullable()->after('general_payment_terms');
            $table->text('general_installation_scope_terms')->nullable()->after('general_site_readiness_terms');
            $table->text('general_ownership_risk_terms')->nullable()->after('general_installation_scope_terms');
            $table->text('general_force_majeure_terms')->nullable()->after('general_ownership_risk_terms');

            // Indoor LED specific terms
            $table->text('indoor_data_connectivity_terms')->nullable()->after('general_force_majeure_terms');
            $table->text('indoor_infrastructure_readiness_terms')->nullable()->after('indoor_data_connectivity_terms');
            $table->text('indoor_logistics_support_terms')->nullable()->after('indoor_infrastructure_readiness_terms');
            $table->text('indoor_general_conditions_terms')->nullable()->after('indoor_logistics_support_terms');

            // Outdoor LED specific terms
            $table->text('outdoor_approvals_permissions_terms')->nullable()->after('indoor_general_conditions_terms');
            $table->text('outdoor_data_connectivity_terms')->nullable()->after('outdoor_approvals_permissions_terms');
            $table->text('outdoor_power_mounting_terms')->nullable()->after('outdoor_data_connectivity_terms');
            $table->text('outdoor_logistics_site_access_terms')->nullable()->after('outdoor_power_mounting_terms');
            $table->text('outdoor_general_conditions_terms')->nullable()->after('outdoor_logistics_site_access_terms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            // Drop the comprehensive terms fields
            $table->dropColumn([
                'general_pricing_terms',
                'general_warranty_terms',
                'general_delivery_terms',
                'general_payment_terms',
                'general_site_readiness_terms',
                'general_installation_scope_terms',
                'general_ownership_risk_terms',
                'general_force_majeure_terms',
                'indoor_data_connectivity_terms',
                'indoor_infrastructure_readiness_terms',
                'indoor_logistics_support_terms',
                'indoor_general_conditions_terms',
                'outdoor_approvals_permissions_terms',
                'outdoor_data_connectivity_terms',
                'outdoor_power_mounting_terms',
                'outdoor_logistics_site_access_terms',
                'outdoor_general_conditions_terms',
            ]);
        });
    }
};
