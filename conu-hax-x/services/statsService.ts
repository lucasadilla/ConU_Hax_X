
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Ticket from '@/models/Ticket';
import Attempt from '@/models/Attempt';
import Badge from '@/models/Badge';

export interface GlobalStats {
    quests: number;
    users: number;
    submissions: number;
    achievements: number;
}

export class StatsService {
    /**
     * Get global statistics for the hero section
     */
    static async getGlobalStats(): Promise<GlobalStats> {
        await connectToDatabase();

        const [users, quests, submissions, achievements] = await Promise.all([
            User.countDocuments(),
            Ticket.countDocuments(),
            Attempt.countDocuments(),
            Badge.countDocuments(),
        ]);

        return {
            users,
            quests,
            submissions,
            achievements,
        };
    }
}

export default StatsService;
