<?php
// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $indoor      = Category::where('slug', 'indoor_led')->firstOrFail();
        $outdoor     = Category::where('slug', 'outdoor_led')->firstOrFail();
        $kiosk       = Category::where('slug', 'kiosk')->firstOrFail();
        $controllers = Category::where('slug', 'controllers')->firstOrFail();
        $tvScreens   = Category::where('slug', 'tv_screens')->firstOrFail();

        $productsByCategory = [
            'indoor_led' => [
                // Indoor LED
                ['name'=>'Unilumin Kslim 1.9','sku'=>'K Slim 1.9','size'=>'500 mm X 1000 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast','gst_percentage'=>28],
                ['name'=>'Unilumin KSlim 2.5','sku'=>'KSlim 2.5','size'=>'500 mm X 1000 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast','gst_percentage'=>28],
                ['name'=>'Unilumin FCQ 1.2','sku'=>'FCQ1.2','size'=>'640 mm X 360 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin FCQ 1.5','sku'=>'FCQ1.5','size'=>'640 mm X 360 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin FCQ 2.5','sku'=>'FCQ2.5','size'=>'640 mm X 360 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin ULWIII 1.8','sku'=>'ULWIII 1.8','size'=>'600 mm X 337.5 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin ULWIII 1.5','sku'=>'ULWIII 1.5','size'=>'600 mm X 337.5 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UDA 1.8','sku'=>'UDA 1.8','size'=>'640 mm X 480 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UDA 2.5','sku'=>'UDA 2.5','size'=>'640 mm X 480 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UTV SC 135(1.5)','sku'=>'UTV SC 135','size'=>'3011 mm x 1813 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UTV SC 108(1.2)','sku'=>'UTV SC 108','size'=>'2411 mm x 1476 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UTV SC 165(1.8)','sku'=>'UTV SC 165','size'=>'3611 mmx 2151 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin Umini 1.2','sku'=>'UMINI 1.2','size'=>'600 mm X 337.5 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin Umini 0.9','sku'=>'UMINI 0.9','size'=>'600 mm X 337.5 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin Umini 1.5','sku'=>'UMINI 1.5','size'=>'600 mm X 337.5 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Unilumin UHF 1.8','sku'=>'UHF 1.8','size'=>'250 mm X 250 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Absen CP 1.8','sku'=>'CP1.8','size'=>'320 mm X 480 mm','hsn_code'=>'85285900','brand'=>'Absen','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],
                ['name'=>'Absen CP 2.5','sku'=>'CP2.5','size'=>'320 mm X 480 mm','hsn_code'=>'85285900','brand'=>'Absen','type'=>'Active LED Al diecast Indoor','gst_percentage'=>28],

                // Indoor LED with MS Cabinet
                ['name'=>'Unilumin P2.5','sku'=>'Uni Fix P2.5','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P1.8','sku'=>'Uni Fix P1.8','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P1.5','sku'=>'Uni Fix P1.5','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P1.2','sku'=>'Uni Fix P1.2','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P0.9','sku'=>'Uni Fix P0.9','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P2.5 Flexible','sku'=>'Uni Flex P2.5','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P1.8 Flexible','sku'=>'Uni Flex P1.8','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
                ['name'=>'Unilumin P1.5 Flexible','sku'=>'Uni Flex P1.5','size'=>'320 mm X 160 mm','hsn_code'=>'85299090','brand'=>'Unilumin','type'=>'Active LED Indoor with MS Cabinet','gst_percentage'=>18],
            ],
            'outdoor_led' => [
                // Outdoor LED
                ['name'=>'Unilumin Ufix 4','sku'=>'Ufix 4','size'=>'960 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Unilumin UFix 6','sku'=>'Ufix 6','size'=>'960 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Unilumin Usurface IV 4','sku'=>'Usurface IV 4','size'=>'960 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Unilumin Usurface IV 6','sku'=>'Usurface IV 6','size'=>'960 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Absen AS4_V2.','sku'=>'AS4 V2','size'=>'960 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Absen','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Absen AS4_V2 Lshape','sku'=>'AS4 V2','size'=>'1440 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Absen','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Unilumin UDT 4 Lshape','sku'=>'UDT4','size'=>'1440 mm X 960 mm','hsn_code'=>'85285900','brand'=>'Unilumin','type'=>'Active LED Al diecast Outdoor','gst_percentage'=>28],
                ['name'=>'Curtain MESH LED','sku'=>'LED MESH P3.9/7.9','size'=>'1000 mm X 1000 mm','hsn_code'=>'85285900','brand'=>'LJX','type'=>'Transparent Semi outdoor','gst_percentage'=>18],
                ['name'=>'Nano Flex','sku'=>'P12','size'=>'1000 mm X 400 mm','hsn_code'=>'85285900','brand'=>'LJX','type'=>'Transparent Semi outdoor','gst_percentage'=>18],
            ],
            'kiosk' => [
                // Kiosks
                ['name'=>'A FRAME STANDEE 43"','sku'=>'BLACK','size'=>'43 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'STANDY KIOSKS 55"','sku'=>'BLACK','size'=>'55 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'STANDY KIOSKS 50\'\'','sku'=>'BLACK','size'=>'50 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'STANDY KIOSKS 65\'\'','sku'=>'BLACK','size'=>'65 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'15" STANDEE ENCLOSURE','sku'=>'BLACK','size'=>'15 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'21.5" STANDEE ENCLOSURE','sku'=>'BLACK','size'=>'21.5 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'24" STANDEE ENCLOSURE','sku'=>'BLACK','size'=>'24 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
                ['name'=>'32" STANDEE ENCLOSURE','sku'=>'BLACK','size'=>'24 Inch','hsn_code'=>'732690','brand'=>'Radiant Synage','type'=>'KIOSK','gst_percentage'=>18],
            ],
            'controllers' => [
                // Controllers
                ['name'=>'LED Controller Media Players','sku'=>'TB40','size'=>'Upto 130000 pixel','hsn_code'=>'85437049','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'LED Controller Media Players','sku'=>'TB60','size'=>'upto 230000 pixel','hsn_code'=>'85437049','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'LED Controller','sku'=>'X6','size'=>'Upto 130000 pixel','hsn_code'=>'85437042','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'LED Controller','sku'=>'VX400','size'=>'Upto 260000 pixel','hsn_code'=>'85437042','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'LED Controller','sku'=>'VX600','size'=>'Upto 390000 pixel','hsn_code'=>'85437042','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'LED Controller','sku'=>'VX1000','size'=>'Upto 650000 pixel','hsn_code'=>'85437042','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
                ['name'=>'4K prime Controller','sku'=>'4K prime','size'=>'Upto 10,400,000 pixel','hsn_code'=>'85437042','brand'=>'Novastar','type'=>'Controllers','gst_percentage'=>18],
            ],
            'tv_screens' => [
                // TV Screens
                ['name'=>'LG 43" DISPLAYS','sku'=>'LG43UL3J','size'=>'43 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 49" VIDEO WALL','sku'=>'49VL7D','size'=>'49 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 50" DISPLAYS','sku'=>'50UL3J-B','size'=>'50 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 50" DISPLAY','sku'=>'50UR801S','size'=>'50 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 55" DISPLAY','sku'=>'55UR640S','size'=>'55 inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 55" DISPLAY','sku'=>'LG55UL3J','size'=>'55 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 65" DISPLAY','sku'=>'65UL3J','size'=>'65 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 43" Display','sku'=>'43UR640S9TD','size'=>'43 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'LG 43" Display','sku'=>'43UR801','size'=>'43 Inch','hsn_code'=>'85285900','brand'=>'LG','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'SAMSUNG 43" DISPLAY','sku'=>'43 QB43B Sumsung','size'=>'43 Inch','hsn_code'=>'85285900','brand'=>'Samsung','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'SAMSUNG 50" DISPLAY','sku'=>'LH50QBCEB','size'=>'50 Inch','hsn_code'=>'85285900','brand'=>'Samsung','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'SONY 55" DISPLY','sku'=>'FW55EZ20L','size'=>'55 Inch','hsn_code'=>'85285900','brand'=>'SONY','type'=>'Commercial Display','gst_percentage'=>28],
                ['name'=>'SONY 65" DISPLAY','sku'=>'65FWEZ20L','size'=>'65 Inch','hsn_code'=>'85285900','brand'=>'SONY','type'=>'Commercial Display','gst_percentage'=>28],
            ],
        ];

        // Flatten and add category_id to each product
        $products = [];
        foreach ($productsByCategory as $slug => $items) {
            $category = Category::where('slug', $slug)->firstOrFail();
            foreach ($items as $data) {
                $data['category_id'] = $category->id;
                $data['product_type'] = $slug;
                $products[] = $data;
            }
        }

        foreach ($products as &$data) {
            // random pricing
            $price = rand(20000, 200000);
            $data['price']           = $price;
            $data['price_per_sqft']  = rand(1000, 5000);
            $data['min_price']       = intval($price * 0.9);
            $data['max_price']       = intval($price * 1.1);
            $data['status']          = 'active';
            $data['unit']            = 'INR';
            $data['description']     = $data['name'] . ' – high-quality ' . strtolower($data['type']);

            // parse size ⇒ w_mm & h_mm (mm or inch)
            $data['w_mm'] = null;
            $data['h_mm'] = null;
            $data['size_inch'] = null;
            if ($data['product_type'] === 'tv_screens' || $data['product_type'] === 'kiosk') {
                // For TV screens and kiosks, only set size_inch, leave w_mm and h_mm null
                if (preg_match('/([\d\.]+)\s*Inch/i', $data['size'], $i)) {
                    $data['size_inch'] = (float)$i[1];
                }
            } else {
                if (preg_match('/([\d\.]+)\s*mm\s*X\s*([\d\.]+)\s*mm/i', $data['size'], $m)) {
                    $data['w_mm'] = (float)$m[1];
                    $data['h_mm'] = (float)$m[2];
                } elseif (preg_match('/([\d\.]+)\s*Inch\s*X\s*([\d\.]+)\s*Inch/i', $data['size'], $i)) {
                    // e.g. 43 Inch X 24 Inch
                    $data['w_mm'] = round((float)$i[1] * 25.4, 2);
                    $data['h_mm'] = round((float)$i[2] * 25.4, 2);
                    $data['size_inch'] = (float)$i[1];
                } elseif (preg_match('/([\d\.]+)\s*Inch/i', $data['size'], $i)) {
                    $data['w_mm'] = round((float)$i[1] * 25.4, 2);
                    $data['h_mm'] = null;
                    $data['size_inch'] = (float)$i[1];
                }
            }

            // parse upto_pix
            if (preg_match('/Upto\s*([\d,]+)\s*pixel/i', $data['size'], $p)) {
                $data['upto_pix'] = (int)str_replace(',', '', $p[1]);
            }
        }
        unset($data);

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['name' => $data['name'], 'sku' => $data['sku'], 'category_id' => $data['category_id'], 'hsn_code' => $data['hsn_code'], 'brand' => $data['brand'], 'type' => $data['type'], 'gst_percentage' => $data['gst_percentage']],
                $data
            );
        }
    }
}
