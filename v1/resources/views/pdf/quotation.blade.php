<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $quotation->title }}</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 30px;
            font-size: 11px;
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
            font-size: 11px;
            line-height: 1.5;
        }
        .company-info h3 {
            font-size: 14px;
            margin: 0 0 8px 0;
            color: #1a1a1a;
        }
        .company-info p {
            margin: 4px 0;
            color: #666;
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
            font-size: 18px;
            margin: 0 0 8px 0;
            color: #1a1a1a;
        }
        .title-section p {
            margin: 4px 0;
            font-size: 11px;
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
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1a1a1a;
        }
        .info-box p {
            margin: 6px 0;
            font-size: 11px;
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
            font-size: 12px;
            margin: 0 0 6px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1a1a1a;
        }
        .specs-grid p {
            margin: 0;
            font-size: 11px;
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
            font-size: 11px;
            font-weight: bold;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
            color: #1a1a1a;
        }
        .products-table td {
            padding: 10px;
            font-size: 11px;
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
            font-size: 11px;
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
        }
        .terms-section {
            margin: 25px 0;
        }
        .terms-section h3 {
            font-size: 14px;
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
            font-size: 12px;
            margin: 0 0 8px 0;
            color: #1a1a1a;
        }
        .terms-grid p {
            margin: 0;
            font-size: 11px;
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
            font-size: 11px;
            font-weight: bold;
            color: #1a1a1a;
        }
        .generated-date {
            text-align: right;
            font-size: 10px;
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
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .attachment-img1 {
            width: auto;
            height: 500px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
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

    <div class="title-section">
        <h2>{{ $quotation->title }}</h2>
        <p style="font-weight: 500">Kind Attn: {{ optional($quotation->account_contact)->name }}</p>
        <p>{{ $quotation->description }}</p>
    </div>

    <div class="separator"></div>

    <table class="info-grid">
        <tr>
            <td>
                <div class="info-box">
                    <h3>Bill To</h3>
                    <p class="business-name">{{ optional($quotation->account)->business_name }}</p>
                    <p>{{ $quotation->billing_address }}</p>
                    <p>{{ $quotation->billing_city }}, {{ $quotation->billing_location }} {{ $quotation->billing_zip_code }}</p>
                    <p style="margin-top: 8px"><span style="font-weight: 500">GST NO:</span> {{ optional($quotation->account)->gst_number }}</p>
                </div>
            </td>
            <td>
                <div class="info-box">
                    <h3>Ship To</h3>
                    <p class="business-name">{{ optional($quotation->account_contact)->name }}</p>
                    <p>{{ $quotation->shipping_address }}</p>
                    <p>{{ $quotation->shipping_city }}, {{ $quotation->shipping_location }} {{ $quotation->shipping_zip_code }}</p>
                    <p style="margin-top: 8px"><span style="font-weight: 500">GST NO:</span> {{ optional($quotation->account)->gst_number }}</p>
                </div>
            </td>
            <td>
                <div class="info-box" style="position: relative;">
                    <h3>Date</h3>
                    <p>{{ \Carbon\Carbon::parse($quotation->estimate_date)->format('d/m/Y') }}</p>
                    <div style="position: absolute; bottom: 15px; right: 15px;">
                        <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="height: 30px; opacity: 0.5;">
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <div class="separator"></div>

    <div class="specs-section">
        <table class="specs-grid">
            <tr>
                <td>
                    <h3>Available Size</h3>
                    <p>{{ $quotation->available_size_width_mm }} mm W x {{ $quotation->available_size_height_mm }} mm H</p>
                </td>
                <td>
                    <h3>Resolution</h3>
                    <p>512 x {{ $quotation->proposed_size_width_mm }} = {{ $quotation->proposed_size_width_mm * 512 }} Pixels</p>
                </td>
            </tr>
        </table>
        <div class="separator" style="margin: 15px 0;"></div>
        <h3>Proposed Size</h3>
        <p>
            {{ $quotation->proposed_size_width_mm }} mm W x {{ $quotation->proposed_size_height_mm }} mm H |
            {{ $quotation->proposed_size_width_ft }} ft W x {{ $quotation->proposed_size_height_ft }} ft H =
            {{ $quotation->proposed_size_sqft }} Sq ft |
            {{ ceil($quotation->proposed_size_height_mm/160) }} R x {{ ceil($quotation->proposed_size_width_mm/320) }} C of 320 W x 160 H mm
        </p>
    </div>

    <table class="products-table">
        <thead>
            <tr>
                <th style="width: 40px; text-align: center">#</th>
                <th>Product Description</th>
                <th>HSN</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Tax %</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quotation->items as $index => $item)
                <tr>
                    <td style="text-align: center">{{ $index + 1 }}</td>
                    <td>
                        <div style="font-weight: 500">{{ $item->product->name }}</div>
                        @if($item->notes)
                            <div style="color: #666; margin-top: 4px">{{ $item->notes }}</div>
                        @endif
                    </td>
                    <td>{{ $item->product->hsn_code }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">₹{{ number_format($item->proposed_unit_price, 2) }}</td>
                    <td class="text-right">{{ $item->tax_percentage }}%</td>
                    <td class="text-right" style="font-weight: 500">₹{{ number_format($item->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span style="float: right; font-weight: 500">₹{{ number_format($quotation->subtotal, 2) }}</span>
        </div>
        <div class="totals-row">
            <span>Tax Total:</span>
            <span style="float: right; font-weight: 500">₹{{ number_format($quotation->tax_amount, 2) }}</span>
        </div>
        <div class="totals-row final">
            <span>Total Amount:</span>
            <span style="float: right">₹{{ number_format($quotation->total_amount, 2) }}</span>
        </div>
    </div>

    <div class="note-box">
        <p><span style="font-weight: 500">Note:</span> {{ $quotation->notes }}</p>
    </div>

    <div class="separator"></div>

    <div class="terms-section">
        <h3>Terms and Conditions</h3>
        <table class="terms-grid">
            <tr>
                <td>
                    <div style="margin-bottom: 15px">
                        <h4>Taxes</h4>
                        <p>{{ $quotation->taxes_terms }}</p>
                    </div>
                    <div style="margin-bottom: 15px">
                        <h4>Warranty</h4>
                        <p>{{ $quotation->warranty_terms }}</p>
                    </div>
                    <div>
                        <h4>Electrical Points and Installation</h4>
                        <p>{{ $quotation->electrical_terms }}</p>
                    </div>
                </td>
                <td>
                    <div style="margin-bottom: 15px">
                        <h4>Delivery Terms</h4>
                        <p>{{ $quotation->delivery_terms }}</p>
                    </div>
                    <div>
                        <h4>Payment Terms</h4>
                        <p>{{ $quotation->payment_terms }}</p>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="separator"></div>

    <div class="footer">
        <div class="footer-top">
            <div>
                <p style="color: #666">For any information or clarifications</p>
                <p style="font-weight: 500">Contact: 8884491377</p>
            </div>
            <img src="{{ public_path('images/logo.png') }}" alt="Logo" class="footer-logo">
        </div>
        <div class="separator"></div>
        <div class="signature-section">
            <div class="signature-block">
                <p>For Radiant Synage Pvt Ltd.,</p>
                <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="height: 30px; opacity: 0.5; margin-top: 8px;">
                <p class="signature-name">{{ auth()->user()->name }}</p>
            </div>
            <div class="generated-date">
                <p>Generated on</p>
                <p style="font-size: 11px">{{ now()->format('d/m/Y') }}</p>
            </div>
        </div>
    </div>

    @if($commonFiles->isNotEmpty() || $quotationFiles->isNotEmpty())
        <div class="attachments">
            <div class="separator"></div>
            @if($commonFiles->isNotEmpty())
                <div style="margin-bottom: 25px">
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="height: 24px; opacity: 0.3; margin-bottom: 15px;">
                    <div class="attachments-grid">
                        @foreach($commonFiles as $file)
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                 alt="{{ $file->name }}"
                                 class="attachment-img">
                        @endforeach
                    </div>
                </div>
            @endif
            @if($quotationFiles->isNotEmpty())
                <div class="separator"></div>
                <div>
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="height: 24px; opacity: 0.3; margin-bottom: 15px;">
                    <div class="attachments-grid">
                        @foreach($quotationFiles as $file)
                            <img src="{{ public_path('storage/' . $file->file_path . '/' . $file->file_name) }}"
                                 alt="{{ $file->name }}"
                                 class="attachment-img1">
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    @endif
</body>
</html>
