'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentData } from '@/lib/types';
import { formatNumber, formatDate } from '@/lib/parsers/metaParser';
import { ExternalLink, Heart, MessageCircle, Share2, Bookmark, Eye } from 'lucide-react';

interface ContentTableProps {
  title: string;
  emoji: string;
  data: ContentData[];
  color: string;
}

export function ContentTable({ title, emoji, data, color }: ContentTableProps) {
  if (data.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{emoji} {title}</h2>
        <p className="text-sm text-muted-foreground">
          {data.length} publicaciones
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alcance</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.reduce((sum, post) => sum + post.reach, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Me Gusta</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.reduce((sum, post) => sum + post.likes, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comentarios</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.reduce((sum, post) => sum + post.comments, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compartidos</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.reduce((sum, post) => sum + post.shares, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Publicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((post, index) => (
              <div
                key={post.id}
                className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.postType}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.description}
                      </p>
                    )}
                  </div>
                  {post.permalink && (
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      Ver <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatNumber(post.reach)}</span>
                    <span className="text-muted-foreground">alcance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatNumber(post.comments)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatNumber(post.shares)}</span>
                  </div>
                  {post.saves !== undefined && post.saves > 0 && (
                    <div className="flex items-center gap-1">
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatNumber(post.saves)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}