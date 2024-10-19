// src/EmotionDetection.js
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const EmotionDetection = () => {
  const videoRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [emotion, setEmotion] = useState('No Emotion Detected');

  // Load Face API models
  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    setInitialized(true);
  };

  // Start the video stream
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error('Error accessing camera: ', err));
  };

  // Detect emotion from video stream
  const detectEmotion = async () => {
    if (videoRef.current) {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection && detection.expressions) {
        const maxExpression = Object.entries(detection.expressions).reduce(
          (prev, curr) => (prev[1] > curr[1] ? prev : curr)
        );
        setEmotion(maxExpression[0]);
      }
    }
  };

  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  useEffect(() => {
    if (initialized) {
      const interval = setInterval(detectEmotion, 500);
      return () => clearInterval(interval);
    }
  }, [initialized]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Emotion Detection App</h1>
      <video ref={videoRef} autoPlay muted style={{ width: '720px', height: '540px' }} />
      <h2>Detected Emotion: {emotion}</h2>
    </div>
  );
};

export default EmotionDetection;
