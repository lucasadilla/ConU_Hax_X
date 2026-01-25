import { NextResponse } from "next/server"

import { connectToDatabase } from "@/lib/mongodb"
import Quest from "@/models/Quest"

export async function GET() {
  try {
    await connectToDatabase()

    const count = await Quest.countDocuments({ isActive: true })
    if (count === 0) {
      return NextResponse.json({ error: "No quests available" }, { status: 404 })
    }

    const randomIndex = Math.floor(Math.random() * count)
    const quest = await Quest.findOne({ isActive: true })
      .skip(randomIndex)
      .select("_id")

    if (!quest) {
      return NextResponse.json({ error: "No quests available" }, { status: 404 })
    }

    return NextResponse.json({ id: quest._id.toString() })
  } catch (error) {
    console.error("Failed to fetch random quest:", error)
    return NextResponse.json(
      { error: "Failed to fetch random quest" },
      { status: 500 }
    )
  }
}
