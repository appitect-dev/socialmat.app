"use client";

import React, { useState } from "react";
import { ContentIdea, CaptionSuggestion } from "@/types";

export function ContentGenerator() {
  const [activeTab, setActiveTab] = useState<"ideas" | "captions">("ideas");
  const [category, setCategory] = useState<string>("trending");
  const [tone, setTone] = useState<string>("casual");
  const [isGenerating, setIsGenerating] = useState(false);

  const [ideas, setIdeas] = useState<ContentIdea[]>([
    {
      id: "1",
      title: "Day in My Life as a Content Creator",
      description:
        "Show your authentic daily routine with behind-the-scenes content",
      hashtags: [
        "#dayinmylife",
        "#contentcreator",
        "#morning",
        "#routine",
        "#authentic",
      ],
      category: "lifestyle",
      difficulty: "easy",
      estimatedViews: "50K - 200K",
      tips: [
        "Film in good lighting",
        "Add trending music",
        "Keep it authentic",
      ],
    },
    {
      id: "2",
      title: "3 Things I Wish I Knew at 20",
      description: "Share valuable life lessons in a quick, engaging format",
      hashtags: ["#lifelessons", "#advice", "#wisdom", "#growth", "#mindset"],
      category: "educational",
      difficulty: "medium",
      estimatedViews: "100K - 500K",
      tips: [
        "Use text overlays",
        "Keep lessons relatable",
        "Add personal stories",
      ],
    },
    {
      id: "3",
      title: "Recreating Viral TikTok Recipes",
      description: "Put your own spin on trending food content",
      hashtags: ["#recipe", "#cooking", "#foodie", "#viral", "#trending"],
      category: "trending",
      difficulty: "medium",
      estimatedViews: "200K - 1M",
      tips: [
        "Film close-ups",
        "Add satisfying sounds",
        "Show the final result",
      ],
    },
  ]);

  const [captions, setCaptions] = useState<CaptionSuggestion[]>([
    {
      id: "1",
      text: "POV: You finally found your passion and everything clicks ✨ What moment made everything make sense for you?",
      tone: "inspirational",
      hashtags: ["#passion", "#motivation", "#success", "#journey", "#mindset"],
      callToAction: "Share your story in the comments!",
      emojis: ["✨", "💫", "🎯"],
    },
    {
      id: "2",
      text: "This is your sign to start that project you've been thinking about for months 👀 What's stopping you?",
      tone: "casual",
      hashtags: ["#motivation", "#projects", "#goals", "#action", "#mindset"],
      callToAction: "Drop what you're working on below!",
      emojis: ["👀", "💪", "🚀"],
    },
    {
      id: "3",
      text: "Behind the scenes of creating content that actually connects with people. It's messier than you think! 😅",
      tone: "funny",
      hashtags: [
        "#behindthescenes",
        "#contentcreator",
        "#reality",
        "#authentic",
        "#creative",
      ],
      callToAction: "What's your creative process like?",
      emojis: ["😅", "🎬", "✨"],
    },
  ]);

  const generateNewContent = async () => {
    setIsGenerating(true);
    try {
      if (activeTab === 'ideas') {
        const response = await fetch('/api/generate-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category })
        });
        const data = await response.json();
        if (data.success) {
          setIdeas(data.ideas);
        }
      } else {
        const response = await fetch('/api/generate-captions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tone })
        });
        const data = await response.json();
        if (data.success) {
          setCaptions(data.captions);
        }
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Content Generator
          </h2>
          <button
            onClick={generateNewContent}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "🪄 Generate New"}
          </button>
        </div>

        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(["ideas", "captions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "ideas" ? "Video Ideas" : "Caption Ideas"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "ideas" && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="trending">Trending</option>
                <option value="educational">Educational</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            <div className="space-y-4">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "captions" && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="funny">Funny</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div className="space-y-4">
              {captions.map((caption) => (
                <CaptionCard key={caption.id} caption={caption} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IdeaCard({ idea }: { idea: ContentIdea }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{idea.title}</h3>
          <p className="text-sm text-gray-600">{idea.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              idea.difficulty === "easy"
                ? "bg-green-100 text-green-800"
                : idea.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {idea.difficulty}
          </span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
            {idea.category}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500 mb-1">
          Estimated Views:{" "}
          <span className="font-medium">{idea.estimatedViews}</span>
        </p>
        <div className="flex flex-wrap gap-1">
          {idea.hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-xs font-medium text-gray-700 mb-2">💡 Pro Tips:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          {idea.tips.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>

      <button className="mt-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm transition-colors">
        Use This Idea
      </button>
    </div>
  );
}

function CaptionCard({ caption }: { caption: CaptionSuggestion }) {
  const [copied, setCopied] = useState(false);

  const copyCaption = async () => {
    const fullText = `${caption.text}\n\n${caption.hashtags.join(" ")}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-2 py-1 text-xs rounded-full capitalize ${
            caption.tone === "casual"
              ? "bg-blue-100 text-blue-800"
              : caption.tone === "professional"
              ? "bg-gray-100 text-gray-800"
              : caption.tone === "funny"
              ? "bg-yellow-100 text-yellow-800"
              : caption.tone === "inspirational"
              ? "bg-purple-100 text-purple-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {caption.tone}
        </span>
        <button
          onClick={copyCaption}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {copied ? "Copied! ✓" : "Copy"}
        </button>
      </div>

      <p className="text-gray-900 mb-3 leading-relaxed">{caption.text}</p>

      <div className="mb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {caption.hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {caption.emojis.join(" ")} {caption.callToAction}
        </div>
      </div>

      <button
        onClick={copyCaption}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
      >
        {copied ? "Copied to Clipboard!" : "Copy Caption"}
      </button>
    </div>
  );
}
