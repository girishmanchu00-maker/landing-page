import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { processComplianceUpdate } from '../../../../src/lib/langchain/complianceAgent.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Initialize RSS Parser with custom timeout and browser user-agent
    const parser = new Parser({
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Fintezy-Compliance-Bot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8'
      }
    });

    // 2. Target Tax Aggregator RSS Feed URL
    const RSS_FEED_URL = process.env.TAX_RSS_FEED_URL || 'https://taxguru.in/feed/';

    // 3. Fetch and parse feed
    let feed;
    try {
      feed = await parser.parseURL(RSS_FEED_URL);
    } catch (feedErr) {
      // Fallback to secondary tax feed if primary fails
      console.warn(`[RSS-Sync] Primary feed ${RSS_FEED_URL} failed, trying Cleartax fallback:`, feedErr.message);
      feed = await parser.parseURL('https://cleartax.in/s/feed');
    }

    if (!feed || !feed.items || feed.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new items discovered in RSS feed',
        updates: []
      });
    }

    // 4. Loop through the top 3 most recent items
    const recentItems = feed.items.slice(0, 3);
    const resultsArray = [];

    for (const item of recentItems) {
      const title = item.title || 'Untitled Regulatory Update';
      const snippet = item.contentSnippet || item.content || item.summary || '';
      const rawText = `${title} - ${snippet}`.trim();

      // 5. Pass into LangChain Compliance Agent
      const structuredIntelligence = await processComplianceUpdate(rawText, 'ARTICLE');

      resultsArray.push({
        guid: item.guid || item.link || title,
        sourceLink: item.link || '',
        publishedDate: item.pubDate || item.isoDate || new Date().toISOString(),
        rawTitle: title,
        ...structuredIntelligence
      });
    }

    // 6. Return aggregated structured response
    return NextResponse.json({
      success: true,
      feedTitle: feed.title || 'Tax Compliance Aggregator',
      totalProcessed: resultsArray.length,
      updates: resultsArray
    });

  } catch (error) {
    console.error('[RSS-Sync Engine Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync and process RSS feed'
      },
      { status: 500 }
    );
  }
}
