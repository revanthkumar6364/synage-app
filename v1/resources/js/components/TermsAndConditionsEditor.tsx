import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Quotation } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Save, RotateCcw } from 'lucide-react';

interface TermsAndConditionsEditorProps {
    quotation: Quotation;
    onSave?: () => void;
}

interface TermsSection {
    title: string;
    fields: {
        key: string;
        label: string;
        value: string;
    }[];
}

export default function TermsAndConditionsEditor({ quotation, onSave }: TermsAndConditionsEditorProps) {
    const [productType, setProductType] = useState<'indoor' | 'outdoor' | 'standard_led'>(quotation.product_type || 'standard_led');
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        // Legacy terms
        taxes: quotation.taxes_terms || '',
        warranty: quotation.warranty_terms || '',
        delivery_terms: quotation.delivery_terms || '',
        payment_terms: quotation.payment_terms || '',
        electrical_terms: quotation.electrical_terms || '',

        // Product type
        product_type: quotation.product_type || 'standard_led',

        // General terms
        general_pricing_terms: quotation.general_pricing_terms || '',
        general_warranty_terms: quotation.general_warranty_terms || '',
        general_delivery_terms: quotation.general_delivery_terms || '',
        general_payment_terms: quotation.general_payment_terms || '',
        general_site_readiness_terms: quotation.general_site_readiness_terms || '',
        general_installation_scope_terms: quotation.general_installation_scope_terms || '',
        general_ownership_risk_terms: quotation.general_ownership_risk_terms || '',
        general_force_majeure_terms: quotation.general_force_majeure_terms || '',

        // Indoor terms
        indoor_data_connectivity_terms: quotation.indoor_data_connectivity_terms || '',
        indoor_infrastructure_readiness_terms: quotation.indoor_infrastructure_readiness_terms || '',
        indoor_logistics_support_terms: quotation.indoor_logistics_support_terms || '',
        indoor_general_conditions_terms: quotation.indoor_general_conditions_terms || '',

        // Outdoor terms
        outdoor_approvals_permissions_terms: quotation.outdoor_approvals_permissions_terms || '',
        outdoor_data_connectivity_terms: quotation.outdoor_data_connectivity_terms || '',
        outdoor_power_mounting_terms: quotation.outdoor_power_mounting_terms || '',
        outdoor_logistics_site_access_terms: quotation.outdoor_logistics_site_access_terms || '',
        outdoor_general_conditions_terms: quotation.outdoor_general_conditions_terms || '',
    });

    useEffect(() => {
        setProductType(form.data.product_type);
    }, [form.data.product_type]);

    const handleProductTypeChange = (value: 'indoor' | 'outdoor' | 'standard_led') => {
        setProductType(value);
        form.setData('product_type', value);

        // Make API call to update product type and get default terms
        form.post(route('quotations.update-product-type', quotation.id), {
            onSuccess: (response: any) => {
                if (response.props?.terms) {
                    const terms = response.props.terms;
                    // Update form with new terms
                    if (terms.general) {
                        Object.keys(terms.general).forEach(key => {
                            const formKey = `general_${key}_terms` as keyof typeof form.data;
                            form.setData(formKey, terms.general[key]);
                        });
                    }

                    if (terms.indoor) {
                        Object.keys(terms.indoor).forEach(key => {
                            const formKey = `indoor_${key}_terms` as keyof typeof form.data;
                            form.setData(formKey, terms.indoor[key]);
                        });
                    }

                    if (terms.outdoor) {
                        Object.keys(terms.outdoor).forEach(key => {
                            const formKey = `outdoor_${key}_terms` as keyof typeof form.data;
                            form.setData(formKey, terms.outdoor[key]);
                        });
                    }
                }
                toast.success('Product type updated successfully');
            },
            onError: (errors) => {
                toast.error('Failed to update product type');
            }
        });
    };

    const handleSave = () => {
        form.post(route('quotations.save-terms', quotation.id), {
            onSuccess: () => {
                toast.success('Terms and conditions saved successfully');
                setIsEditing(false);
                onSave?.();
            },
            onError: (errors) => {
                toast.error('Failed to save terms and conditions');
            }
        });
    };

    const handleReset = () => {
        // Reset form to original values
        form.reset();
        setIsEditing(false);
    };

    const getTermsSections = (): TermsSection[] => {
        const sections: TermsSection[] = [
            {
                title: 'General Terms & Conditions',
                fields: [
                    { key: 'general_pricing_terms', label: 'Pricing', value: form.data.general_pricing_terms },
                    { key: 'general_warranty_terms', label: 'Warranty', value: form.data.general_warranty_terms },
                    { key: 'general_delivery_terms', label: 'Delivery Timeline', value: form.data.general_delivery_terms },
                    { key: 'general_payment_terms', label: 'Payment Terms', value: form.data.general_payment_terms },
                    { key: 'general_site_readiness_terms', label: 'Site Readiness & Delays', value: form.data.general_site_readiness_terms },
                    { key: 'general_installation_scope_terms', label: 'Installation Scope', value: form.data.general_installation_scope_terms },
                    { key: 'general_ownership_risk_terms', label: 'Ownership & Risk', value: form.data.general_ownership_risk_terms },
                    { key: 'general_force_majeure_terms', label: 'Force Majeure', value: form.data.general_force_majeure_terms },
                ]
            }
        ];

        if (productType === 'indoor') {
            sections.push({
                title: 'Indoor LED Installation',
                fields: [
                    { key: 'indoor_data_connectivity_terms', label: 'Data & Connectivity', value: form.data.indoor_data_connectivity_terms },
                    { key: 'indoor_infrastructure_readiness_terms', label: 'Infrastructure Readiness', value: form.data.indoor_infrastructure_readiness_terms },
                    { key: 'indoor_logistics_support_terms', label: 'Logistics & Support', value: form.data.indoor_logistics_support_terms },
                    { key: 'indoor_general_conditions_terms', label: 'General Conditions', value: form.data.indoor_general_conditions_terms },
                ]
            });
        } else if (productType === 'outdoor') {
            sections.push({
                title: 'Outdoor LED Installation',
                fields: [
                    { key: 'outdoor_approvals_permissions_terms', label: 'Approvals & Permissions', value: form.data.outdoor_approvals_permissions_terms },
                    { key: 'outdoor_data_connectivity_terms', label: 'Data & Connectivity', value: form.data.outdoor_data_connectivity_terms },
                    { key: 'outdoor_power_mounting_terms', label: 'Power & Mounting Infrastructure', value: form.data.outdoor_power_mounting_terms },
                    { key: 'outdoor_logistics_site_access_terms', label: 'Logistics & Site Access', value: form.data.outdoor_logistics_site_access_terms },
                    { key: 'outdoor_general_conditions_terms', label: 'General Conditions', value: form.data.outdoor_general_conditions_terms },
                ]
            });
        }

        return sections;
    };

    const getProductTypeLabel = (type: 'indoor' | 'outdoor' | 'standard_led') => {
        const labels = {
            indoor: 'Indoor LED',
            outdoor: 'Outdoor LED',
            standard_led: 'Display And Other'
        };
        return labels[type] || type;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Terms & Conditions</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Label htmlFor="product-type">Product Type:</Label>
                            <Badge variant="outline">
                                {getProductTypeLabel(productType)}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} size="sm">
                                Edit Terms
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    size="sm"
                                    disabled={form.processing}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    disabled={form.processing}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Terms
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Product Type Selector */}
                <div className="space-y-2">
                    <Label htmlFor="product-type">Product Type</Label>
                    <Select value={productType} onValueChange={(value: 'indoor' | 'outdoor' | 'standard_led') => handleProductTypeChange(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="indoor">Indoor LED</SelectItem>
                            <SelectItem value="outdoor">Outdoor LED</SelectItem>
                            <SelectItem value="standard_led">Display And Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Terms Sections */}
                {getTermsSections().map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                        <h4 className="text-lg font-semibold text-primary">{section.title}</h4>
                        <div className="grid gap-4">
                            {section.fields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>{field.label}</Label>
                                    {isEditing ? (
                                        <Textarea
                                            id={field.key}
                                            value={field.value}
                                            onChange={(e) => form.setData(field.key as any, e.target.value)}
                                            placeholder={`Enter ${field.label.toLowerCase()} terms...`}
                                            rows={3}
                                            className="min-h-[80px]"
                                        />
                                    ) : (
                                        <div className="text-sm text-muted-foreground whitespace-pre-line p-3 bg-muted rounded-md min-h-[80px]">
                                            {field.value || 'No terms specified'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {sectionIndex < getTermsSections().length - 1 && <Separator />}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
