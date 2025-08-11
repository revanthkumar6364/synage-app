import { Head, useForm, router } from '@inertiajs/react';
import { QuotationMedia } from '@/types/index';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotation Media', href: '/quotation-media' },
    { title: 'Edit Media', href: '#' },
];

interface Props {
    media: QuotationMedia;
    categories: Record<string, string>;
}

const Edit: FC<Props> = ({ media, categories }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: media.name,
        category: media.category || 'custom',
        is_active: media.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('quotation-media.update', media.id));
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Media" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold tracking-tight">Edit Media</CardTitle>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(
                                                ([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">Active</Label>
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Preview</h3>
                                {media.full_url && (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <img
                                                src={media.full_url}
                                                alt={media.name}
                                                className="w-full rounded-lg object-contain max-h-[400px]"
                                            />
                                            <a
                                                href={media.full_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors duration-200"
                                            >
                                                View Full Size
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {!media.full_url && (
                                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Image preview not available</p>
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    <p>Original filename: {media.file_name}</p>
                                    <p>MIME type: {media.mime_type}</p>
                                    <p>Size: {formatBytes(media.file_size)}</p>
                                    <p>Uploaded by: {media.creator?.name}</p>
                                    <p>Last updated by: {media.updater?.name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default Edit;
