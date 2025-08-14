"use client";

import React, { useState } from "react";
import { VideoProject } from "@/types";
import { VideoUploader } from "./VideoUploader";
import { VideoEditor } from "./VideoEditor";
import { ContentGenerator } from "./ContentGenerator";
import { Analytics } from "./Analytics";
import { VideoGallery } from "./VideoGallery";
import { SubtitleCustomizer } from "./SubtitleCustomizer";
import { useNotification } from "./NotificationProvider";
import { OpenAIStatusBanner } from "./OpenAIStatusBanner";
import { SubtitleProgressDialog } from "./SubtitleProgressDialog";

export function Dashboard() {
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"upload" | "editor" | "generator" | "gallery" | "subtitles">(
    "upload"
  );
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  
  // Subtitle generation progress state
  const [subtitleProgress, setSubtitleProgress] = useState<{
    isOpen: boolean;
    stage: 'extracting' | 'transcribing' | 'generating' | 'complete' | 'error';
    progress: number;
    message: string;
    error?: string;
  }>({
    isOpen: false,
    stage: 'extracting',
    progress: 0,
    message: '',
    error: undefined
  });

  const generateVideoId = () => {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleVideoUpload = async (file: File) => {
    setIsUploading(true);

    // Create video element to get duration and dimensions
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const newProject: VideoProject = {
        id: generateVideoId(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        originalFile: file,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "uploading",
        progress: 0,
        settings: {
          subtitles: {
            enabled: true,
            style: "modern",
            position: "bottom",
            fontSize: 16,
            color: "#ffffff",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            animation: "fade",
          },
          animations: {
            enabled: true,
            transitions: ["fade", "slide"],
            effects: ["zoom", "pan"],
            intensity: 5,
          },
          soundEffects: {
            enabled: true,
            backgroundMusic: true,
            musicVolume: 30,
            soundEffects: [],
          },
          filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            blur: 0,
            sharpen: 0,
          },
        },
      };

      setProjects((prev) => [...prev, newProject]);
      setCurrentProject(newProject);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setCurrentProject((prev) =>
            prev ? { ...prev, status: "completed", progress: 100 } : null
          );
          setIsUploading(false);
          
          addNotification({
            type: 'success',
            title: 'Video Uploaded!',
            message: `${file.name} uploaded successfully. Ready for AI enhancement.`
          });
        }
        setCurrentProject((prev) =>
          prev ? { ...prev, progress: Math.round(progress) } : null
        );
      }, 500);

      setActiveTab("editor");
      URL.revokeObjectURL(url);
    };

    video.src = url;
  };

  const updateProject = (updates: Partial<VideoProject>) => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        ...updates,
        updatedAt: new Date(),
      };
      setCurrentProject(updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? updatedProject : p))
      );
    }
  };

  const processVideo = async (project: VideoProject) => {
    try {
      const formData = new FormData();
      formData.append('video', project.originalFile);
      formData.append('settings', JSON.stringify(project.settings));

      updateProject({ status: 'processing', progress: 0 });

      // Simulate processing progress
      const progressInterval = setInterval(() => {
        updateProject({ 
          progress: Math.min((currentProject?.progress || 0) + Math.random() * 15, 95)
        });
      }, 500);

      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      clearInterval(progressInterval);

      if (result.success) {
        updateProject({ 
          status: 'completed', 
          progress: 100,
          outputUrl: result.result.outputUrl
        });
        
        addNotification({
          type: 'success',
          title: 'Video Processing Complete!',
          message: `${project.name} has been processed successfully with AI enhancements.`
        });
      } else {
        updateProject({ status: 'error', progress: 0 });
        addNotification({
          type: 'error',
          title: 'Processing Failed',
          message: `Failed to process ${project.name}. Please try again.`
        });
      }
    } catch (error) {
      console.error('Video processing failed:', error);
      updateProject({ status: 'error', progress: 0 });
      addNotification({
        type: 'error',
        title: 'Processing Error',
        message: 'An unexpected error occurred during video processing.'
      });
    }
  };

  const testTranscription = async (file: File) => {
    setSubtitleProgress({
      isOpen: true,
      stage: 'extracting',
      progress: 10,
      message: 'Extracting audio from video...',
      error: undefined
    });

    try {
      const formData = new FormData();
      formData.append('video', file);

      // Simulate progress updates
      const progressUpdates = [
        { stage: 'extracting' as const, progress: 30, message: 'Audio extraction complete...' },
        { stage: 'transcribing' as const, progress: 50, message: 'Sending to OpenAI Whisper...' },
        { stage: 'transcribing' as const, progress: 80, message: 'Transcription in progress...' },
        { stage: 'generating' as const, progress: 90, message: 'Generating subtitle files...' }
      ];

      // Update progress every 2 seconds
      let updateIndex = 0;
      const progressInterval = setInterval(() => {
        if (updateIndex < progressUpdates.length) {
          setSubtitleProgress(prev => ({
            ...prev,
            ...progressUpdates[updateIndex]
          }));
          updateIndex++;
        } else {
          clearInterval(progressInterval);
        }
      }, 2000);

      const response = await fetch('/api/test-transcription', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      clearInterval(progressInterval);

      if (result.success) {
        setSubtitleProgress({
          isOpen: true,
          stage: 'complete',
          progress: 100,
          message: 'Transcription completed successfully!',
          error: undefined
        });

        addNotification({
          type: 'success',
          title: 'Transcription Complete!',
          message: `Generated ${result.results.segmentCount} subtitle segments. Files saved to temp directory.`
        });

        console.log("📁 Transcription files saved:");
        console.log("📄 Text file:", result.results.textFile);
        console.log("📄 SRT file:", result.results.srtFile);
        console.log("🎬 Segments preview:", result.results.segments);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSubtitleProgress({
        isOpen: true,
        stage: 'error',
        progress: 0,
        message: 'Transcription failed',
        error: (error as Error).message
      });

      addNotification({
        type: 'error',
        title: 'Transcription Failed',
        message: 'Failed to transcribe video. Check console for details.'
      });
    }
  };

  const processVideoWithSubtitles = async (file: File) => {
    setSubtitleProgress({
      isOpen: true,
      stage: 'extracting',
      progress: 5,
      message: 'Uploading video...',
      error: undefined
    });

    try {
      // Step 0: Upload video to temp directory
      const uploadFormData = new FormData();
      uploadFormData.append('video', file);

      const uploadResponse = await fetch('/api/upload-temp-video', {
        method: 'POST',
        body: uploadFormData
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error('Failed to upload video');
      }

      // Step 1: Transcribe the video
      setSubtitleProgress(prev => ({
        ...prev,
        progress: 20,
        message: 'Transcribing audio with OpenAI Whisper...'
      }));

      const transcribeFormData = new FormData();
      transcribeFormData.append('video', file);

      const transcribeResponse = await fetch('/api/test-transcription', {
        method: 'POST',
        body: transcribeFormData
      });

      const transcribeResult = await transcribeResponse.json();

      if (!transcribeResult.success) {
        throw new Error(transcribeResult.error || 'Transcription failed');
      }

      // Step 2: Add subtitles to video
      setSubtitleProgress(prev => ({
        ...prev,
        stage: 'generating',
        progress: 60,
        message: 'Adding subtitles to video with FFmpeg...'
      }));

      const videoPath = uploadResult.filePath; // This is already relative like "/temp/video.mp4"
      const subtitleText = transcribeResult.results.textContent || 'Sample subtitle text for demonstration.';

      const subtitleResponse = await fetch('/api/add-subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoPath: videoPath,
          subtitleText: subtitleText,
          outputFilename: `${file.name.replace(/\.[^/.]+$/, '')}_with_subtitles.mp4`
        })
      });

      const subtitleResult = await subtitleResponse.json();

      if (!subtitleResult.success) {
        throw new Error(subtitleResult.details || 'Failed to add subtitles to video');
      }

      setSubtitleProgress({
        isOpen: true,
        stage: 'complete',
        progress: 100,
        message: 'Video with subtitles created successfully!',
        error: undefined
      });

      addNotification({
        type: 'success',
        title: 'Subtitles Added!',
        message: `Video processed successfully. Output saved to: ${subtitleResult.outputPath}`
      });

      console.log("🎬 Video with subtitles created:");
      console.log("📁 Output path:", subtitleResult.outputPath);
      console.log("📄 Transcript used:", subtitleText.substring(0, 100) + '...');

    } catch (error) {
      setSubtitleProgress({
        isOpen: true,
        stage: 'error',
        progress: 0,
        message: 'Subtitle processing failed',
        error: (error as Error).message
      });

      addNotification({
        type: 'error',
        title: 'Subtitle Processing Failed',
        message: 'Failed to add subtitles to video. Check console for details.'
      });
    }
  };

  const tabConfig = [
    {
      key: "upload" as const,
      label: "📤 Upload",
      description: "Upload and manage videos",
    },
    {
      key: "editor" as const,
      label: "✂️ Editor",
      description: "Edit with AI tools",
    },
    {
      key: "subtitles" as const,
      label: "🎨 Subtitles",
      description: "Customize subtitle styles",
    },
    {
      key: "generator" as const,
      label: "🎯 Ideas",
      description: "Generate content ideas",
    },
    {
      key: "gallery" as const,
      label: "🎬 Gallery",
      description: "View completed videos",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">SocialMat</h1>
              </div>
              <span className="text-sm text-gray-500">
                AI-Powered Content Creation
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                Upgrade Pro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200 mb-6">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-75 mt-1">{tab.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Analytics Dashboard */}
        <Analytics 
          projects={projects.length}
          totalViews={projects.length * 25000} // Mock estimated views
          videosProcessed={projects.filter(p => p.status === 'completed').length}
          savedHours={projects.length * 2} // Estimate 2 hours saved per video
        />

        {/* OpenAI Integration Status */}
        <OpenAIStatusBanner />

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === "upload" && (
            <div>
              <VideoUploader
                onVideoUpload={handleVideoUpload}
                isUploading={isUploading}
              />

              {/* Test Transcription Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  🧪 Test OpenAI Transcription
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Upload a video to test the OpenAI Whisper API transcription and see the generated subtitle files.
                  Results will be saved as both text and SRT files in the temp directory.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        testTranscription(file);
                      }
                    }}
                    className="text-sm text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <span className="text-xs text-blue-600">
                    Supports MP4, MOV, AVI, and other video formats
                  </span>
                </div>
              </div>

              {/* Test Complete Subtitle Processing Section */}
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🎬 Test Complete Subtitle Processing
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  Upload a video to test the complete workflow: transcription with OpenAI Whisper + adding subtitles to video with FFmpeg.
                  The final video with burned-in subtitles will be saved to the processed folder.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        processVideoWithSubtitles(file);
                      }
                    }}
                    className="text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  />
                  <span className="text-xs text-green-600">
                    Creates video with burned-in subtitles
                  </span>
                </div>
              </div>

              {projects.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={() => {
                          setCurrentProject(project);
                          setActiveTab("editor");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "editor" && currentProject && (
            <VideoEditor
              project={currentProject}
              onUpdateProject={updateProject}
              onProcessVideo={processVideo}
            />
          )}

          {activeTab === "editor" && !currentProject && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  ✂️
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Video Selected
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a video or select an existing project to start editing.
              </p>
              <button
                onClick={() => setActiveTab("upload")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Upload Video
              </button>
            </div>
          )}

          {activeTab === "generator" && <ContentGenerator />}
          
          {activeTab === "subtitles" && <SubtitleCustomizer currentProject={currentProject} />}
          
          {activeTab === "gallery" && (
            <VideoGallery 
              projects={projects}
              onSelectProject={(project) => {
                setCurrentProject(project);
                setActiveTab('editor');
              }}
            />
          )}
        </div>
      </div>

      {/* Subtitle Progress Dialog */}
      <SubtitleProgressDialog
        isOpen={subtitleProgress.isOpen}
        progress={subtitleProgress}
        onClose={() => setSubtitleProgress(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

function ProjectCard({
  project,
  onSelect,
}: {
  project: VideoProject;
  onSelect: () => void;
}) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <div className="text-gray-400">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            📹
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1 truncate">
        {project.name}
      </h4>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{Math.round(project.duration)}s</span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            project.status === "completed"
              ? "bg-green-100 text-green-800"
              : project.status === "processing"
              ? "bg-yellow-100 text-yellow-800"
              : project.status === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {project.status}
        </span>
      </div>
    </div>
  );
}
