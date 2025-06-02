import { useState } from 'react';
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
import { PlusIcon, LinkIcon, TrashIcon } from 'lucide-react';
import { QuotationMedia } from '@/types';

interface Props {
    quotationId: number;
    files: QuotationMedia[];
    generalFiles: QuotationMedia[];
    onUpload: (file: File) => void;
    onAttach: (mediaId: number) => void;
    onDetach: (mediaId: number) => void;
    onDelete: (mediaId: number) => void;
}

export default function QuotationFiles({
    quotationId,
    files,
    generalFiles,
    onUpload,
    onAttach,
    onDetach,
    onDelete
}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Quotation Files */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Quotation Files</CardTitle>
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                className="max-w-xs"
                            />
                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Upload File
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map((file) => (
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
                                    <TableCell>
                                        <Badge
                                            variant={file.is_active ? "outline" : "secondary"}
                                        >
                                            {file.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDetach(file.id)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* General Files */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {generalFiles.map((file) => (
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
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAttach(file.id)}
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
