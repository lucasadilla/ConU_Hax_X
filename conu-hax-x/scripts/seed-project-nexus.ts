/**
 * Seed ProjectNexus: Monorepo Scale Up Quest
 * 
 * This script creates the complete quest with 3 stages and realistic test cases
 */

// Load environment variables
import 'dotenv/config';

import { connectToDatabase } from '../lib/mongodb';
import { Quest } from '../models/Quest';
import Ticket from '../models/Ticket';
import mongoose from 'mongoose';

async function seedProjectNexusQuest() {
  try {
    await connectToDatabase();
    console.log('🌱 Starting ProjectNexus Quest seeding...\n');

    // Stage 1: Easy - Set up monorepo structure
    console.log('Creating Stage 1 (Easy): Monorepo Setup');
    const stage1Ticket = await Ticket.create({
      title: 'ProjectNexus Stage 1: Monorepo Setup',
      description: `You're tasked with setting up a basic monorepo structure for ProjectNexus. 
      Create a function that validates workspace package names follow the @projectnexus/* naming convention.`,
      difficulty: 'easy',
      scenario: 'The team is migrating from multiple repositories to a monorepo. You need to ensure all packages follow the organization naming convention.',
      
      startingCode: `// Validate package names for the @projectnexus/* monorepo
// Return true if valid, false otherwise

function validatePackageName(name) {
  // TODO: Implement validation logic
  // Valid format: @projectnexus/package-name
  // Rules:
  // - Must start with @projectnexus/
  // - Package name must only contain lowercase letters, numbers, and hyphens
  // - Package name cannot be empty
  
}`,
      
      testCases: [
        {
          input: JSON.stringify('@projectnexus/auth'),
          expectedOutput: JSON.stringify(true),
          isHidden: false,
          description: 'Valid package name with single word',
        },
        {
          input: JSON.stringify('@projectnexus/user-service'),
          expectedOutput: JSON.stringify(true),
          isHidden: false,
          description: 'Valid package name with hyphen',
        },
        {
          input: JSON.stringify('not-a-valid-name'),
          expectedOutput: JSON.stringify(false),
          isHidden: false,
          description: 'Missing organization scope',
        },
        {
          input: JSON.stringify('@projectnexus/'),
          expectedOutput: JSON.stringify(false),
          isHidden: true,
          description: 'Missing package name',
        },
        {
          input: JSON.stringify('@wrongorg/package'),
          expectedOutput: JSON.stringify(false),
          isHidden: true,
          description: 'Wrong organization name',
        },
        {
          input: JSON.stringify('@projectnexus/Package'),
          expectedOutput: JSON.stringify(false),
          isHidden: true,
          description: 'Contains uppercase letters',
        },
      ],
      
      requirements: [
        'Function must accept a string parameter',
        'Return true for valid @projectnexus/* packages',
        'Return false for invalid package names',
        'Handle edge cases (empty string, special characters)',
      ],
      
      hints: [
        'Use a regular expression to validate the format',
        'Remember to check for the @projectnexus/ prefix',
        'Package names should only contain lowercase letters, numbers, and hyphens',
      ],
      
      acceptanceCriteria: [
        'All visible test cases pass',
        'All hidden test cases pass',
        'Code is clean and readable',
        'Edge cases are handled properly',
      ],
      
      completionNFTName: 'ProjectNexus: Monorepo Master I',
      completionNFTDescription: 'Completed Stage 1 of ProjectNexus quest',
      completionNFTImageUrl: '/badges/feature-creation-quest-1-easy.svg',
      completionNFTAttributes: [
        { trait_type: 'Quest', value: 'ProjectNexus' },
        { trait_type: 'Stage', value: '1' },
        { trait_type: 'Difficulty', value: 'Easy' },
        { trait_type: 'Theme', value: 'Feature Creation' },
      ],
      
      language: 'javascript',
      category: 'Monorepo',
      tags: ['monorepo', 'validation', 'regex', 'naming-convention'],
      points: 50,
      estimatedMinutes: 25,
    });

    // Stage 2: Medium - Implement package dependencies resolver
    console.log('Creating Stage 2 (Medium): Dependency Resolution');
    const stage2Ticket = await Ticket.create({
      title: 'ProjectNexus Stage 2: Dependency Resolver',
      description: `Implement a dependency resolver that determines the build order for packages in the monorepo. 
      Given a map of package dependencies, return the correct build order.`,
      difficulty: 'medium',
      scenario: 'The CI/CD pipeline needs to build packages in the correct order. Packages must be built after their dependencies.',
      
      startingCode: `// Resolve build order for monorepo packages
// Given dependencies, return packages in the order they should be built
// Throw an error if circular dependencies are detected

function resolveBuildOrder(dependencies) {
  // TODO: Implement topological sort
  // Input: { packageName: [dependencies...] }
  // Output: [packages in build order]
  // Example: { api: ['database'], database: [] } -> ['database', 'api']
  
}`,
      
      testCases: [
        {
          input: JSON.stringify({ 'database': [], 'api': ['database'], 'auth': ['database'] }),
          expectedOutput: JSON.stringify(['database', 'api', 'auth']),
          isHidden: false,
          description: 'Simple dependency chain',
        },
        {
          input: JSON.stringify({ 'a': [], 'b': [], 'c': [] }),
          expectedOutput: JSON.stringify(['a', 'b', 'c']),
          isHidden: false,
          description: 'No dependencies',
        },
        {
          input: JSON.stringify({ 'ui': ['auth', 'api'], 'auth': ['database'], 'api': ['database'], 'database': [] }),
          expectedOutput: JSON.stringify(['database', 'auth', 'api', 'ui']),
          isHidden: true,
          description: 'Complex dependency tree',
        },
        {
          input: JSON.stringify({ 'a': ['b'], 'b': ['c'], 'c': ['a'] }),
          expectedOutput: JSON.stringify('ERROR'),
          isHidden: true,
          description: 'Circular dependency should throw error',
        },
      ],
      
      requirements: [
        'Implement topological sort algorithm',
        'Return packages in valid build order',
        'Detect and throw error for circular dependencies',
        'Handle empty dependencies',
      ],
      
      hints: [
        'Use Kahn\'s algorithm or DFS-based topological sort',
        'Track visited nodes to detect cycles',
        'Process packages with no dependencies first',
      ],
      
      acceptanceCriteria: [
        'Correct build order for all valid inputs',
        'Circular dependencies are detected',
        'Algorithm is efficient',
        'Code is well-documented',
      ],
      
      completionNFTName: 'ProjectNexus: Monorepo Master II',
      completionNFTDescription: 'Completed Stage 2 of ProjectNexus quest',
      completionNFTImageUrl: '/badges/feature-creation-quest-2-medium.svg',
      completionNFTAttributes: [
        { trait_type: 'Quest', value: 'ProjectNexus' },
        { trait_type: 'Stage', value: '2' },
        { trait_type: 'Difficulty', value: 'Medium' },
        { trait_type: 'Theme', value: 'Feature Creation' },
      ],
      
      language: 'javascript',
      category: 'Monorepo',
      tags: ['monorepo', 'algorithms', 'graph', 'topological-sort'],
      points: 100,
      estimatedMinutes: 40,
    });

    // Stage 3: Hard - Optimize build caching
    console.log('Creating Stage 3 (Hard): Build Cache Optimization');
    const stage3Ticket = await Ticket.create({
      title: 'ProjectNexus Stage 3: Build Cache Optimizer',
      description: `Implement an intelligent build cache that determines which packages need rebuilding based on file changes. 
      Compare current file hashes with cached hashes and return packages that need rebuilding, including their dependents.`,
      difficulty: 'hard',
      scenario: 'To speed up CI/CD, we need to cache builds and only rebuild changed packages and their dependents.',
      
      startingCode: `// Determine which packages need rebuilding based on file changes
// Compare current file hashes with cached hashes
// Include all packages that depend on changed packages

function determineBuildTargets(currentHashes, cachedHashes, dependencies) {
  // TODO: Implement build cache logic
  // Input: 
  //   currentHashes: { packageName: 'hash123' }
  //   cachedHashes: { packageName: 'oldHash' }
  //   dependencies: { packageName: [dependencyNames] }
  // Output: Array of package names that need rebuilding
  
}`,
      
      testCases: [
        {
          input: JSON.stringify([
            { 'api': 'abc123', 'auth': 'def456' },
            { 'api': 'abc123', 'auth': 'old789' },
            { 'ui': ['auth'], 'auth': [], 'api': [] }
          ]),
          expectedOutput: JSON.stringify(['auth', 'ui']),
          isHidden: false,
          description: 'Auth changed, UI depends on it',
        },
        {
          input: JSON.stringify([
            { 'a': 'h1', 'b': 'h2', 'c': 'h3' },
            { 'a': 'h1', 'b': 'h2', 'c': 'h3' },
            { 'a': [], 'b': ['a'], 'c': ['b'] }
          ]),
          expectedOutput: JSON.stringify([]),
          isHidden: false,
          description: 'No changes, no rebuild needed',
        },
        {
          input: JSON.stringify([
            { 'database': 'new1', 'auth': 'h2', 'api': 'h3', 'ui': 'h4' },
            { 'database': 'old1', 'auth': 'h2', 'api': 'h3', 'ui': 'h4' },
            { 'database': [], 'auth': ['database'], 'api': ['database'], 'ui': ['auth', 'api'] }
          ]),
          expectedOutput: JSON.stringify(['database', 'auth', 'api', 'ui']),
          isHidden: true,
          description: 'Root package changed, all dependents need rebuild',
        },
        {
          input: JSON.stringify([
            { 'ui': 'new1', 'auth': 'h2', 'database': 'h3' },
            { 'ui': 'old1', 'auth': 'h2', 'database': 'h3' },
            { 'database': [], 'auth': ['database'], 'ui': ['auth'] }
          ]),
          expectedOutput: JSON.stringify(['ui']),
          isHidden: true,
          description: 'Leaf package changed, only it needs rebuild',
        },
      ],
      
      requirements: [
        'Compare current and cached hashes',
        'Identify changed packages',
        'Include all dependent packages in rebuild list',
        'Handle missing cache entries (treat as changed)',
        'Optimize for performance',
      ],
      
      hints: [
        'Start with packages that have hash mismatches',
        'Traverse the dependency graph to find all dependents',
        'Consider using BFS or DFS for graph traversal',
        'Remember: if A depends on B, and B changes, A must rebuild',
      ],
      
      acceptanceCriteria: [
        'Correctly identifies changed packages',
        'Includes all transitive dependents',
        'Handles missing cache entries',
        'Efficient algorithm (no unnecessary rebuilds)',
        'Clean, maintainable code',
      ],
      
      completionNFTName: 'ProjectNexus: Monorepo Master III',
      completionNFTDescription: 'Completed Stage 3 of ProjectNexus quest - Full Quest Complete!',
      completionNFTImageUrl: '/badges/feature-creation-quest-3-hard.svg',
      completionNFTAttributes: [
        { trait_type: 'Quest', value: 'ProjectNexus' },
        { trait_type: 'Stage', value: '3' },
        { trait_type: 'Difficulty', value: 'Hard' },
        { trait_type: 'Theme', value: 'Feature Creation' },
        { trait_type: 'Quest Complete', value: 'Yes' },
      ],
      
      language: 'javascript',
      category: 'Monorepo',
      tags: ['monorepo', 'caching', 'optimization', 'build-tools'],
      points: 200,
      estimatedMinutes: 60,
    });

    // Create the Quest
    console.log('\nCreating ProjectNexus Quest');
    const quest = await Quest.create({
      title: 'ProjectNexus: Monorepo Scale Up',
      description: 'Master monorepo architecture by setting up package validation, dependency resolution, and build caching for a large-scale TypeScript project.',
      theme: 'feature-creation',
      iconEmoji: '✨',
      
      stages: [
        {
          difficulty: 'easy',
          ticketId: stage1Ticket._id,
          order: 1,
          unlocked: true, // First stage is always unlocked
        },
        {
          difficulty: 'medium',
          ticketId: stage2Ticket._id,
          order: 2,
          unlocked: false,
        },
        {
          difficulty: 'hard',
          ticketId: stage3Ticket._id,
          order: 3,
          unlocked: false,
        },
      ],
      
      badgeName: 'Monorepo Master',
      badgeDescription: 'Completed the ProjectNexus monorepo quest',
      badgePoints: 350,
      badgeColor: '#4ade80',
      
      estimatedTime: 125, // Total minutes
      tags: ['monorepo', 'architecture', 'build-tools', 'typescript'],
      
      techStack: ['Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'MongoDB'],
    });

    console.log('\n✅ ProjectNexus Quest created successfully!');
    console.log(`Quest ID: ${quest._id}`);
    console.log(`Stage 1 (Easy) Ticket ID: ${stage1Ticket._id}`);
    console.log(`Stage 2 (Medium) Ticket ID: ${stage2Ticket._id}`);
    console.log(`Stage 3 (Hard) Ticket ID: ${stage3Ticket._id}`);
    console.log('\n🎮 Ready to start the quest!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding ProjectNexus quest:', error);
    process.exit(1);
  }
}

seedProjectNexusQuest();
