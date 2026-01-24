// Service for managing tickets
import { connectToDatabase } from '@/lib/mongodb';
import Ticket, { ITicket } from '@/models/Ticket';
import { generateWithContext } from '@/lib/gemini';
import {
  GENERATE_TICKET_SYSTEM_PROMPT,
  generateTicketPrompt,
} from '@/prompts/generateTicket';
import mongoose from 'mongoose';

export interface CreateTicketData {
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  language?: string;
}

export class TicketService {
  /**
   * Generate a new ticket using AI and save to database
   */
  static async generateAndSaveTicket(data: CreateTicketData): Promise<ITicket> {
    await connectToDatabase();

    const { difficulty, topic, language = 'javascript' } = data;

    // Generate ticket using Gemini AI
    const prompt = generateTicketPrompt(difficulty, topic, language);
    const response = await generateWithContext(
      GENERATE_TICKET_SYSTEM_PROMPT,
      prompt
    );

    // Parse JSON response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonText = jsonMatch ? jsonMatch[1] : response;
    const ticketData = JSON.parse(jsonText);

    // Create and save ticket
    const ticket = await Ticket.create({
      ...ticketData,
      generatedBy: 'ai',
      prompt: prompt.substring(0, 200), // Store first 200 chars
    });

    return ticket;
  }

  /**
   * Get ticket by ID
   */
  static async getTicketById(ticketId: string | mongoose.Types.ObjectId): Promise<ITicket | null> {
    await connectToDatabase();
    return Ticket.findById(ticketId);
  }

  /**
   * Get tickets with filters
   */
  static async getTickets(filters: {
    difficulty?: string;
    category?: string;
    language?: string;
    tags?: string[];
    limit?: number;
    skip?: number;
  } = {}): Promise<ITicket[]> {
    await connectToDatabase();

    const query: any = { isActive: true };

    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.category) query.category = filters.category;
    if (filters.language) query.language = filters.language;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    return Ticket.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .skip(filters.skip || 0);
  }

  /**
   * Get random ticket
   */
  static async getRandomTicket(difficulty?: string): Promise<ITicket | null> {
    await connectToDatabase();

    const query: any = { isActive: true };
    if (difficulty) query.difficulty = difficulty;

    const count = await Ticket.countDocuments(query);
    if (count === 0) return null;

    const random = Math.floor(Math.random() * count);
    const tickets = await Ticket.find(query).limit(1).skip(random);

    return tickets[0] || null;
  }

  /**
   * Update ticket statistics
   */
  static async updateTicketStats(
    ticketId: string | mongoose.Types.ObjectId,
    score: number,
    success: boolean
  ): Promise<void> {
    await connectToDatabase();

    const ticket = await Ticket.findById(ticketId);
    if (ticket) {
      ticket.recordAttempt(score, success);
      await ticket.save();
    }
  }

  /**
   * Get popular tickets
   */
  static async getPopularTickets(limit: number = 10): Promise<ITicket[]> {
    await connectToDatabase();

    return Ticket.find({ isActive: true })
      .sort({ attemptCount: -1 })
      .limit(limit);
  }

  /**
   * Search tickets
   */
  static async searchTickets(searchTerm: string): Promise<ITicket[]> {
    await connectToDatabase();

    return Ticket.find({
      isActive: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } },
      ],
    }).limit(20);
  }
}

export default TicketService;
