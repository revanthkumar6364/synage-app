import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils";
import { PlusIcon, LinkIcon, TrashIcon, ArrowLeftIcon, FileIcon } from 'lucide-react';
import { QuotationMedia } from '@/types';
import { toast, Toaster } from 'sonner';
import AppLayout from '@/layouts/app-layout';

interface Props {
    quotation: {
        id: number;
        title: string;
        reference: string;
        can: {
            update: boolean;
            delete: boolean;
            view: boolean;
            editTerms: boolean;
            editFiles: boolean;
        };
    };
    quotationFiles: QuotationMedia[];
    commonFiles: QuotationMedia[];
}

export default function QuotationFiles({ quotation, quotationFiles = [], commonFiles = [] }: Props) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        try {
            await router.post(route('quotations.files.store', quotation.id), formData, {
                onSuccess: () => {
                    toast.success('File uploaded successfully');
                    e.target.value = ''; // Reset input
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error(errors.file || 'Failed to upload file');
                },
                onFinish: () => setUploading(false),
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload file');
            setUploading(false);
        }
    };

    const handleAttach = (mediaId: number) => {
        router.patch(route('quotation-media.attach', { id: mediaId }), {
            quotation_id: quotation.id,
        }, {
            onSuccess: () => toast.success('File attached successfully'),
            onError: () => toast.error('Failed to attach file'),
        });
    };

    const handleDetach = (mediaId: number) => {
        router.patch(route('quotation-media.detach', { id: mediaId }), {}, {
            onSuccess: () => toast.success('File detached successfully'),
            onError: () => toast.error('Failed to detach file'),
        });
    };

    return (
        <AppLayout>
            <Head title={`Files - ${quotation.reference}`} />
            <Toaster />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('quotations.edit', quotation.id))}
                    >
                        Details
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => router.visit(route('quotations.files', quotation.id))}
                    >
                        Files
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('quotations.products', quotation.id))}
                    >
                        Products
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('quotations.preview', quotation.id))}
                    >
                        Preview
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Files</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Quotation:</span>
                                <Badge variant="outline" className="text-base">
                                    {quotation.reference}
                                </Badge>
                                <span>{quotation.title}</span>
                            </div>

                            {/* Quotation Files */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Quotation Files</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Uploaded By</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Upload Row */}
                                        {quotation.can.editFiles && (
                                            <TableRow>
                                                <TableCell>
                                                    <div className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                        <FileIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                </TableCell>
                                                <TableCell colSpan={4}>
                                                    <Input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        disabled={uploading}
                                                        className="max-w-xs"
                                                    />
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Upload a new file directly to this quotation
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {/* Existing Files */}
                                        {quotationFiles?.map((file) => (
                                            <TableRow key={file.id}>
                                                <TableCell>
                                                    <div className="relative group">
                                                        <img
                                                            src={file.full_url}
                                                            alt={file.name}
                                                            className="w-16 h-16 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                                                        />
                                                        <a
                                                            href={file.full_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded"
                                                        >
                                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium">
                                                                View
                                                            </span>
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{file.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {file.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatBytes(file.file_size)}</TableCell>
                                                <TableCell>{file.creator?.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDetach(file.id)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Common Files */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Common Files</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Preview</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Uploaded By</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {commonFiles?.map((file) => (
                                            <TableRow key={file.id}>
                                                <TableCell>
                                                    <div className="relative group">
                                                        <img
                                                            src={file.full_url}
                                                            alt={file.name}
                                                            className="w-16 h-16 object-cover rounded transition-transform duration-200 group-hover:scale-105"
                                                        />
                                                        <a
                                                            href={file.full_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded"
                                                        >
                                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium">
                                                                View
                                                            </span>
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{file.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {file.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{formatBytes(file.file_size)}</TableCell>
                                                <TableCell>{file.creator?.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAttach(file.id)}
                                                    >
                                                        <LinkIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
