import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router } from '@inertiajs/react';
import { Flame, Snowflake, Clock } from 'lucide-react';

interface SubStatusDialogProps {
    quotationId: number;
    currentSubStatus?: 'open' | 'hot' | 'cold';
    currentNotes?: string;
    trigger?: React.ReactNode;
}

export default function SubStatusDialog({
    quotationId,
    currentSubStatus = 'open',
    currentNotes = '',
    trigger,
}: SubStatusDialogProps) {
    const [open, setOpen] = useState(false);
    const [subStatus, setSubStatus] = useState<'open' | 'hot' | 'cold'>(currentSubStatus);
    const [notes, setNotes] = useState(currentNotes);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            route('quotations.update-sub-status', quotationId),
            {
                sub_status: subStatus,
                sub_status_notes: notes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Update Status</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Sub-Status</DialogTitle>
                        <DialogDescription>
                            Change the sub-status of this approved quotation and add optional notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Sub-Status</Label>
                            <RadioGroup
                                value={subStatus}
                                onValueChange={(value: string) => setSubStatus(value as 'open' | 'hot' | 'cold')}
                                className="flex flex-col space-y-2"
                            >
                                <div className="flex items-center space-x-2 rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                                    <RadioGroupItem value="open" id="open" />
                                    <Label
                                        htmlFor="open"
                                        className="flex flex-1 cursor-pointer items-center space-x-2"
                                    >
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <div>
                                            <div className="font-semibold text-yellow-900">Open</div>
                                            <div className="text-xs text-yellow-700">
                                                Active opportunity, recent approval
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-lg border border-red-300 bg-red-50 p-3">
                                    <RadioGroupItem value="hot" id="hot" />
                                    <Label
                                        htmlFor="hot"
                                        className="flex flex-1 cursor-pointer items-center space-x-2"
                                    >
                                        <Flame className="h-4 w-4 text-red-600" />
                                        <div>
                                            <div className="font-semibold text-red-900">Hot</div>
                                            <div className="text-xs text-red-700">
                                                High priority, active engagement
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-lg border border-blue-300 bg-blue-50 p-3">
                                    <RadioGroupItem value="cold" id="cold" />
                                    <Label
                                        htmlFor="cold"
                                        className="flex flex-1 cursor-pointer items-center space-x-2"
                                    >
                                        <Snowflake className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <div className="font-semibold text-blue-900">Cold</div>
                                            <div className="text-xs text-blue-700">
                                                Low activity, needs follow-up
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this status change..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Sub-Status'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

