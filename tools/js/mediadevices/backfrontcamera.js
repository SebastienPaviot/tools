<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Camera Stream</title>
    <style>
        #video {
            width: 100%;
            max-width: 600px;
            height: auto;
            border: 1px solid #000;
        }
        #controls {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>Select Camera and Stream Video</h1>

    <div>
        <label for="cameraSelect">Choose camera:</label>
        <select id="cameraSelect">
            <option value="user">Front Camera (User)</option>
            <option value="environment">Rear Camera (Environment)</option>
        </select>
    </div>

    <div id="controls">
        <button id="playButton">Play</button>
        <button id="stopButton">Stop</button>
    </div>

    <video id="video" autoplay playsinline></video>

    <script>
        const videoElement = document.getElementById('video');
        const playButton = document.getElementById('playButton');
        const stopButton = document.getElementById('stopButton');
        const cameraSelect = document.getElementById('cameraSelect');
        let stream;

        // Function to start the video stream
        async function startStream() {
            const selectedCamera = cameraSelect.value;
            const constraints = {
                video: {
                    facingMode: selectedCamera  // 'user' or 'environment'
                }
            };
            try {
                // Stop any existing stream before starting a new one
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                videoElement.srcObject = stream;
            } catch (err) {
                console.error('Error accessing the camera: ', err);
            }
        }

        // Stop the video stream
        function stopStream() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                videoElement.srcObject = null;
            }
        }

        // Event listeners for play and stop buttons
        playButton.addEventListener('click', startStream);
        stopButton.addEventListener('click', stopStream);
    </script>
</body>
</html>
