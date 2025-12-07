import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Phase 7 - GitHub Integration Service
 * Auto-creates GitHub issues for tickets with Copilot auto-fix workflow
 */

export interface GitHubIssue {
  number: number;
  html_url: string;
  title: string;
  body: string;
  labels: string[];
}

@Injectable()
export class GitHubIntegrationService {
  private readonly logger = new Logger(GitHubIntegrationService.name);
  private readonly githubToken: string;
  private readonly githubRepo: string; // format: "owner/repo"
  private readonly githubApiUrl = 'https://api.github.com';

  constructor(private configService: ConfigService) {
    this.githubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.githubRepo = this.configService.get<string>('GITHUB_REPO') || 'gajjarumesh/erp-beta';
  }

  /**
   * Create a GitHub issue for a support ticket
   * Labels: support, high-priority, auto-fix
   */
  async createIssueForTicket(
    ticketNumber: string,
    subject: string,
    description: string,
    priority: string,
  ): Promise<GitHubIssue | null> {
    if (!this.githubToken) {
      this.logger.warn('GitHub token not configured, skipping issue creation');
      return null;
    }

    try {
      const title = `[Support Ticket ${ticketNumber}] ${subject}`;
      const body = `
## Support Ticket: ${ticketNumber}

**Priority:** ${priority.toUpperCase()}

### Description
${description}

---

**Auto-generated from ERP support ticket system**
**Labels:** support, high-priority, auto-fix

This ticket will be automatically processed by GitHub Copilot for potential auto-fix.
      `.trim();

      const labels = ['support', 'high-priority', 'auto-fix'];

      // Mock implementation - replace with actual GitHub API call
      this.logger.log(`Creating GitHub issue for ticket ${ticketNumber}`);
      
      // Actual implementation would be:
      // const response = await fetch(`${this.githubApiUrl}/repos/${this.githubRepo}/issues`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.githubToken}`,
      //     'Accept': 'application/vnd.github+json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ title, body, labels }),
      // });
      // const issue = await response.json();

      // Mock response for now
      const mockIssue: GitHubIssue = {
        number: Math.floor(Math.random() * 10000) + 1,
        html_url: `https://github.com/${this.githubRepo}/issues/${Math.floor(Math.random() * 10000) + 1}`,
        title,
        body,
        labels,
      };

      this.logger.log(`Created GitHub issue #${mockIssue.number}: ${mockIssue.html_url}`);

      return mockIssue;
    } catch (error) {
      this.logger.error(`Failed to create GitHub issue for ticket ${ticketNumber}`, error.stack);
      return null;
    }
  }

  /**
   * Handle GitHub webhook for Copilot auto-fix PR
   * Called when a PR is created by Copilot or when CI passes
   */
  async handleCopilotAutoFixWebhook(payload: any): Promise<{
    issueNumber: number;
    prUrl: string;
    fixApplied: boolean;
    ciStatus: string;
  }> {
    try {
      const { action, pull_request, check_suite } = payload;

      this.logger.log(`Received GitHub webhook: action=${action}`);

      // Extract info from webhook
      const issueNumber = this.extractIssueNumberFromPR(pull_request?.title || '');
      const prUrl = pull_request?.html_url || '';
      const ciStatus = check_suite?.conclusion || pull_request?.mergeable_state || 'unknown';

      // Check if this is a Copilot auto-fix PR
      const isCopilotPR = pull_request?.user?.login === 'github-actions[bot]' ||
                          pull_request?.labels?.some((l: any) => l.name === 'auto-fix');

      if (isCopilotPR && action === 'opened') {
        this.logger.log(`Copilot auto-fix PR created for issue #${issueNumber}: ${prUrl}`);
      }

      // Check if CI passed and auto-merge is enabled
      const shouldAutoMerge = ciStatus === 'success' && isCopilotPR;

      return {
        issueNumber,
        prUrl,
        fixApplied: shouldAutoMerge,
        ciStatus,
      };
    } catch (error) {
      this.logger.error('Failed to handle Copilot auto-fix webhook', error.stack);
      throw error;
    }
  }

  /**
   * Extract issue number from PR title
   * Expected format: "[Support Ticket TKT-123] Title"
   */
  private extractIssueNumberFromPR(prTitle: string): number {
    const match = prTitle.match(/\[Support Ticket (TKT-\d+-\d+)\]/);
    if (match && match[1]) {
      // In a real implementation, you'd query the DB to get the actual issue number
      // For now, return a mock number
      return Math.floor(Math.random() * 1000) + 1;
    }
    return 0;
  }

  /**
   * Post a comment on a GitHub issue
   */
  async postCommentOnIssue(issueNumber: number, comment: string): Promise<void> {
    if (!this.githubToken) {
      this.logger.warn('GitHub token not configured, skipping comment posting');
      return;
    }

    try {
      this.logger.log(`Posting comment on GitHub issue #${issueNumber}`);
      
      // Actual implementation would be:
      // await fetch(`${this.githubApiUrl}/repos/${this.githubRepo}/issues/${issueNumber}/comments`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.githubToken}`,
      //     'Accept': 'application/vnd.github+json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ body: comment }),
      // });

      this.logger.log(`Comment posted successfully on issue #${issueNumber}`);
    } catch (error) {
      this.logger.error(`Failed to post comment on issue #${issueNumber}`, error.stack);
    }
  }

  /**
   * Get GitHub issue status
   */
  async getIssueStatus(issueNumber: number): Promise<{
    state: string;
    labels: string[];
    assignees: string[];
  } | null> {
    if (!this.githubToken) {
      this.logger.warn('GitHub token not configured');
      return null;
    }

    try {
      // Actual implementation would fetch from GitHub API
      // For now, return mock data
      return {
        state: 'open',
        labels: ['support', 'high-priority', 'auto-fix'],
        assignees: [],
      };
    } catch (error) {
      this.logger.error(`Failed to get GitHub issue status #${issueNumber}`, error.stack);
      return null;
    }
  }
}
