<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Quotation;

class FixQuotationTerms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quotations:fix-terms {--dry-run : Run without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix Terms & Conditions for existing quotations based on their product_type';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('🔍 DRY RUN MODE - No changes will be saved');
            $this->newLine();
        }

        $quotations = Quotation::whereNotNull('product_type')->get();

        if ($quotations->isEmpty()) {
            $this->warn('No quotations found with product_type set.');
            return Command::SUCCESS;
        }

        $this->info("Found {$quotations->count()} quotations to process");
        $this->newLine();

        $bar = $this->output->createProgressBar($quotations->count());
        $bar->start();

        $fixed = 0;
        $errors = 0;

        foreach ($quotations as $quotation) {
            try {
                // Store old values for comparison
                $oldIndoor = $quotation->indoor_data_connectivity_terms;
                $oldOutdoor = $quotation->outdoor_approvals_permissions_terms;

                // Repopulate terms based on product_type
                $quotation->populateDefaultTerms($quotation->product_type);

                // Check if anything changed
                $changed = ($oldIndoor !== $quotation->indoor_data_connectivity_terms) ||
                          ($oldOutdoor !== $quotation->outdoor_approvals_permissions_terms);

                if ($changed) {
                    if (!$dryRun) {
                        $quotation->save();
                    }
                    $fixed++;
                }

                $bar->advance();
            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Error processing quotation #{$quotation->id}: " . $e->getMessage());
            }
        }

        $bar->finish();
        $this->newLine(2);

        // Summary
        $this->info("📊 Summary:");
        $this->table(
            ['Status', 'Count'],
            [
                ['Total Processed', $quotations->count()],
                ['Fixed/Updated', $fixed],
                ['Errors', $errors],
                ['Unchanged', $quotations->count() - $fixed - $errors],
            ]
        );

        if ($dryRun) {
            $this->newLine();
            $this->warn('⚠️  This was a dry run. Run without --dry-run to apply changes.');
        } else {
            $this->newLine();
            $this->info('✅ Terms & Conditions fixed successfully!');
        }

        return Command::SUCCESS;
    }
}

