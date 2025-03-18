import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { Video } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { like, ilike } from "drizzle-orm";
export async function GET(request: Request) {
   try {

      const { searchParams } = new URL(request.url);
      const page = Number(searchParams.get('page')) || 1; 
      const search = searchParams.get('search') || "";
      const limit = 15;
      const offset = (page - 1) * limit; 
      let totalCount = 0;
      let videos: any[] = [];
      if(search){
         totalCount = await db.select({count:count()})
           .from(Video)
           .where(ilike(Video.title, `%${search}%`)) // Use like for pattern matching
           .then((res)=>res[0].count);
         console.log("totalCount", totalCount);
         videos = await db.select()
           .from(Video)
           .where(ilike(Video.title, `%${search}%`)) // Use like for pattern matching
           .limit(limit)
           .offset(offset);
       }else{
      totalCount = await db.select({count:count()}).from(Video).then((res)=>res[0].count)
      console.log("totalCount", totalCount)
      videos = await db.select().from(Video).limit(limit).offset(offset);
    }

     
      const hasMore = offset + limit < totalCount;

      return NextResponse.json({ videos, nextPage: hasMore ? page + 1 : null }); // Return nextPage or null
   } catch (error) {
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
   }
}