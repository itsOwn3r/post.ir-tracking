import { NextResponse } from "next/server";
import fetch from "node-fetch";

export const revalidate = 0;

export async function GET() {

    const apiWrapperurl = process.env.URL!
                
    const sendReport = async (text: string) => { 
        
        await fetch(`${apiWrapperurl}/api/tg`, {
        method: "POST",
        body: JSON.stringify({
            text,
            chat_id: Number(process.env.CHAT_ID)
        })
    });

    }

    try {

        const options = {
            method: 'POST',
            headers: {
              'Host': 'dev-api.goatsbot.xyz',
              'User-Agent': 'Mozilla/5.0 (Linux; Android 9; K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Encoding': 'gzip, deflate',
              'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlMDM4MzJlYzc0M2Y5ZWEwYWRkZWM0IiwiaWF0IjoxNzI1OTcwNDgzLCJleHAiOjE3MjYwNTY4ODMsInR5cGUiOiJhY2Nlc3MifQ.x0dPfYZPUwamoZ-K1cWmIhA1Cptwh5CpcRTxtYp4E0s',
              'origin': 'https://dev.goatsbot.xyz',
              'x-requested-with': 'org.telegram.messenger.web',
              'sec-fetch-site': 'same-site',
              'sec-fetch-mode': 'cors',
              'sec-fetch-dest': 'empty',
              'referer': 'https://dev.goatsbot.xyz/',
              'accept-language': 'en,en-US;q=0.9'
            }
          };
          
          const request = await fetch('https://api-mission.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e', options);

          const response = await request.json();

// @ts-expect-error here
          if (response.status === "success") {
            sendReport("it was suucessful");
            return NextResponse.json({ success: true,  });            
        } else {
              sendReport("it was not suucessful")
                return NextResponse.json({ success: false,  });

          }
            
} catch (error) {
    sendReport((error as Error).message);
    return NextResponse.json({ success: false, message: (error as Error).message }); 
}
}
