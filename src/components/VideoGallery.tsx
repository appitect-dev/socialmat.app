"use client";

import React from 'react';
import { VideoProject } from '@/types';

interface VideoGalleryProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
}

export function VideoGallery({ projects, onSelectProject }: VideoGalleryProps) {
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (completedProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            🎬
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Videos</h3>
        <p className="text-gray-600">Complete your first video project to see it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Video Gallery</h2>
        <p className="text-sm text-gray-600 mt-1">{completedProjects.length} completed videos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {completedProjects.map((project) => (
          <VideoCard
            key={project.id}
            project={project}
            onSelect={() => onSelectProject(project)}
          />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ project, onSelect }: {
  project: VideoProject;
  onSelect: () => void;
}) {
  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden relative mb-3">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
              ▶️
            </div>
            <p className="text-sm opacity-80">AI Processed</p>
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
            View & Edit
          </button>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {Math.round(project.duration)}s
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{project.width}x{project.height}</span>
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="mt-2 flex items-center space-x-2">
          {project.settings.subtitles.enabled && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Subtitles</span>
          )}
          {project.settings.animations.enabled && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Animations</span>
          )}
          {project.settings.soundEffects.enabled && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Audio</span>
          )}
        </div>
      </div>
    </div>
  );
}
