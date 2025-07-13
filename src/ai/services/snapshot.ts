'use server';

import fetch from 'node-fetch';

const SNAPSHOT_API_URL = 'https://hub.snapshot.org/graphql';

export async function getProposalInfo(proposalId: string) {
  const query = `
    query Proposal($id: String!) {
      proposal(id: $id) {
        id
        title
        body
        start
        end
        state
        author
        votes
        choices
        scores
        scores_total
        space {
          id
          name
          symbol
        }
      }
    }
  `;

  try {
    const response = await fetch(SNAPSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id: proposalId },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from Snapshot: ${response.statusText}`);
    }

    const data: any = await response.json();

    if (data.errors) {
        throw new Error(`GraphQL error from Snapshot: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }
    
    if (!data.data.proposal) {
        return {
            error: `Proposal with ID "${proposalId}" not found on Snapshot.`
        };
    }
    
    const proposal = data.data.proposal;

    return {
        id: proposal.id,
        title: proposal.title,
        state: proposal.state,
        space: proposal.space.name,
        totalVotes: proposal.votes,
        totalScore: proposal.scores_total,
        startDate: new Date(proposal.start * 1000).toISOString(),
        endDate: new Date(proposal.end * 1000).toISOString(),
        results: proposal.choices.map((choice: string, index: number) => ({
            choice: choice,
            score: proposal.scores[index]
        }))
    };
  } catch (error: any) {
    console.error("Error fetching from Snapshot:", error);
    return {
      error: error.message || `An unknown error occurred while fetching proposal ${proposalId}.`
    };
  }
}
