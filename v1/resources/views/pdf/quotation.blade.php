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
            max-height: 50px;
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
            color: #1a1a1a;
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
            color: #1a1a1a;
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
            color: #1a1a1a;
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
            color: #1a1a1a;
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
            background: #f8f9fa;
            padding: 10px;
            font-size: 20px;
            /* Subheading font size for table headers */
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
            color: #1a1a1a;
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
            color: #1a1a1a;
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
            color: #1a1a1a;
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
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 15px;
        }

        .attachment-img {
            width: 200px;
            height: 200px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .attachment-img1 {
            width: auto;
            height: 500px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
                <td class="logo-section">
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="logo">
                </td>
                <td class="company-info">
                    <h3>Radiant Synage Pvt Ltd</h3>
                    <p>
                        317, 2nd Floor, East of NGEF Layout<br>
                        Kasthuri Nagar, Bangalore - 560 043
                    </p>
                    <p class="email">murali.krishna@radiantsynage.com</p>
                    <p>
                        <span style="font-weight: 500">GSTIN/UIN:</span> 29AAHCR7203C1ZJ<br>
                        <span style="font-weight: 500">CIN:</span> U74999KA2016PTC092481
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div class="separator"></div>
    <table style="width: 100%; margin: 24px 0 16px 0;">
        <tr>
            <td style="font-size: 20px; font-weight: 500; color: #1a237e; text-align: left;">
                Reference: {{ $quotation->reference }}
            </td>
            <td style="font-size: 20px; color: #666; text-align: right;">
                Date: {{ \Carbon\Carbon::parse($quotation->estimate_date)->format('d/m/Y') }}
            </td>
        </tr>
    </table>
    <div class="separator"></div>
    <div class="title-section">
        <h2 style="font-size: 28px; color: #1a1a1a; margin: 0 0 8px 0;">{{ $quotation->title }}</h2>
        <p style="font-size: 20px; color: #666;">Kind Attn: {{ optional($quotation->account_contact)->name }}<br>
            {{ optional($quotation->account_contact)->role }}</p>
        <p style="font-size: 15px; color: #333;">{{ $quotation->description }}</p>
    </div>

    <div class="separator"></div>

    <table class="info-grid">
        <tr>
            <td>
                <div class="info-box">
                    <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Bill To</h3>
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
            <td>
                <div class="info-box">
                    <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Ship To</h3>
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
        </tr>
    </table>

    <div class="separator"></div>
    <div class="specs-section">
        <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">Installation Type</h3>
        <p style="font-size: 16px; color: #333;">{{ $quotation->facade_type ?? '-' }} :
            {{ $quotation->facade_notes ?? '-' }}</p>
    </div>
    <div class="separator"></div>
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
            $quantity = $item->quantity;
            $boxes_in_width = $unit_width_mm > 0 ? floor($available_width_mm / $unit_width_mm) : 0;
            $boxes_in_height = $unit_height_mm > 0 ? floor($available_height_mm / $unit_height_mm) : 0;
            $max_possible_boxes = $boxes_in_width * $boxes_in_height;
            // Proposed width/height based on selected quantity (fill rows first)
            $proposed_width_mm = $boxes_in_width > 0 ? $unit_width_mm * min($boxes_in_width, $quantity) : 0;
            $proposed_height_mm = $boxes_in_width > 0 ? $unit_height_mm * ceil($quantity / max($boxes_in_width, 1)) : 0;
            $proposed_width_ft = $proposed_width_mm / 304.8;
            $proposed_height_ft = $proposed_height_mm / 304.8;
            $proposed_sqft = $proposed_width_ft * $proposed_height_ft;
        @endphp
        @if (in_array($item->product->product_type, ['indoor_led', 'outdoor_led']))
            <div class="specs-section">
                <h3 style="margin-bottom: 8px; color: #333;">Product Specifications - {{ $item->product->name }}</h3>
                <table class="specs-grid">
                    <tr>
                        <td>
                            <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">SIZE AVAILABLE AT LOCATION
                            </h3>
                            <p style="font-size: 16px; color: #333;">{{ number_format($available_width_mm, 2) }} mm W x
                                {{ number_format($available_height_mm, 2) }} mm H</p>
                            <div style="margin-top: 8px;">
                                <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">SUGGESTED SIZE</h3>
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
                            <div style="margin-top: 8px;">
                                <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">NO OF PIXELS</h3>
                                <p style="font-size: 16px; color: #333;">
                                    {{ number_format($proposed_width_mm * 512, 0) }} Pixels</p>
                            </div>
                        </td>
                        <td>
                            <table style="width: 100%;">
                                <tr>
                                    <td style="vertical-align: top; padding-right: 16px;">
                                        <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">BRAND NAME</h3>
                                        <p style="font-size: 16px; color: #333;">{{ $item->product->brand ?? '-' }}</p>
                                        <div style="margin-top: 8px;">
                                            <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">PIXEL PITCH
                                            </h3>
                                            <p style="font-size: 16px; color: #333;">
                                                {{ $item->product->pixel_pitch ? $item->product->pixel_pitch . ' mm' : 'N/A' }}
                                            </p>
                                        </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">REFRESH RATE
                                        </h3>
                                        <p style="font-size: 16px; color: #333;">
                                            {{ $item->product->refresh_rate ? $item->product->refresh_rate . ' Hz' : 'N/A' }}
                                        </p>
                                        <div style="margin-top: 8px;">
                                            <h3 style="font-size: 20px; color: #1a1a1a; margin: 0 0 10px 0;">CABINET
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
                <th style="font-size: 20px; color: #1a1a1a;">Product Description</th>
                @if ($quotation->show_hsn_code)
                    <th>HSN</th>
                @endif
                <th class="text-right">Qty</th>
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
                    <td style="font-size: 16px; color: #666;">{{ $item->quantity }}</td>
                    <td class="text-right">₹{{ number_format($item->proposed_unit_price, 2) }}</td>
                    <td class="text-right">{{ $item->tax_percentage }}%</td>
                    <td class="text-right" style="font-weight: 500">₹{{ number_format($item->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <span style="font-size: 16px; color: #333;">Subtotal:</span>
            <span style="float: right; font-weight: 500">₹{{ number_format($quotation->subtotal, 2) }}</span>
        </div>
        <div class="totals-row">
            <span style="font-size: 16px; color: #333;">Tax Total:</span>
            <span style="float: right; font-weight: 500">₹{{ number_format($quotation->tax_amount, 2) }}</span>
        </div>
        <div class="totals-row final">
            <span style="font-size: 16px; color: #333;">Total Amount:</span>
            <span style="float: right">₹{{ number_format($quotation->total_amount, 2) }}</span>
        </div>
    </div>

    <div class="note-box">
        <p style="font-size: 16px; color: #333;"><span style="font-weight: 500">Note:</span> {{ $quotation->notes }}
        </p>
    </div>

    <div class="separator"></div>

    <div class="terms-section">
        <h3 style="font-size: 28px; color: #1a1a1a; margin: 0 0 15px 0;">Terms and Conditions</h3>
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
    </div>

    <div class="separator"></div>

    <div class="footer">
        <div class="footer-top">
            <div>
                For any information or clarifications<br>
                <b>Contact: 8884491377</b>
            </div>

            <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="footer-logo">
        </div>
        <div class="separator"></div>
        <div class="signature-section">
            <div class="signature-block">
                For Radiant Synage Pvt Ltd.,<br>
                <img src="{{ public_path('images/signature.png') }}" alt="Signature"
                    style="height: 40px; margin: 8px 0;">
                <div class="signature-name">{{ auth()->user()->name ?? '' }}</div>
                <div class="signature-name">{{ auth()->user()->email ?? '' }}, {{ auth()->user()->mobile ?? '' }}
                </div>
                <div style="margin-top: 8px; font-size: 11px;">
                    <a href="https://wa.me/918884491377"
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

    @if ($commonFiles->isNotEmpty() || $quotationFiles->isNotEmpty())
        <div class="attachments">
            <div class="separator"></div>
            @if ($commonFiles->isNotEmpty())
                <div style="margin-bottom: 25px">
                    <div class="attachments-grid">
                        @foreach ($commonFiles as $file)
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                alt="{{ $file->name }}" class="attachment-img">
                        @endforeach
                    </div>
                </div>
            @endif
            @if ($quotationFiles->isNotEmpty())
                <div class="separator"></div>
                <div>
                    <h3>Attachments</h3>
                    <div class="attachments-grid">
                        @foreach ($quotationFiles as $file)
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                alt="{{ $file->name }}" class="attachment-img1">
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    @endif
</body>

</html>
