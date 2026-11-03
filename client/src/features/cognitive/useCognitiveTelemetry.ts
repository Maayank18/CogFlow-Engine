import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CognitiveInferenceResult,
  CognitiveState,
  CognitiveProbabilities,
} from '@cogflow/shared';
import { developmentMockProvider, SimulationScenario } from './DevelopmentMockProvider.js';
import { ExternalModelAdapter } from './ExternalModelAdapter.js';

export interface UseCognitiveTelemetryOptions {
  enableCameraDefault?: boolean;
  onInference?: (result: CognitiveInferenceResult) => void;
  sampleIntervalMs?: number;
}

export function useCognitiveTelemetry({
  enableCameraDefault = false,
  onInference,
  sampleIntervalMs = 2000,
}: UseCognitiveTelemetryOptions = {}) {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [providerMode, setProviderMode] = useState<'mock' | 'external'>('mock');
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('natural_flow');

  const [currentResult, setCurrentResult] = useState<CognitiveInferenceResult>({
    state: 'FLOW',
    confidence: 0.9,
    probabilities: { flow: 0.9, overload: 0.05, boredom: 0.05 },
    observedAt: new Date().toISOString(),
    source: 'mock',
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const externalAdapterRef = useRef<ExternalModelAdapter>(new ExternalModelAdapter());

  // Privacy-conscious behavioral telemetry metrics
  const behavioralRef = useRef({
    scrollCount: 0,
    mouseMovements: 0,
    lastInteractionTime: Date.now(),
  });

  // Passive behavioral listeners
  useEffect(() => {
    const handleScroll = () => {
      behavioralRef.current.scrollCount++;
      behavioralRef.current.lastInteractionTime = Date.now();
    };

    const handleMouseMove = () => {
      behavioralRef.current.mouseMovements++;
      behavioralRef.current.lastInteractionTime = Date.now();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Camera start with explicit user action
  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported on this device/browser.');
      }

      console.info('[CognitiveTelemetry] Requesting camera permission for on-device inference...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setIsCameraActive(true);
      setCameraPermission('granted');
      console.info('[CognitiveTelemetry] Camera active. ZERO frames are transmitted to remote servers.');
    } catch (err) {
      console.warn('[CognitiveTelemetry] Camera permission denied or device unavailable:', err);
      setCameraPermission('denied');
      setIsCameraActive(false);
    }
  }, []);

  // Camera stop with hardware release
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    console.info('[CognitiveTelemetry] Camera stopped and hardware resources released.');
  }, []);

  const toggleCamera = useCallback(() => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  // Clean up hardware on unmount
  useEffect(() => {
    if (enableCameraDefault) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [enableCameraDefault, startCamera, stopCamera]);

  // Inference sampling loop
  useEffect(() => {
    const interval = setInterval(async () => {
      // Dwell & interaction calculation
      const dwellSeconds = Math.round((Date.now() - behavioralRef.current.lastInteractionTime) / 1000);

      const input = {
        timestamp: Date.now(),
        fps: 15,
        behavioralSignals: {
          interactionFrequency: behavioralRef.current.mouseMovements,
          scrollCadence: behavioralRef.current.scrollCount,
          dwellTimeSec: dwellSeconds,
        },
      };

      // Reset counters for next interval
      behavioralRef.current.scrollCount = 0;
      behavioralRef.current.mouseMovements = 0;

      let result: CognitiveInferenceResult;
      if (providerMode === 'external') {
        result = await externalAdapterRef.current.infer(input);
      } else {
        result = await developmentMockProvider.infer(input);
      }

      setCurrentResult(result);
      if (onInference) {
        onInference(result);
      }
    }, sampleIntervalMs);

    return () => clearInterval(interval);
  }, [providerMode, sampleIntervalMs, onInference]);

  const changeScenario = (scenario: SimulationScenario) => {
    setSimulationScenario(scenario);
    developmentMockProvider.setScenario(scenario);
  };

  return {
    videoRef,
    isCameraActive,
    cameraPermission,
    toggleCamera,
    startCamera,
    stopCamera,
    currentResult,
    providerMode,
    setProviderMode,
    simulationScenario,
    setSimulationScenario: changeScenario,
  };
}

