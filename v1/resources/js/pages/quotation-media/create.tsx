import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem } from '@/types';
import { type FC } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quotation Media', href: '/quotation-media' },
    { title: 'Add New Media', href: '#' },
];

interface Props {
    categories: Record<string, string>;
}

const Create: FC<Props> = ({ categories }) => {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        category: 'custom',
        file: null as File | null,
        is_active: true as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quotation-media.store'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('file', e.target.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Media" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight">Add New Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Enter media name"
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

                            <div className="space-y-2">
                                <Label htmlFor="file">Media File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                                <p className="text-xs text-gray-500">Supported formats: Images (JPG, PNG, GIF, SVG) and PDF</p>
                                {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                                {progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_active">Active</Label>
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    aria-label="Toggle active state"
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
                                    disabled={processing || !data.file}
                                >
                                    Upload Media
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Create;
