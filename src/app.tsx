import React, { useEffect, useRef, useState } from "react";
import OpenAI, { toFile } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Wouldn't normally do it this way in production, this is just an example.
});

export function App() {

    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
    const audioChunksRef = useRef<Blob[] | undefined>(undefined);
    const [transcribedText, setTranscribedText] = useState("<transcribed audio will go here>");

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
                    const audioBlob = new Blob(audioChunks, { type: audioChunks[0].type });

                    // Convert audio to a Open AI "file" object.
                    return toFile(audioBlob, "audio.webm")
                        .then(file => {
                            // Transcribe the audio file.
                            openai.audio.transcriptions.create({
                                    model: "whisper-1",
                                    response_format: "json",
                                    file,
                                })
                                .then(response => {
                                    setTranscribedText(response.text);
                                })
                                .catch(error => {
                                    console.error(`Failed to transcribe audio.`);
                                    console.error(error);
                                });
                        });
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

            <p>{transcribedText}</p>
        </div>
    );
}