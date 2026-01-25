
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import Quest, { UserQuestProgress } from "@/models/Quest";
import QuestService from "@/services/questService";
import StreakService from "@/services/streakService";
import BadgeService from "@/services/badgeService";
import { awardBadge as markAttemptBadgeEarned, mintCompletionNFT } from "@/services/nftRewardService";
import mongoose from "mongoose";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            console.error("[COMPLETE_API] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: ticketId } = await params;
        const body = await request.json();
        const { solution, timeSpent = 0 } = body;

        console.log(`[COMPLETE_API] Processing ticket ${ticketId} for user ${session.user.id}`);

        await connectToDatabase();

        // 1. Find Ticket
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.error(`[COMPLETE_API] Ticket not found: ${ticketId}`);
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // 2. CHECK FOR PREVIOUS SUCCESSFUL ATTEMPT (Idempotency)
        const userIdObj = typeof session.user.id === 'string' ? new mongoose.Types.ObjectId(session.user.id) : session.user.id;
        const ticketIdObj = typeof ticketId === 'string' ? new mongoose.Types.ObjectId(ticketId) : ticketId;

        const existingPassedAttempt = await Attempt.findOne({
            userId: userIdObj,
            ticketId: ticketIdObj,
            passed: true
        });

        const isFirstTimeSuccess = !existingPassedAttempt;

        // 3. Create new Successful Attempt
        const attempt = await Attempt.create({
            userId: session.user.id,
            ticketId,
            solution,
            passed: true,
            score: 100,
            createdAt: new Date(),
        });
        console.log(`[COMPLETE_API] Attempt recorded: ${attempt._id}`);

        // 4. Update User Profile (XP, Level, Streak) - ONLY IF FIRST TIME
        const user = await User.findById(session.user.id);
        if (!user) {
            console.error(`[COMPLETE_API] User not found: ${session.user.id}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (isFirstTimeSuccess) {
            console.log("[COMPLETE_API] First time completion. Awarding XP...");
            // Call method (cast to any to avoid TS issues with prototype methods in models)
            if (typeof (user as any).completeTicket === 'function') {
                (user as any).completeTicket(ticket.points || 0);
            } else {
                user.totalPoints += (ticket.points || 0);
                user.experience += (ticket.points || 0);
            }
            await user.save();
        } else {
            console.log("[COMPLETE_API] Re-submission of solved ticket. Skipping XP/Badge rewards.");
        }

        // Update streak (non-blocking errors)
        try {
            await StreakService.updateStreak(user._id);
        } catch (sErr) {
            console.warn("[COMPLETE_API] Streak update failed, continuing...", sErr);
        }

        // 5. AWARD TICKET BADGE (ONLY IF FIRST TIME)
        let awardedBadge = null;
        if (isFirstTimeSuccess) {
            try {
                awardedBadge = await BadgeService.awardCompletionBadge(
                    user._id,
                    ticket._id,
                    100, // score
                    ticket.title
                );
                console.log(`[COMPLETE_API] Badge awarded: ${awardedBadge.name}`);

                // Mark attempt as badge earned (for NFT system visibility)
                await markAttemptBadgeEarned(user._id.toString(), ticket._id.toString());
            } catch (bErr) {
                console.error("[COMPLETE_API] Failed to award badge:", bErr);
            }
        }

        // 6. Update Quest Progress and Find NEXT TICKET
        const quest = await Quest.findOne({ "stages.ticketId": ticketId });

        let progressUpdate = null;
        let nftMinted = null;
        let nextTicketId = null;

        if (quest) {
            console.log(`[COMPLETE_API] Ticket belongs to quest: ${quest.title}`);

            const stageIndex = quest.stages.findIndex((s: any) => s.ticketId.toString() === ticketId.toString());

            if (stageIndex !== -1) {
                // Ensure quest progress is initialized
                try {
                    await QuestService.startQuest(user._id, quest._id);

                    // Use service to advance quest
                    progressUpdate = await QuestService.completeStage(
                        user._id,
                        quest._id,
                        stageIndex,
                        100, // score
                        attempt._id,
                        timeSpent
                    );
                    console.log("[COMPLETE_API] Quest stage advanced successfully");

                    // FIND NEXT TICKET ID
                    const nextStage = quest.stages.find((s: any) => s.order === quest.stages[stageIndex].order + 1);
                    if (nextStage) {
                        nextTicketId = nextStage.ticketId.toString();
                        console.log(`[COMPLETE_API] Next ticket identified: ${nextTicketId}`);
                    }

                    // TRIGGER NFT MINT IF FINAL STAGE
                    if (progressUpdate.isCompleted && user.phantomWalletAddress) {
                        console.log("[COMPLETE_API] Quest fully completed! Triggering NFT mint...");
                        nftMinted = await mintCompletionNFT(user._id.toString(), ticket._id.toString());
                    }

                } catch (qErr: any) {
                    console.error("[COMPLETE_API] Quest progression failed:", qErr.message);
                }
            }
        }

        return NextResponse.json({
            success: true,
            pointsAwarded: isFirstTimeSuccess ? ticket.points : 0,
            newTotalPoints: user.totalPoints,
            newExperience: user.experience,
            newLevel: user.level,
            badge: awardedBadge,
            questProgress: progressUpdate,
            nextTicketId,
            nftMinted,
            reSolved: !isFirstTimeSuccess
        });
    } catch (error: any) {
        console.error("[COMPLETE_API] CRITICAL ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}
