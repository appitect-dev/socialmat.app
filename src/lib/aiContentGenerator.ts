export interface TrendingTopic {
  keyword: string;
  volume: number;
  difficulty: 'low' | 'medium' | 'high';
  category: string;
}

export interface ContentTemplate {
  format: string;
  hook: string;
  structure: string[];
  cta: string;
  estimatedViews: string;
}

export class AIContentGenerator {
  private trendingTopics: TrendingTopic[] = [
    { keyword: 'morning routine', volume: 85000, difficulty: 'low', category: 'lifestyle' },
    { keyword: 'productivity hacks', volume: 120000, difficulty: 'medium', category: 'educational' },
    { keyword: 'day in my life', volume: 200000, difficulty: 'high', category: 'lifestyle' },
    { keyword: 'cooking shortcuts', volume: 95000, difficulty: 'low', category: 'lifestyle' },
    { keyword: 'money tips', volume: 150000, difficulty: 'medium', category: 'educational' },
    { keyword: 'workout routine', volume: 110000, difficulty: 'medium', category: 'health' },
    { keyword: 'travel hacks', volume: 85000, difficulty: 'low', category: 'travel' },
    { keyword: 'relationship advice', volume: 75000, difficulty: 'high', category: 'lifestyle' }
  ];

  private contentTemplates: Record<string, ContentTemplate[]> = {
    'educational': [
      {
        format: '3 Things I Wish I Knew About {topic}',
        hook: 'If you\'re struggling with {topic}, this will change everything',
        structure: ['Hook + problem', 'Tip 1 with example', 'Tip 2 with story', 'Tip 3 with proof', 'Summary + CTA'],
        cta: 'Save this for later and follow for more {category} tips!',
        estimatedViews: '50K - 200K'
      },
      {
        format: 'The {topic} Mistake Everyone Makes',
        hook: 'Stop doing this with {topic} - it\'s costing you everything',
        structure: ['Common mistake reveal', 'Why it\'s wrong', 'Better approach', 'Real example', 'Action step'],
        cta: 'Comment "YES" if you\'ve made this mistake too!',
        estimatedViews: '75K - 300K'
      }
    ],
    'lifestyle': [
      {
        format: 'Day in My Life: {topic} Edition',
        hook: 'Come with me for a realistic day focused on {topic}',
        structure: ['Morning setup', 'Key activities', 'Challenges faced', 'Wins achieved', 'Evening reflection'],
        cta: 'What does your {topic} routine look like?',
        estimatedViews: '100K - 500K'
      },
      {
        format: '{topic} Transformation in 30 Days',
        hook: 'Here\'s how {topic} completely changed my life in a month',
        structure: ['Before situation', 'The decision', 'Week 1-2 changes', 'Week 3-4 results', 'Current state'],
        cta: 'Ready to start your {topic} journey? Comment below!',
        estimatedViews: '80K - 400K'
      }
    ]
  };

  generateVideoIdeas(category: string, count: number = 3): any[] {
    const relevantTopics = this.trendingTopics.filter(
      topic => topic.category === category || category === 'trending'
    );

    const templates = this.contentTemplates[category] || this.contentTemplates['lifestyle'];
    
    return Array.from({ length: count }, (_, index) => {
      const topic = relevantTopics[index % relevantTopics.length];
      const template = templates[index % templates.length];
      
      return {
        id: `ai_${Date.now()}_${index}`,
        title: template.format.replace('{topic}', topic.keyword),
        description: this.generateDescription(topic.keyword, template),
        hashtags: this.generateHashtags(topic.keyword, category),
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedViews: template.estimatedViews,
        tips: this.generateTips(topic.keyword, template.structure),
        hook: template.hook.replace('{topic}', topic.keyword),
        structure: template.structure,
        cta: template.cta.replace('{topic}', topic.keyword).replace('{category}', category),
        trendingScore: topic.volume / 1000
      };
    });
  }

  generateCaptions(tone: string, topic?: string, count: number = 3): any[] {
    const toneTemplates = {
      casual: [
        'POV: You finally figured out {topic} and your life makes sense now ✨',
        'Not me spending 3 hours on {topic} and actually enjoying it 😅',
        'Tell me you relate to this {topic} struggle without telling me 👀'
      ],
      professional: [
        'Here are 3 evidence-based strategies for {topic} that actually work:',
        'The psychology behind {topic}: what research tells us',
        'Industry insights: How top performers approach {topic}'
      ],
      inspirational: [
        'Your {topic} journey doesn\'t have to look like everyone else\'s ✨',
        'Remember: every expert was once a beginner at {topic} 💪',
        'The version of you that masters {topic} is already within you 🌟'
      ],
      funny: [
        'Me: I\'ll be productive with {topic} today\nAlso me: *chaos ensues* 😂',
        'Why does {topic} sound so easy in theory but feel impossible in practice? 🤡',
        'POV: You\'re giving {topic} advice but can\'t follow it yourself 💀'
      ],
      educational: [
        '3 research-backed facts about {topic} that will change how you think:',
        'The science of {topic}: What happens in your brain when you...',
        'Common {topic} myths debunked by actual data:'
      ]
    };

    const selectedTopic = topic || this.getRandomTopic();
    const templates = toneTemplates[tone as keyof typeof toneTemplates] || toneTemplates.casual;

    return templates.slice(0, count).map((template, index) => ({
      id: `caption_${Date.now()}_${index}`,
      text: template.replace(/{topic}/g, selectedTopic),
      tone,
      hashtags: this.generateHashtags(selectedTopic, tone),
      callToAction: this.generateCTA(tone),
      emojis: this.getEmojisForTone(tone),
      engagementScore: this.calculateEngagementScore(tone, selectedTopic)
    }));
  }

  private generateDescription(topic: string, template: ContentTemplate): string {
    return `Learn the most effective approach to ${topic}. ${template.hook.replace('{topic}', topic)} This video breaks down exactly what works and what doesn't.`;
  }

  private generateHashtags(topic: string, category: string): string[] {
    const baseHashtags = [`#${topic.replace(' ', '')}`, `#${category}`, '#contentcreator', '#viral'];
    const categoryHashtags = {
      lifestyle: ['#dailyroutine', '#selfcare', '#mindfulness'],
      educational: ['#learnsomething', '#knowledge', '#growthmindset'],
      health: ['#wellness', '#fitness', '#mentalhealth'],
      business: ['#entrepreneur', '#productivity', '#success']
    };

    return [...baseHashtags, ...(categoryHashtags[category as keyof typeof categoryHashtags] || [])];
  }

  private generateTips(topic: string, structure: string[]): string[] {
    return [
      `Focus on authenticity when sharing ${topic} content`,
      'Use trending audio to increase reach',
      `Add text overlays to make ${topic} more accessible`,
      'Keep your hook under 3 seconds',
      'End with a clear call-to-action'
    ];
  }

  private generateCTA(tone: string): string {
    const ctas = {
      casual: 'Drop a 💯 if you relate!',
      professional: 'Share your thoughts in the comments below.',
      inspirational: 'Tag someone who needs to see this! ✨',
      funny: 'Comment if this is literally you 😂',
      educational: 'Save this post for later reference!'
    };

    return ctas[tone as keyof typeof ctas] || 'Let me know what you think!';
  }

  private getEmojisForTone(tone: string): string[] {
    const emojiMap = {
      casual: ['✨', '💯', '👀', '😅'],
      professional: ['📈', '💼', '🎯', '📊'],
      inspirational: ['⚡', '🌟', '💪', '🚀'],
      funny: ['😂', '🤡', '💀', '😭'],
      educational: ['🧠', '📚', '💡', '🔬']
    };

    return emojiMap[tone as keyof typeof emojiMap] || ['✨', '💯', '👀'];
  }

  private calculateEngagementScore(tone: string, topic: string): number {
    const toneScores = { casual: 85, professional: 70, inspirational: 90, funny: 95, educational: 75 };
    const topicBonus = this.trendingTopics.find(t => t.keyword === topic)?.volume || 50000;
    
    return (toneScores[tone as keyof typeof toneScores] || 70) + (topicBonus / 10000);
  }

  private getRandomTopic(): string {
    return this.trendingTopics[Math.floor(Math.random() * this.trendingTopics.length)].keyword;
  }
}
