import { NextResponse } from "next/server";
import fetch from "node-fetch";

export const revalidate = 0;

export async function GET() {

    try {

        const apiWrapperurl = process.env.URL!
                
        const startTest = await fetch(`${apiWrapperurl}/api/tg`, {
            method: "POST",
            body: JSON.stringify({
                text: "Test1",
                chat_id: Number(process.env.CHAT_ID)
            })
        });

        const response = await startTest.json();

        if (response) {
            console.log(response);
        }

    return NextResponse.json({ success: true, data: JSON.stringify(response) });
            
} catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }); 
}
}
