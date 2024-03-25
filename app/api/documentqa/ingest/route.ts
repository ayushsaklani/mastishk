import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import {Milvus} from "@langchain/community/vectorstores/milvus";
import {OpenAIEmbeddings} from '@langchain/openai'
import {QdrantVectorStore} from '@langchain/community/vectorstores/qdrant';

const OPENAI_KEY = process.env.OPENAI_KEY;
const OPENAI_ORG = process.env.OPENAI_ORG;
const MILVIUS_URL= process.env.MILVUS_URL;
const MILVIUS_TOKEN= process.env.MILVUS_TOKEN;
const OPENAI_MODEL= "text-embedding-3-small";
const QDRANT_URL=process.env.QDRANT_URL;
const QDRANT_API_KEY=process.env.QDRANT_API_KEY;

export async function POST(req:NextRequest) {
    console.log("In Ingest") 
    
    try{
      const body = await req.formData();
      const pdf:File | null = body.get("pdf") as unknown as File;
      const uuid:string | null = body.get("uuid") as string;
      if (pdf === null || uuid ==null)  return NextResponse.json({ error: "Uploaded File is null" }, { status: 500 });
       const loader = new PDFLoader(pdf, {
        parsedItemSeparator: " ",
        splitPages:true
      });
      const docs = await loader.load();
      
      // console.log(docs);
      const splitter = new RecursiveCharacterTextSplitter({
           chunkSize: 500,
           chunkOverlap:50,
         });
       const splitDocs = await splitter.splitDocuments(docs);
        //console.log(splitDocs);

      const vectorStore = await QdrantVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({dimensions:1024,modelName:OPENAI_MODEL,openAIApiKey:OPENAI_KEY}),
      {
        collectionName:uuid,
        url:QDRANT_URL,
        apiKey:QDRANT_API_KEY
      });
     console.log("Inserted") 
   





      
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
