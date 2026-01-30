<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $quotation->title }}</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
            size: A4;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 30px;
            font-size: 16px;
            /* Main content font size */
            line-height: 1.4;
            color: #333;
        }

        .header {
            width: 100%;
            margin-bottom: 30px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-table td {
            vertical-align: top;
            padding: 0;
        }

        .logo-section {
            width: 40%;
        }

        .logo {
            max-height: 100px;
            width: auto;
        }

        .company-info {
            text-align: right;
            font-size: 20px;
            /* Subheading font size for address section */
            line-height: 1.5;
        }

        .company-info h3 {
            font-size: 28px;
            /* Heading font size for logo section */
            margin: 0 0 8px 0;
            color: #1a237e;
        }

        .company-info p {
            margin: 4px 0;
            color: #666;
            font-size: 16px;
            /* Main content font size */
        }

        .company-info .email {
            color: #1a1a1a;
            text-decoration: none;
        }

        .separator {
            border-top: 1px solid #e5e5e5;
            margin: 25px 0;
        }

        .title-section {
            text-align: center;
            margin-bottom: 25px;
        }

        .title-section h2 {
            font-size: 28px;
            /* Heading font size for main title */
            margin: 0 0 8px 0;
            color: #1a237e;
        }

        .title-section p {
            margin: 4px 0;
            font-size: 20px;
            /* Subheading font size for subtitle/attn */
            color: #666;
        }

        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }

        .info-grid td {
            width: 33.33%;
            padding: 0 10px;
            vertical-align: top;
        }

        .info-grid td:first-child {
            padding-left: 0;
        }

        .info-grid td:last-child {
            padding-right: 0;
        }

        .info-box {
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            min-height: 120px;
            position: relative;
        }

        .info-box h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
            /* Subheading font size */
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1a237e;
        }

        .info-box p {
            margin: 6px 0;
            font-size: 16px;
            /* Main content font size */
            line-height: 1.5;
            color: #666;
        }

        .info-box .business-name {
            color: #1a1a1a;
            font-weight: 500;
        }

        .specs-section {
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            margin: 25px 0;
        }

        .specs-grid {
            width: 100%;
            border-collapse: collapse;
        }

        .specs-grid td {
            width: 50%;
            padding: 0 15px 15px 0;
            vertical-align: top;
        }

        .specs-grid h3 {
            font-size: 20px;
            /* Subheading font size */
            margin: 0 0 6px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1a237e;
        }

        .specs-grid p {
            margin: 0;
            font-size: 16px;
            /* Main content font size */
            color: #666;
        }

        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            border: 1px solid #e5e5e5;
        }

        .products-table th {
            background: #e8eaf6;
            padding: 10px;
            font-size: 20px;
            /* Subheading font size for table headers */
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
            color: #1a237e;
        }

        .products-table td {
            padding: 10px;
            font-size: 16px;
            /* Main content font size for table cells */
            border-bottom: 1px solid #e5e5e5;
            color: #666;
        }

        .products-table .text-right {
            text-align: right;
        }

        .totals-section {
            width: 250px;
            margin-left: auto;
            margin-bottom: 25px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            font-size: 16px;
            /* Main content font size for totals */
            color: #666;
        }

        .totals-row.final {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e5e5e5;
            font-weight: bold;
            color: #1a237e;
        }

        .note-box {
            background: #fff;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            margin: 25px 0;
            font-size: 16px;
            /* Main content font size */
        }

        .terms-section {
            margin: 25px 0;
        }

        .terms-section h3 {
            font-size: 28px;
            /* Heading font size for section title */
            margin: 0 0 15px 0;
            color: #1a1a1a;
        }

        .terms-grid {
            width: 100%;
            border-collapse: collapse;
        }

        .terms-grid td {
            width: 50%;
            padding: 0 15px 15px 0;
            vertical-align: top;
        }

        .terms-grid h4 {
            font-size: 20px;
            /* Subheading font size for terms */
            margin: 0 0 8px 0;
            color: #1a1a1a;
        }

        .terms-grid p {
            margin: 0;
            font-size: 16px;
            /* Main content font size */
            color: #666;
        }

        .footer {
            margin-top: 25px;
        }

        .footer-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .footer-logo {
            height: 30px;
            opacity: 0.5;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .signature-block img {
            height: 30px;
            margin: 8px 0;
            opacity: 0.5;
        }

        .signature-name {
            font-size: 20px;
            /* Subheading font size for signature */
            font-weight: bold;
            color: #1a237e;
        }

        .generated-date {
            text-align: right;
            font-size: 16px;
            /* Main content font size */
            color: #666;
        }

        .attachments {
            margin-top: 30px;
        }

        .attachments-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            margin-top: 15px;
        }

        .attachment-img {
            width: 100%;
            height: auto;
            max-height: 700px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            object-fit: contain;
            page-break-inside: avoid;
        }

        .specification-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .attachment-img1 {
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: 500px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .pdf-link {
            margin-bottom: 8px;
            padding: 8px;
            background-color: #fef3f2;
            border-left: 3px solid #dc2626;
        }
    </style>
</head>

<body>
    @if ($quotation->status === 'approved')
        <div
            style="
            position: fixed;
            top: 35%;
            left: 0;
            width: 100vw;
            text-align: center;
            opacity: 0.08;
            font-size: 120px;
            font-weight: bold;
            color: #1a237e;
            z-index: 0;
            pointer-events: none;
            user-select: none;
            transform: rotate(-20deg);
        ">
            Radiant Synage
        </div>
    @endif

    <div class="header">
        <table class="header-table">
            <tr>
                <td style="width: 60%;">
                    <div style="margin-bottom: 15px;">
                        <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="logo" height="180px"
                            width="auto">
                    </div>
                    <div style="margin-top: 50px;">
                        <p style="font-size: 20px; font-weight: 500; color: #1a237e;">
                            Reference: {{ $quotation->reference }}
                        </p>
                    </div>
                </td>
                <td style="width: 40%;" class="company-info">
                    <h3>Radiant Synage Pvt Ltd</h3>
                    <p>
                        317, Amogha Arcade, 2nd Main Road,<br>
                        East of NGEF Layout, Kasthuri Nagar,<br>
                        Bangalore - 560 043
                    </p>
                    <p class="email">{{ $quotation->salesUser?->email ?? 'mail@radiantsynage.com' }}</p>
                    <p>
                        <span style="font-weight: 500">GSTIN/UIN:</span> 29AAHCR7203C1ZJ<br>
                        <span style="font-weight: 500">CIN:</span> U74999KA2016PTC092481
                    </p>

                </td>
            </tr>
        </table>
    </div>

    <div class="separator"></div>
    <div class="title-section">
        <table style="width: 100%; margin-bottom: 16px;">
            <tr>
                <td style="text-align: right;">
                    <span style="font-size: 20px; color: #666;">Date:
                        {{ $quotation->estimate_date ? \Carbon\Carbon::parse($quotation->estimate_date)->format('d/m/Y') : '' }}</span>
                </td>
            </tr>
        </table>
        <h2 style="font-size: 28px; color: #1a237e; margin: 0 0 8px 0;">{{ $quotation->title }}</h2>
        <p style="font-size: 20px; color: #666;">Kind Attn: {{ optional($quotation->account_contact)->name }}<br>
            {{ optional($quotation->account_contact)->role }}</p>
        <p style="font-size: 15px; color: #333;">{{ $quotation->description }}</p>
    </div>

    <div class="separator"></div>

    @if (
        ($quotation->show_billing_in_print && $quotation->billing_address) ||
            ($quotation->show_shipping_in_print && $quotation->shipping_address))
        <table class="info-grid">
            <tr>
                @if ($quotation->show_billing_in_print && $quotation->billing_address)
                    <td>
                        <div class="info-box">
                            <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">Bill To</h3>
                            <p class="business-name">{{ optional($quotation->account)->business_name }}</p>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->billing_address }}</p>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->billing_city }},
                                {{ $quotation->billing_location }}
                                {{ $quotation->billing_zip_code }}</p>
                            <p style="margin-top: 8px; font-size: 16px; color: #333;"><span style="font-weight: 500">GST
                                    NO:</span>
                                {{ optional($quotation->account)->gst_number }}</p>
                        </div>
                    </td>
                @endif
                @if ($quotation->show_shipping_in_print && $quotation->shipping_address)
                    <td>
                        <div class="info-box">
                            <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">Ship To</h3>
                            <p class="business-name">{{ optional($quotation->account_contact)->name }}</p>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->shipping_address }}</p>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->shipping_city }},
                                {{ $quotation->shipping_location }}
                                {{ $quotation->shipping_zip_code }}</p>
                            <p style="margin-top: 8px; font-size: 16px; color: #333;"><span style="font-weight: 500">GST
                                    NO:</span>
                                {{ optional($quotation->account)->gst_number }}</p>
                        </div>
                    </td>
                @endif
            </tr>
        </table>
    @endif


    @foreach ($quotation->items as $index => $item)
        @php
            $isSelected = $item->product_id == $quotation->selected_product_id;
            // Use per-item available size if present, else fallback to main quotation
            $available_width_mm =
                isset($item->available_size_width_mm) && $item->available_size_width_mm
                    ? (float) $item->available_size_width_mm
                    : (float) $quotation->available_size_width_mm;
            $available_height_mm =
                isset($item->available_size_height_mm) && $item->available_size_height_mm
                    ? (float) $item->available_size_height_mm
                    : (float) $quotation->available_size_height_mm;
            $available_width_ft = $available_width_mm / 304.8;
            $available_height_ft = $available_height_mm / 304.8;
            $available_sqft = $available_width_ft * $available_height_ft;

            // Get product unit size
            $unit_width_mm = isset($item->product->unit_size['width_mm'])
                ? (float) $item->product->unit_size['width_mm']
                : ((float) $item->product->w_mm ?:
                320);
            $unit_height_mm = isset($item->product->unit_size['height_mm'])
                ? (float) $item->product->unit_size['height_mm']
                : ((float) $item->product->h_mm ?:
                160);

            // Use the item's selected quantity
$quantity = (float) $item->quantity;
$boxes_in_width = $unit_width_mm > 0 ? floor($available_width_mm / $unit_width_mm) : 0;
$boxes_in_height = $unit_height_mm > 0 ? floor($available_height_mm / $unit_height_mm) : 0;
$max_possible_boxes = $boxes_in_width * $boxes_in_height;
// Limit quantity to max possible boxes to prevent calculation errors
$effective_quantity = min($quantity, $max_possible_boxes);
// Proposed width/height based on selected quantity (fill rows first)
$proposed_width_mm = $boxes_in_width > 0 ? $unit_width_mm * min($boxes_in_width, $effective_quantity) : 0;
$proposed_height_mm =
    $boxes_in_width > 0 ? $unit_height_mm * ceil($effective_quantity / max($boxes_in_width, 1)) : 0;
// Ensure proposed size doesn't exceed available size
            $proposed_width_mm = min($proposed_width_mm, $available_width_mm);
            $proposed_height_mm = min($proposed_height_mm, $available_height_mm);
            $proposed_width_ft = $proposed_width_mm / 304.8;
            $proposed_height_ft = $proposed_height_mm / 304.8;
            $proposed_sqft = $proposed_width_ft * $proposed_height_ft;
        @endphp
        @if ($quotation->show_product_specs && in_array($item->product->product_type, ['indoor_led', 'outdoor_led']))
            <div class="specs-section">
                <h3 style="margin-bottom: 8px; color: #333;">Product Specifications - {{ $item->product->name }}</h3>
                <table class="specs-grid">
                    <tr>
                        <td>
                            <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">SIZE AVAILABLE AT LOCATION
                            </h3>
                            <p style="font-size: 16px; color: #333;">{{ number_format($available_width_mm, 2) }} mm W x
                                {{ number_format($available_height_mm, 2) }} mm H</p>
                            <div style="margin-top: 8px;">
                                <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">SUGGESTED SIZE</h3>
                                <p style="font-size: 16px; color: #333;">
                                    {{ number_format($proposed_width_mm, 2) }} mm W x
                                    {{ number_format($proposed_height_mm, 2) }} mm H |
                                    {{ number_format($proposed_width_ft, 2) }} ft W x
                                    {{ number_format($proposed_height_ft, 2) }} ft H =
                                    {{ number_format($proposed_sqft, 2) }} Sq ft |
                                    {{ $boxes_in_height }} R x {{ $boxes_in_width }} C of {{ $unit_width_mm }} W x
                                    {{ $unit_height_mm }} H mm
                                </p>
                            </div>
                            @if ($quotation->show_no_of_pixels)
                                <div style="margin-top: 8px;">
                                    <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">NO OF PIXELS</h3>
                                    <p style="font-size: 16px; color: #333;">
                                        @php
                                            $pixel_pitch = (float) ($item->product->pixel_pitch ?? 0);
                                            if ($pixel_pitch > 0) {
                                                $width_pixels = $proposed_width_mm / $pixel_pitch;
                                                $height_pixels = $proposed_height_mm / $pixel_pitch;
                                                $total_pixels = $width_pixels * $height_pixels;
                                            } else {
                                                $total_pixels = 0;
                                            }
                                        @endphp
                                        {{ $pixel_pitch > 0 ? number_format($total_pixels, 0) : 'N/A' }} Pixels</p>
                                </div>
                            @endif
                        </td>
                        <td>
                            <table style="width: 100%;">
                                <tr>
                                    <td style="vertical-align: top; padding-right: 16px;">
                                        <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">BRAND NAME</h3>
                                        <p style="font-size: 16px; color: #333;">{{ $item->product->brand ?? '-' }}</p>
                                        <div style="margin-top: 8px;">
                                            <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">PIXEL PITCH
                                            </h3>
                                            <p style="font-size: 16px; color: #333;">
                                                {{ $item->product->pixel_pitch ? $item->product->pixel_pitch . ' mm' : 'N/A' }}
                                            </p>
                                        </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">REFRESH RATE
                                        </h3>
                                        <p style="font-size: 16px; color: #333;">
                                            {{ $item->product->refresh_rate ? $item->product->refresh_rate . ' Hz' : 'N/A' }}
                                        </p>
                                        <div style="margin-top: 8px;">
                                            <h3 style="font-size: 20px; color: #1a237e; margin: 0 0 10px 0;">CABINET
                                                TYPE</h3>
                                            <p style="font-size: 16px; color: #333;">
                                                {{ $item->product->cabinet_type ?? 'N/A' }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        @endif
    @endforeach

    <table class="products-table">
        <thead>
            <tr>
                <th style="width: 40px; text-align: center">#</th>
                <th style="font-size: 20px; color: #1a237e;">Product Description</th>
                @if ($quotation->show_hsn_code)
                    <th>HSN</th>
                @endif
                <th class="text-right">Unit</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Tax %</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($quotation->items as $index => $item)
                <tr>
                    <td style="text-align: center">{{ $index + 1 }}</td>
                    <td>
                        <div style="font-weight: 500">{{ $item->product->name }}</div>
                        @if ($item->notes)
                            <div style="color: #666; margin-top: 4px">{{ $item->notes }}</div>
                        @endif
                    </td>
                    @if ($quotation->show_hsn_code)
                        <td>{{ $item->product->hsn_code }}</td>
                    @endif
                    <td style="font-size: 16px; color: #666;">
                        {{ $item->quantity }} {{ $item->product->unit ?? 'qty' }}
                    </td>
                    <td class="text-right">₹{{ number_format($item->proposed_unit_price, 2, '.', ',') }}</td>
                    <td class="text-right">{{ $item->tax_percentage }}%</td>
                    <td class="text-right" style="font-weight: 500">₹{{ number_format($item->total, 2, '.', ',') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <span style="font-size: 16px; color: #333;">Subtotal:</span>
            <span style="float: right; font-weight: 500">₹{{ number_format($quotation->subtotal, 2, '.', ',') }}</span>
        </div>
        <div class="totals-row">
            <span style="font-size: 16px; color: #333;">Tax Total:</span>
            <span
                style="float: right; font-weight: 500">₹{{ number_format($quotation->tax_amount, 2, '.', ',') }}</span>
        </div>
        <div class="totals-row final">
            <span style="font-size: 16px; color: #333;">Total Amount:</span>
            <span style="float: right">₹{{ number_format($quotation->total_amount, 2, '.', ',') }}</span>
        </div>
    </div>

    <div class="note-box">
        <p style="font-size: 16px; color: #333;"><span style="font-weight: 500">Note:</span> {{ $quotation->notes }}
        </p>
    </div>

    <div class="separator"></div>

    <div class="terms-section">
        <h3 style="font-size: 28px; color: #1a1a1a; margin: 0 0 15px 0;">Terms and Conditions</h3>

        @if ($quotation->general_pricing_terms)
            <!-- Comprehensive Terms Display -->

            <!-- General Terms -->
            <div style="margin-bottom: 20px;">
                <h4 style="font-size: 22px; color: #1a1a1a; margin: 0 0 15px 0; font-weight: bold;">General Terms &
                    Conditions</h4>
                <table class="terms-grid">
                    <tr>
                        <td>
                            @if ($quotation->general_pricing_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Pricing</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_pricing_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_warranty_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Warranty</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_warranty_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_delivery_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Delivery Timeline</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_delivery_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_payment_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Payment Terms</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_payment_terms }}</p>
                                </div>
                            @endif
                        </td>
                        <td>
                            @if ($quotation->general_site_readiness_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Site Readiness & Delays</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_site_readiness_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_installation_scope_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Installation Scope</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_installation_scope_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_ownership_risk_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Ownership & Risk</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_ownership_risk_terms }}</p>
                                </div>
                            @endif
                            @if ($quotation->general_force_majeure_terms)
                                <div style="margin-bottom: 15px">
                                    <h5 style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                        Force Majeure</h5>
                                    <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                        {{ $quotation->general_force_majeure_terms }}</p>
                                </div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>

            @if ($quotation->product_type === 'indoor')
                <!-- Indoor LED Installation Terms -->
                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 22px; color: #1a1a1a; margin: 0 0 15px 0; font-weight: bold;">Indoor LED
                        Installation</h4>
                    <table class="terms-grid">
                        <tr>
                            <td>
                                @if ($quotation->indoor_data_connectivity_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Data & Connectivity</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->indoor_data_connectivity_terms }}</p>
                                    </div>
                                @endif
                                @if ($quotation->indoor_infrastructure_readiness_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Infrastructure Readiness</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->indoor_infrastructure_readiness_terms }}</p>
                                    </div>
                                @endif
                            </td>
                            <td>
                                @if ($quotation->indoor_logistics_support_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Logistics & Support</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->indoor_logistics_support_terms }}</p>
                                    </div>
                                @endif
                                @if ($quotation->indoor_general_conditions_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            General Conditions</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->indoor_general_conditions_terms }}</p>
                                    </div>
                                @endif
                            </td>
                        </tr>
                    </table>
                </div>
            @endif

            @if ($quotation->product_type === 'outdoor')
                <!-- Outdoor LED Installation Terms -->
                <div style="margin-bottom: 20px;">
                    <h4 style="font-size: 22px; color: #1a1a1a; margin: 0 0 15px 0; font-weight: bold;">Outdoor LED
                        Installation</h4>
                    <table class="terms-grid">
                        <tr>
                            <td>
                                @if ($quotation->outdoor_approvals_permissions_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Approvals & Permissions</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->outdoor_approvals_permissions_terms }}</p>
                                    </div>
                                @endif
                                @if ($quotation->outdoor_data_connectivity_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Data & Connectivity</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->outdoor_data_connectivity_terms }}</p>
                                    </div>
                                @endif
                                @if ($quotation->outdoor_power_mounting_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Power & Mounting Infrastructure</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->outdoor_power_mounting_terms }}</p>
                                    </div>
                                @endif
                            </td>
                            <td>
                                @if ($quotation->outdoor_logistics_site_access_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            Logistics & Site Access</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->outdoor_logistics_site_access_terms }}</p>
                                    </div>
                                @endif
                                @if ($quotation->outdoor_general_conditions_terms)
                                    <div style="margin-bottom: 15px">
                                        <h5
                                            style="font-size: 18px; color: #1a1a1a; margin: 0 0 8px 0; font-weight: 600;">
                                            General Conditions</h5>
                                        <p style="font-size: 14px; color: #333; line-height: 1.4;">
                                            {{ $quotation->outdoor_general_conditions_terms }}</p>
                                    </div>
                                @endif
                            </td>
                        </tr>
                    </table>
                </div>
            @endif
        @else
            <!-- Legacy Terms Display -->
            <table class="terms-grid">
                <tr>
                    <td>
                        <div style="margin-bottom: 15px">
                            <h4 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Taxes</h4>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->taxes_terms }}</p>
                        </div>
                        <div style="margin-bottom: 15px">
                            <h4 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Warranty</h4>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->warranty_terms }}</p>
                        </div>
                        <div>
                            <h4 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Electrical Points and
                                Installation</h4>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->electrical_terms }}</p>
                        </div>
                    </td>
                    <td>
                        <div style="margin-bottom: 15px">
                            <h4 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Delivery Terms</h4>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->delivery_terms }}</p>
                        </div>
                        <div>
                            <h4 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Payment Terms</h4>
                            <p style="font-size: 16px; color: #333;">{{ $quotation->payment_terms }}</p>
                        </div>
                    </td>
                </tr>
            </table>
        @endif
    </div>

    <div class="separator"></div>

    <div style="margin: 25px 0; background: #e8eaf6; padding: 20px; border-radius: 8px; page-break-inside: avoid;">
        <h3
            style="font-size: 20px; color: #1a237e; margin: 0 0 15px 0; border-bottom: 2px solid #c5cae9; padding-bottom: 8px;">
            Bank Account Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 5px 0; color: #1a237e; font-weight: bold;">Bank Name:</p>
                    <p style="margin: 5px 0 20px 0; color: #333;">ICICI</p>

                    <p style="margin: 5px 0; color: #1a237e; font-weight: bold;">Account Name:</p>
                    <p style="margin: 5px 0 20px 0; color: #333;">RADIANT SYNAGE PRIVATE LIMITED</p>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 5px 0; color: #1a237e; font-weight: bold;">Account Number:</p>
                    <p style="margin: 5px 0 20px 0; color: #333;">218151000001</p>

                    <p style="margin: 5px 0; color: #1a237e; font-weight: bold;">IFSC Code / Branch:</p>
                    <p style="margin: 5px 0 20px 0; color: #333;">ICIC0002181 / Hope Farm, Whitefield, Bengaluru</p>
                </td>
            </tr>
        </table>
    </div>

    <div class="separator"></div>

    <div class="footer">
        <div class="footer-top">
            <div>
                For any information or clarifications
            </div>
        </div>
        <div class="separator"></div>
        @php
            $salesContact = $quotation->salesUser;
            $contactName = $salesContact->name ?? ($user->name ?? '');
            $contactEmail = $salesContact->email ?? 'mail@radiantsynage.com';
            $contactCountryCode = $salesContact->country_code ?? ($user->country_code ?? '');
            $rawMobile = $salesContact->mobile ?? ($user->mobile ?? '');
            $contactMobile = trim(trim(($contactCountryCode ? $contactCountryCode . ' ' : '') . $rawMobile));
            $whatsappNumber = $rawMobile ? preg_replace('/\D/', '', $rawMobile) : '';
            $whatsappLink = $whatsappNumber ? 'https://wa.me/' . $whatsappNumber : null;
        @endphp
        <div class="signature-section">
            <div class="signature-block">
                For Radiant Synage Pvt Ltd.,<br>
                <div class="signature-name">{{ $contactName }}</div>
                <div class="signature-name">
                    EMAIL: {{ $contactEmail }}<br>
                    MOBILE: {{ $contactMobile }}
                </div>
                <div style="margin-top: 8px; font-size: 11px;">
                    <a href="{{ $whatsappLink ?? '#' }}"
                        style="margin-right: 8px; text-decoration: none; color: #25D366;">WhatsApp</a>
                    <a href="https://facebook.com/radiantsynage"
                        style="margin-right: 8px; text-decoration: none; color: #1877F3;">Facebook</a>
                    <a href="https://instagram.com/radiantsynage"
                        style="margin-right: 8px; text-decoration: none; color: #E4405F;">Instagram</a>
                    <a href="https://youtube.com/@radiantsynage"
                        style="margin-right: 8px; text-decoration: none; color: #FF0000;">YouTube</a>
                    <a href="https://linkedin.com/company/radiantsynage"
                        style="margin-right: 8px; text-decoration: none; color: #0A66C2;">LinkedIn</a>
                    <a href="https://radiantsynage.com" style="text-decoration: none; color: #1a1a1a;">Website</a>
                </div>
            </div>
            <div class="generated-date">
                Generated on<br>
                {{ \Carbon\Carbon::now()->format('d/m/Y') }}
            </div>
        </div>
    </div>

    <!-- Zapple QR Code for Customer Support -->
    <div class="separator"></div>
    <div style="text-align: center; margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="font-size: 18px; color: #1a1a1a; margin: 0 0 15px 0; font-weight: bold;">Customer Support</h3>
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
            <img src="{{ public_path('images/zapple.png') }}" alt="Zapple QR Code"
                style="width: 120px; height: auto;">
            <div style="text-align: left;">
                <p style="font-size: 14px; color: #333; margin: 0 0 8px 0; font-weight: 600;">Scan QR Code for Support
                </p>
                <p style="font-size: 12px; color: #666; margin: 0;">Get instant help with your quotation</p>
            </div>
        </div>
    </div>

    @if ($commonFiles->isNotEmpty() || $quotationFiles->isNotEmpty())
        <div class="attachments">
            <div class="separator"></div>
            @if ($commonFiles->isNotEmpty())
                @php
                    $commonImages = $commonFiles->filter(
                        fn($f) => $f->category !== 'pdf' && !str_ends_with(strtolower($f->name ?? ''), '.pdf'),
                    );
                    $commonPdfs = $commonFiles->filter(
                        fn($f) => $f->category === 'pdf' || str_ends_with(strtolower($f->name ?? ''), '.pdf'),
                    );
                @endphp

                @if ($commonPdfs->isNotEmpty())
                    <div style="margin-bottom: 15px;">
                        <h4 style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">Reference
                            Documents:</h4>
                        @foreach ($commonPdfs as $file)
                            <div class="pdf-link">
                                <div style="font-size: 11px; font-weight: bold; color: #333; margin-bottom: 3px;">
                                    📄 {{ $file->name }}
                                </div>
                                <div
                                    style="font-size: 8px; color: #0066cc; word-break: break-all; font-family: monospace;">
                                    {{ $file->full_url ?? url('storage/' . $file->file_path . '/' . $file->file_name) }}
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif

                @if ($commonImages->isNotEmpty())
                    @foreach ($commonImages as $file)
                        <div class="specification-section">
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                alt="{{ $file->name }}" class="attachment-img"
                                style="display: block; margin: 0 auto;">
                        </div>
                    @endforeach
                @endif
            @endif
            @if ($quotationFiles->isNotEmpty())
                @php
                    $images = $quotationFiles->filter(
                        fn($f) => $f->category !== 'pdf' && !str_ends_with(strtolower($f->name ?? ''), '.pdf'),
                    );
                    $pdfs = $quotationFiles->filter(
                        fn($f) => $f->category === 'pdf' || str_ends_with(strtolower($f->name ?? ''), '.pdf'),
                    );
                @endphp

                <div class="separator"></div>

                @if ($pdfs->isNotEmpty())
                    <div style="margin-bottom: 15px;">
                        <h4 style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">Additional
                            Documents:</h4>
                        @foreach ($pdfs as $file)
                            <div class="pdf-link">
                                <div style="font-size: 11px; font-weight: bold; color: #333; margin-bottom: 3px;">
                                    📄 {{ $file->name }}
                                </div>
                                <div
                                    style="font-size: 8px; color: #0066cc; word-break: break-all; font-family: monospace;">
                                    {{ $file->full_url ?? url('storage/' . $file->file_path . '/' . $file->file_name) }}
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif

                @if ($images->isNotEmpty())
                    @foreach ($images as $file)
                        <div class="specification-section">
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                alt="{{ $file->name }}" class="attachment-img"
                                style="display: block; margin: 0 auto;">
                        </div>
                    @endforeach
                @endif
            @endif
        </div>
    @endif
</body>

</html>
