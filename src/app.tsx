import React, { useEffect, useRef, useState } from "react";

export function App() {

    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
    const audioChunksRef = useRef<Blob[] | undefined>(undefined);

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {

                // You now have access to the user's microphone through the `stream` object.

                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks: Blob[] = [];

                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    // Combine and process audioChunks as needed.
                    const audioBlob = new Blob(audioChunks, { type: audioChunks[0].type })

                    // Download the audio file (thanks ChatGPT).
                    const url = URL.createObjectURL(audioBlob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = 'audio-capture.webm'; // Set the desired filename for the downloaded file.
                    downloadLink.style.display = 'none'; // Hide the download link initially.
                    document.body.appendChild(downloadLink); // Append the link to the document.
                    downloadLink.click(); // Simulate a click on the link to trigger the download.
                    document.body.removeChild(downloadLink); // Remove the link from the document after the download.
                };

                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = audioChunks;
            })
            .catch(error => {
                // Handle any errors that occur when trying to access the microphone.
                console.error(`Failed to get it`);
                console.error(error);
            });

    }, []);

    useEffect(() => {

        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder) {
            return;
        }

        if (recording) {
            // Reset audio chunks.
            audioChunksRef.current = [];

            // Start recording
            mediaRecorder.start();
        }
        else {            
            // Stop recording.
            mediaRecorder.stop();
        }

    }, [recording]);

    return (
        <div>
            <h1>Audio capture example</h1>

            {!recording &&
                <button
                    onClick={() => setRecording(true)}
                    >
                    Start recording
                </button>
            }

            {recording &&
                <button
                    onClick={() => setRecording(false)}
                    >
                    Stop recording
                </button>
            }
        </div>
    );
}