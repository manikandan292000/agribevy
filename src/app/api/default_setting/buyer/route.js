import { querys } from "@/src/app/lib/DbConnection";
import { verifyToken } from "@/src/app/lib/Token";
import { NextResponse } from "next/server";
import cloudinary from "@/src/app/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
    
    try {
        const auth = await verifyToken(req)
        const data = await req.formData()
        // console.log(data)
        
        const logo = data.get('file')
        const name = data.get('shop_name')
        const address = data.get('shop_address')
        const discount = data.get('discount')
        const language = data.get('language')
        const app_language = data.get('app_language')
        const mode = data.get('payment_mode')
        const discount_show = parseInt(data.get("discount_show"))
        
        if (!logo) {
            return NextResponse.json({
                status: 400,
                message: 'No file uploaded'
            }, { status: 400 });
        }

        const mimeType = logo.type;
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!validMimeTypes.includes(mimeType)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid file type. Only JPEG, PNG, and JPG are allowed.'
            }, { status: 400 });
        }

        const bytes = await logo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await cloudinary.uploader.upload(`data:${mimeType};base64,${buffer.toString('base64')}`, {
            folder: 'uploads/logo',
            resource_type: 'image',
        });

        const imagePath = uploadResponse.secure_url;

        const { decoded } = auth
        const buyerMobile = decoded.mobile
        const role = decoded.role

        if (role == 'buyer') {
            const result = await querys({
                query: `INSERT INTO buyer_settings (shop_name, shop_address, logo, discount_show,discount, payment_mode, buyer_mobile, language, app_language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                values: [name, address, imagePath, discount_show, discount, mode, buyerMobile, language, app_language]
            });

            // Check if insertion was successful
            if (result.affectedRows > 0) {
                return NextResponse.json({
                    message: 'Default values added successfully',
                    data: {lan:language, app:app_language, show:discount_show, type:discount},
                    status: 200
                }, { status: 200 });
            }

            return NextResponse.json({
                message: 'Failed to add Default values',
                status: 400
            }, { status: 400 });
        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

    } catch (error) {
        console.error('Server Error:', error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}


export async function GET(req) {
    try {
        const auth = await verifyToken(req)
        const { decoded } = auth

        if (decoded.role == 'buyer') {
            const [rows] = await querys({
                query: `SELECT * FROM buyer_settings WHERE buyer_mobile = ?`,
                values: [decoded.mobile]
            })

            if (rows) {
                return NextResponse.json({
                    message: 'Default Setting Listed successfully',
                    data: rows,
                    status: 200
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    message: 'No Data Found',
                    status: 404
                }, { status: 404 });
            }
        } else {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

    } catch (error) {
        console.error('Server Error:', error);

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const auth = await verifyToken(req);
        const data = await req.formData();
        
        const logo = data.get('file')
        const name = data.get('shop_name')
        const address = data.get('shop_address')
        const discount = data.get('discount')
        const language = data.get('language')
        const app_language = data.get('app_language')
        const mode = data.get('payment_mode')
        const discount_show = parseInt(data.get("discount_show"))
        const existing = data.get("existingLogo");

        const { decoded } = auth;
        const buyerMobile = decoded.mobile;
        const role = decoded.role;
        console.log(decoded,"************");
        
        if (role !== 'buyer') {
            return NextResponse.json({
                message: 'Unauthorized',
                status: 403
            }, { status: 403 });
        }

        let storePath = existing; // Default to existing logo path

        // Check if a new file has been uploaded
        if (!existing && logo) {
            const mimeType = logo.type;
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validMimeTypes.includes(mimeType)) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, and JPG are allowed.'
                }, { status: 400 });
            }

            const bytes = await logo.arrayBuffer();
            const buffer = Buffer.from(bytes);

            if (existing) {
                // Extract public ID from Cloudinary URL
                const publicId = existing.split('/').pop().split('.')[0]; 
                await cloudinary.uploader.destroy(`uploads/logo/${publicId}`); // Delete old logo
            }

            const uploadResponse = await cloudinary.uploader.upload(`data:${mimeType};base64,${buffer.toString('base64')}`, {
                folder: 'uploads/logo',
                resource_type: 'image',
            });
    
             storePath = uploadResponse.secure_url;
        }

        // Perform an UPDATE operation, including the logo if it has been changed
        const query = !existing
        ? `UPDATE buyer_settings SET shop_name = ?, shop_address = ?, logo = ?, discount_show = ?, discount = ?, payment_mode = ?, language = ?, app_language = ? WHERE buyer_mobile = ?`
        : `UPDATE buyer_settings SET shop_name = ?, shop_address = ?, discount_show = ?, 
        discount = ?, payment_mode = ?, language = ?, app_language = ? WHERE buyer_mobile = ?`;

        const values = logo
            ? [name, address, storePath, discount_show, discount, mode, language, app_language, buyerMobile]  
            : [name, address, discount_show, discount, mode, language, app_language, buyerMobile];     

        const result = await querys({ query, values });

        // Check if the update was successful
        if (result.affectedRows > 0) {
            return NextResponse.json({
                message: 'Default values updated successfully',
                data: {lan:language, app:app_language, show:discount_show, type:discount},
                status: 200
            }, { status: 200 });
        }

        return NextResponse.json({
            message: 'Failed to update Default values',
            status: 400
        }, { status: 400 });

    } catch (error) {
        console.error('Server Error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                message: 'Entry already exists',
                status: 400
            }, { status: 400 });
        }

        return NextResponse.json({
            message: 'Server Error',
            status: 500
        }, { status: 500 });
    }
}
