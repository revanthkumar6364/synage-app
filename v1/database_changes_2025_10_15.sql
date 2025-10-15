-- ============================================================
-- DATABASE CHANGES - October 15, 2025
-- ============================================================
-- Changes include:
-- 1. Sub-Status system for approved quotations (Hot/Cold/Open)
-- 2. Standard Pricing Approval system
-- 3. HSN Code validation (no DB changes, validation only)
-- ============================================================

-- ============================================================
-- 1. SUB-STATUS FIELDS FOR QUOTATIONS
-- ============================================================
-- Migration: 2025_10_15_002028_add_sub_status_to_quotations_table.php
-- Purpose: Track sub-status after quotation is approved (Hot/Cold/Open)

ALTER TABLE `quotations` 
ADD COLUMN `sub_status` ENUM('open', 'hot', 'cold') NULL AFTER `status`,
ADD COLUMN `sub_status_updated_at` TIMESTAMP NULL AFTER `sub_status`,
ADD COLUMN `sub_status_notes` TEXT NULL AFTER `sub_status_updated_at`;

-- To rollback:
-- ALTER TABLE `quotations` DROP COLUMN `sub_status`, DROP COLUMN `sub_status_updated_at`, DROP COLUMN `sub_status_notes`;


-- ============================================================
-- 2. PRICING APPROVAL FIELDS FOR QUOTATIONS
-- ============================================================
-- Migration: 2025_10_15_004656_add_pricing_approval_fields_to_quotations_table.php
-- Purpose: Track when quotations have items outside standard pricing range

ALTER TABLE `quotations` 
ADD COLUMN `requires_pricing_approval` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`,
ADD COLUMN `pricing_approval_notes` TEXT NULL AFTER `requires_pricing_approval`;

-- To rollback:
-- ALTER TABLE `quotations` DROP COLUMN `requires_pricing_approval`, DROP COLUMN `pricing_approval_notes`;


-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if columns were added successfully
DESCRIBE `quotations`;

-- Check quotations with sub-status
SELECT id, reference, status, sub_status, sub_status_updated_at 
FROM `quotations` 
WHERE sub_status IS NOT NULL 
ORDER BY sub_status_updated_at DESC;

-- Check quotations requiring pricing approval
SELECT id, reference, status, requires_pricing_approval, pricing_approval_notes 
FROM `quotations` 
WHERE requires_pricing_approval = 1 
ORDER BY created_at DESC;

-- Check auto-approved quotations
SELECT id, reference, status, last_action, approved_at, requires_pricing_approval 
FROM `quotations` 
WHERE last_action = 'auto_approved' 
ORDER BY approved_at DESC;

-- Summary of quotations by status
SELECT 
    status,
    COUNT(*) as total,
    SUM(requires_pricing_approval) as needs_pricing_approval,
    COUNT(sub_status) as has_sub_status
FROM `quotations`
GROUP BY status;


-- ============================================================
-- NOTES ON LOGIC (No Database Changes)
-- ============================================================

-- HSN Code Validation:
-- - Changed from minimum 5 digits to exactly 5 digits
-- - Validation: /^\d{5}$/
-- - Frontend maxLength changed from 10 to 5
-- - No database structure changes

-- Auto-Approval Logic:
-- - Quotations with ALL items within standard pricing (min_price to max_price) are auto-approved
-- - Quotations with ANY item outside standard pricing require manual approval
-- - Auto-approval happens when status changes to 'pending'
-- - Field 'last_action' set to 'auto_approved' for auto-approved quotations

-- Sub-Status Logic:
-- - Only applies to approved quotations
-- - Default: 'open' when quotation is approved
-- - Options: 'open' (yellow), 'hot' (red), 'cold' (blue)
-- - If not manually set and >30 days since approval: automatically shows as 'cold'
-- - Calculated in real-time via effective_sub_status attribute

-- Repeat Orders:
-- - Can create new version even from 'order_received' status
-- - New version resets: sub_status, pricing_approval, approval dates
-- - Allows editing pricing for repeat customers
-- - New pricing check applies on submission


-- ============================================================
-- COMPLETE TABLE STRUCTURE (After Changes)
-- ============================================================

/*
CREATE TABLE `quotations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `reference` varchar(255) NOT NULL,
  `quotation_number` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `product_type` varchar(50) DEFAULT NULL,
  -- ... (other existing fields)
  `status` enum('draft','pending','approved','rejected','order_received') NOT NULL,
  
  -- NEW FIELDS (Pricing Approval)
  `requires_pricing_approval` tinyint(1) NOT NULL DEFAULT '0',
  `pricing_approval_notes` text,
  
  -- NEW FIELDS (Sub-Status)
  `sub_status` enum('open','hot','cold') DEFAULT NULL,
  `sub_status_updated_at` timestamp NULL DEFAULT NULL,
  `sub_status_notes` text,
  
  `editable` tinyint(1) NOT NULL DEFAULT '1',
  `last_action` varchar(50) DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `rejected_by` bigint unsigned DEFAULT NULL,
  -- ... (other existing fields)
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

