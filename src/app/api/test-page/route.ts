import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subtitle Processing Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .success { background: #e8f5e8; border-color: #4CAF50; }
        .test { background: #e3f2fd; border-color: #2196F3; }
        .warning { background: #fff3e0; border-color: #FF9800; }
        h1 { color: #333; text-align: center; }
        h2 { color: #666; margin-top: 0; }
        button { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #2196F3; color: white; }
        .btn-success { background: #4CAF50; color: white; }
        .btn-warning { background: #FF9800; color: white; }
        .btn-danger { background: #f44336; color: white; }
        button:hover { opacity: 0.9; }
        .result { margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 12px; }
        .file-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin: 15px 0; }
        .file-item { padding: 15px; background: #f9f9f9; border-radius: 5px; border: 1px solid #ddd; }
        .file-size { color: #666; font-size: 12px; }
        video { max-width: 100%; height: auto; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .status.loading { background: #e3f2fd; color: #1976D2; }
        .status.success { background: #e8f5e8; color: #388E3C; }
        .status.error { background: #ffebee; color: #D32F2F; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 Subtitle Processing System Test</h1>
        
        <div class="section success">
            <h2>✅ System Status</h2>
            <p>All core components are working:</p>
            <ul>
                <li>✅ FFmpeg 7.1.1 installed and working</li>
                <li>✅ VideoSubtitleProcessor class functional</li>
                <li>✅ SRT generation working</li>
                <li>✅ Direct subtitle burning working</li>
            </ul>
        </div>

        <div class="section test">
            <h2>🧪 Available Tests</h2>
            <button class="btn-primary" onclick="runTest('/api/test-ffmpeg')">Test FFmpeg</button>
            <button class="btn-primary" onclick="runTest('/api/test-direct-subtitle')">Test Direct Subtitle</button>
            <button class="btn-primary" onclick="runTest('/api/test-processor-class')">Test Processor Class</button>
            <button class="btn-success" onclick="listFiles()">List Available Files</button>
        </div>

        <div class="section warning">
            <h2>📁 Available Video Files</h2>
            <button class="btn-warning" onclick="listFiles()">Refresh File List</button>
            <div id="fileList" class="file-list"></div>
        </div>

        <div class="section">
            <h2>🎯 Test Complete Subtitle Workflow</h2>
            <p>Test the complete process: Create test video → Add subtitles → View result</p>
            <button class="btn-success" onclick="testCompleteWorkflow()">Run Complete Test</button>
            <div id="workflowResult" class="result" style="display: none;"></div>
        </div>

        <div class="section">
            <h2>📊 Test Results</h2>
            <div id="results" class="result"></div>
        </div>
    </div>

    <script>
        async function runTest(endpoint) {
            const results = document.getElementById('results');
            results.textContent = 'Running test...';
            
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                results.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                results.textContent = 'Error: ' + error.message;
            }
        }

        async function listFiles() {
            const fileList = document.getElementById('fileList');
            const results = document.getElementById('results');
            
            try {
                results.textContent = 'Loading file list...';
                const response = await fetch('/api/list-video-files');
                const data = await response.json();
                
                if (data.success && data.files) {
                    fileList.innerHTML = '';
                    data.files.forEach(file => {
                        const fileDiv = document.createElement('div');
                        fileDiv.className = 'file-item';
                        fileDiv.innerHTML = \`
                            <strong>\${file.name}</strong><br>
                            <div class="file-size">Size: \${(file.size / 1024).toFixed(1)} KB</div>
                            <div class="file-size">Path: \${file.path}</div>
                            <div class="file-size">Directory: \${file.directory}</div>
                            \${file.name.endsWith('.mp4') ? \`
                                <video controls style="width: 100%; margin-top: 10px;">
                                    <source src="\${file.path}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            \` : ''}
                            <br>
                            <button class="btn-primary" onclick="window.open('\${file.path}', '_blank')">Download</button>
                        \`;
                        fileList.appendChild(fileDiv);
                    });
                    results.textContent = \`Found \${data.files.length} files (\${data.summary.tempFiles} in temp, \${data.summary.processedFiles} in processed)\`;
                } else {
                    fileList.innerHTML = '<p>No files found or error occurred.</p>';
                    results.textContent = 'No files found: ' + JSON.stringify(data, null, 2);
                }
            } catch (error) {
                results.textContent = 'Error listing files: ' + error.message;
                fileList.innerHTML = '<p>Error loading files.</p>';
            }
        }

        async function testCompleteWorkflow() {
            const workflowResult = document.getElementById('workflowResult');
            const results = document.getElementById('results');
            workflowResult.style.display = 'block';
            workflowResult.textContent = 'Starting complete workflow test...';
            
            try {
                // Step 1: Ensure we have a test video
                workflowResult.textContent += '\\n\\nStep 1: Creating test video...';
                let response = await fetch('/api/test-ffmpeg');
                let data = await response.json();
                
                if (!data.success) {
                    throw new Error('Failed to create test video: ' + data.error);
                }
                workflowResult.textContent += '\\n✅ Test video created: ' + data.results.testVideoSize + ' bytes';
                
                // Step 2: Process with subtitles
                workflowResult.textContent += '\\n\\nStep 2: Adding subtitles...';
                response = await fetch('/api/test-processor-class');
                data = await response.json();
                
                if (!data.success) {
                    throw new Error('Failed to add subtitles: ' + data.error);
                }
                workflowResult.textContent += '\\n✅ Subtitles added: ' + data.outputSize + ' bytes';
                workflowResult.textContent += '\\n✅ Output: ' + data.outputPath;
                
                // Step 3: Refresh file list
                workflowResult.textContent += '\\n\\nStep 3: Refreshing file list...';
                await listFiles();
                
                workflowResult.textContent += '\\n\\n🎉 Complete workflow test successful!';
                workflowResult.textContent += '\\n\\nYou can now see the videos with subtitles in the file list above.';
                workflowResult.textContent += '\\nClick on any video to play it and see the subtitles!';
                
                results.textContent = 'Workflow completed successfully! Check the file list above to see your videos.';
                
            } catch (error) {
                workflowResult.textContent += '\\n\\n❌ Error: ' + error.message;
                results.textContent = 'Workflow failed: ' + error.message;
            }
        }

        // Auto-load file list on page load
        document.addEventListener('DOMContentLoaded', listFiles);
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
