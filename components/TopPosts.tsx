'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentData } from '@/lib/types';
import { formatNumber, formatDate } from '@/lib/parsers/metaParser';
import { Trophy, Heart, MessageCircle, Eye, TrendingUp, ExternalLink } from 'lucide-react';

interface TopPostsProps {
  instagramPosts?: ContentData[];
  facebookPosts?: ContentData[];
}

export function TopPosts({ instagramPosts = [], facebookPosts = [] }: TopPostsProps) {
  const allPosts = [
    ...instagramPosts.map(post => ({ ...post, platform: 'Instagram' as const, emoji: '📸' })),
    ...facebookPosts.map(post => ({ ...post, platform: 'Facebook' as const, emoji: '👍' })),
  ];

  if (allPosts.length === 0) {
    return null;
  }

  // Calculate engagement for each post
  const postsWithEngagement = allPosts.map(post => ({
    ...post,
    engagement: post.likes + post.comments + post.shares,
    engagementRate: post.reach > 0 ? ((post.likes + post.comments + post.shares) / post.reach * 100) : 0,
  }));

  // Top by Reach
  const topByReach = [...postsWithEngagement]
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 5);

  // Top by Engagement (interactions)
  const topByEngagement = [...postsWithEngagement]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  // Top by Engagement Rate
  const topByEngagementRate = [...postsWithEngagement]
    .filter(post => post.reach > 0)
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5);

  const renderPost = (post: any, index: number, metric: string) => (
    <div
      key={`${post.platform}-${post.id}-${index}`}
      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
          {index + 1}
        </div>
        {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">{post.emoji}</span>
          <Badge variant="outline">{post.platform}</Badge>
          <Badge variant="secondary">{post.postType}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(post.date)}
          </span>
        </div>
        
        {post.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(post.reach)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(post.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(post.comments)}</span>
          </div>
          {metric === 'engagementRate' && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">
                {post.engagementRate.toFixed(2)}%
              </span>
            </div>
          )}
          {post.permalink && (
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1 ml-auto"
            >
              Ver <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">🏆 Top Posts</h2>
        <p className="text-muted-foreground">
          Tus publicaciones con mejor desempeño
        </p>
      </div>

      {/* Top by Reach */}
      {topByReach.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Top 5 por Alcance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topByReach.map((post, index) => renderPost(post, index, 'reach'))}
          </CardContent>
        </Card>
      )}

      {/* Top by Engagement */}
      {topByEngagement.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Top 5 por Interacciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topByEngagement.map((post, index) => renderPost(post, index, 'engagement'))}
          </CardContent>
        </Card>
      )}

      {/* Top by Engagement Rate */}
      {topByEngagementRate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top 5 por Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topByEngagementRate.map((post, index) => renderPost(post, index, 'engagementRate'))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}