import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";


const SYSTEM_PROMPT = `You are a friendly assistant named Mastishk which means "Brain" in Sanskrit. Reply to the users query in polite and consie way.  
Be concise, polite and respectful.`;
const OPENAI_KEY = process.env.OPENAI_KEY
const OPENAI_ORG = process.env.OPENAI_ORG
const OPENAI_MODEL= "gpt-3.5-turbo"

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const bmessages = body.messages ?? []
        if (bmessages.length == 0){
            return NextResponse.json({error: "please type your query"},{status:500})
       }
        
        const messages =[{"role":"system","content":SYSTEM_PROMPT.trim()},...bmessages] 

        console.log(messages)
        
        const model = new OpenAI({
                                  apiKey:OPENAI_KEY,
                                  organization:OPENAI_ORG}); 

        const response = await model.chat.completions.create({
                                  messages:messages,
                                  model:OPENAI_MODEL,
                                  stream:true
                      });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    }
    catch (e:any){
        return NextResponse.json({error: e.message},{status:e.status ?? 500})
    }
}
