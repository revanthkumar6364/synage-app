-- =============================================
-- RADIANT SYNAGE APP - RECENT CHANGES ONLY
-- =============================================
-- This file contains only the NEW migrations from October 2025
-- Database: radiant_synage_app
-- Date: October 12, 2025

-- =============================================
-- 1. ADD COMPREHENSIVE TERMS TO QUOTATIONS TABLE
-- =============================================
-- Migration: 2025_10_12_092129_add_comprehensive_terms_to_quotations_table.php
-- Description: Adds separate terms for General, Indoor LED, and Outdoor LED

ALTER TABLE `quotations`
-- General terms (applies to all quotations)
ADD COLUMN `general_pricing_terms` text DEFAULT NULL AFTER `electrical_terms`,
ADD COLUMN `general_warranty_terms` text DEFAULT NULL AFTER `general_pricing_terms`,
ADD COLUMN `general_delivery_terms` text DEFAULT NULL AFTER `general_warranty_terms`,
ADD COLUMN `general_payment_terms` text DEFAULT NULL AFTER `general_delivery_terms`,
ADD COLUMN `general_site_readiness_terms` text DEFAULT NULL AFTER `general_payment_terms`,
ADD COLUMN `general_installation_scope_terms` text DEFAULT NULL AFTER `general_site_readiness_terms`,
ADD COLUMN `general_ownership_risk_terms` text DEFAULT NULL AFTER `general_installation_scope_terms`,
ADD COLUMN `general_force_majeure_terms` text DEFAULT NULL AFTER `general_ownership_risk_terms`,

-- Indoor LED specific terms
ADD COLUMN `indoor_data_connectivity_terms` text DEFAULT NULL AFTER `general_force_majeure_terms`,
ADD COLUMN `indoor_infrastructure_readiness_terms` text DEFAULT NULL AFTER `indoor_data_connectivity_terms`,
ADD COLUMN `indoor_logistics_support_terms` text DEFAULT NULL AFTER `indoor_infrastructure_readiness_terms`,
ADD COLUMN `indoor_general_conditions_terms` text DEFAULT NULL AFTER `indoor_logistics_support_terms`,

-- Outdoor LED specific terms
ADD COLUMN `outdoor_approvals_permissions_terms` text DEFAULT NULL AFTER `indoor_general_conditions_terms`,
ADD COLUMN `outdoor_data_connectivity_terms` text DEFAULT NULL AFTER `outdoor_approvals_permissions_terms`,
ADD COLUMN `outdoor_power_mounting_terms` text DEFAULT NULL AFTER `outdoor_data_connectivity_terms`,
ADD COLUMN `outdoor_logistics_site_access_terms` text DEFAULT NULL AFTER `outdoor_power_mounting_terms`,
ADD COLUMN `outdoor_general_conditions_terms` text DEFAULT NULL AFTER `outdoor_logistics_site_access_terms`;

-- =============================================
-- 2. ADD ORDER RECEIVED STATUS TO QUOTATIONS TABLE
-- =============================================
-- Migration: 2025_10_12_111735_add_order_received_status_to_quotations_table.php
-- Description: Adds 'order_received' status to quotation workflow

ALTER TABLE `quotations`
MODIFY COLUMN `status` enum('draft','pending','approved','rejected','order_received') NOT NULL DEFAULT 'draft';

-- =============================================
-- ROLLBACK QUERIES (if needed)
-- =============================================

-- To rollback the comprehensive terms changes:
/*
ALTER TABLE `quotations`
DROP COLUMN `general_pricing_terms`,
DROP COLUMN `general_warranty_terms`,
DROP COLUMN `general_delivery_terms`,
DROP COLUMN `general_payment_terms`,
DROP COLUMN `general_site_readiness_terms`,
DROP COLUMN `general_installation_scope_terms`,
DROP COLUMN `general_ownership_risk_terms`,
DROP COLUMN `general_force_majeure_terms`,
DROP COLUMN `indoor_data_connectivity_terms`,
DROP COLUMN `indoor_infrastructure_readiness_terms`,
DROP COLUMN `indoor_logistics_support_terms`,
DROP COLUMN `indoor_general_conditions_terms`,
DROP COLUMN `outdoor_approvals_permissions_terms`,
DROP COLUMN `outdoor_data_connectivity_terms`,
DROP COLUMN `outdoor_power_mounting_terms`,
DROP COLUMN `outdoor_logistics_site_access_terms`,
DROP COLUMN `outdoor_general_conditions_terms`;
*/

-- To rollback the order received status change:
/*
ALTER TABLE `quotations`
MODIFY COLUMN `status` enum('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft';
*/

-- =============================================
-- SUMMARY OF CHANGES
-- =============================================
-- Total New Columns: 17 text fields
-- Modified Columns: 1 (status enum)
-- New Status Value: 'order_received'
-- Affected Tables: quotations

-- =============================================
-- NOTES
-- =============================================
-- 1. These changes support different terms for Indoor/Outdoor LED installations
-- 2. The 'order_received' status allows tracking quotations after approval
-- 3. All new columns are nullable to support existing records
-- 4. Terms are dynamically populated based on product_type field
-- 5. Frontend allows editing and saving custom terms per quotation

-- =============================================
-- END OF RECENT CHANGES
-- =============================================
