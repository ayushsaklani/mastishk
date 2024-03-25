import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";
import {QdrantVectorStore} from '@langchain/community/vectorstores/qdrant';
import {OpenAIEmbeddings} from '@langchain/openai';



const SYSTEM_PROMPT = `You are a friendly chatbot assistant named Mastishk which means "Brain" in Sanskrit.
Reply to the explicit user questions in polite and consie way using the context and information provided.  
If no revelant information is found than politely decline and ask for more clarification.
Be concise, polite and respectful.`;
const OPENAI_KEY = process.env.OPENAI_KEY
const OPENAI_ORG = process.env.OPENAI_ORG
const OPENAI_MODEL= "gpt-3.5-turbo"
const QDRANT_URL=process.env.QDRANT_URL;
const QDRANT_API_KEY=process.env.QDRANT_API_KEY;
const OPENAI_EMB_MODEL= "text-embedding-3-small";



export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const uuid = body.uuid;
        
        const bmessages = body.messages ?? []
        if (bmessages.length == 0){
            return NextResponse.json({error: "please type your query"},{status:500})
       }
        const currMsg = bmessages[bmessages.length -1];
        bmessages.splice(0,-1);
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
                              new OpenAIEmbeddings({dimensions:1024,modelName:OPENAI_EMB_MODEL,openAIApiKey:OPENAI_KEY}),
                              {
                                collectionName:uuid,
                                url:QDRANT_URL,
                                apiKey:QDRANT_API_KEY
                              }); 
        const retrival = await vectorStore.similaritySearch(bmessages[bmessages.length -1]["content"],5)
        
        
        let extra_info = "";
        retrival.forEach(doc => {
                    extra_info += doc.pageContent +" ";
                    
                    });
        //console.log(extra_info)
        currMsg["content"] += "\n Information:" + extra_info; 
        const messages =[{"role":"system","content":SYSTEM_PROMPT.trim()},...bmessages]
        messages.push(currMsg);

        //console.log(messages)
   
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
