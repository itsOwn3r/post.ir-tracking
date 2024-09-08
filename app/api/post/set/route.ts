import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ success: false, message: "code is required!" });
    }

    const findTrackingCode = await db.trackingPackage.findFirst({
        where: {
            code: code
        }
    })


    if (findTrackingCode) {
        return NextResponse.json({ success: false, message: "This tracking code already exist!" });
    } else {
        const createTrackingCode = await db.trackingPackage.create({
            data: {
                code
            }
        })

        if (createTrackingCode) {
            return NextResponse.json({ success: true });            
        }
    }


}
