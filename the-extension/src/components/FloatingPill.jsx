import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Coffee, Timer } from "lucide-react";

export default function FloatingPill({
  timerState,
  onPause,
  onRestart,
  onClose,
}) {
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const pillRef = useRef(null);

  // Format time helper
  const formatTime = (ms) => {
    if (ms == null || ms < 0 || isNaN(ms)) return "00:00";
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Show break notification
  useEffect(() => {
    if (timerState.isBreakMode && timerState.completedSessions > 0) {
      const notif = document.createElement("div");
      notif.textContent = "Time for a break!";
      notif.style.cssText = `
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 999px;
        font-size: 1.1em; z-index: 999999; box-shadow: 0 2px 16px #0002;
        transition: opacity 0.3s; pointer-events: none;
      `;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 2500);
    }
  }, [timerState.isBreakMode, timerState.completedSessions]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!pillRef.current) return;
    setIsDragging(true);
    const rect = pillRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !pillRef.current) return;
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    // Keep within viewport bounds
    const maxX = window.innerWidth - pillRef.current.offsetWidth;
    const maxY = window.innerHeight - pillRef.current.offsetHeight;
    setPosition({
      x: Math.max(0, Math.min(maxX, x)),
      y: Math.max(0, Math.min(maxY, y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={pillRef}
      style={{
        // CSS reset to override any website styles
        all: "unset",
        boxSizing: "border-box",
        WebkitBoxSizing: "border-box",
        MozBoxSizing: "border-box",
        // Core positioning and z-index
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 2147483647, // Maximum z-index to ensure it's always on top
        // Visual styling
        background: "#ffffff",
        borderRadius: 999,
        boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 20px, rgba(0, 0, 0, 0.1) 0px 2px 10px",
        border: "2px solid #111111",
        color: "#111111",
        // Layout and spacing
        display: "flex",
        alignItems: "center",
        padding: "18px 32px",
        minWidth: 320,
        minHeight: 64,
        gap: 18,
        // Typography
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        // Interaction and performance
        userSelect: "none",
        pointerEvents: "auto", // Ensure it's always interactive
        isolation: "isolate", // Create new stacking context
        willChange: "transform", // Optimize for animations
        transition: isDragging ? "none" : "all 0.2s ease",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <span>
          {timerState.isBreakMode ? (
            <Coffee size={28} color="#111" />
          ) : (
            <Timer size={28} color="#111" />
          )}
        </span>
        <span style={{ fontSize: "1.1em", fontWeight: 600 }}>
          {timerState.isBreakMode ? "Break" : "Focus"}
        </span>
      </div>
      <span
        style={{
          fontVariantNumeric: "tabular-nums",
          fontWeight: "bold",
          fontSize: "2em",
          marginRight: 10,
          letterSpacing: "0.04em",
        }}
      >
        {formatTime(timerState.timeLeft)}
      </span>
      <span style={{ fontSize: "1em", color: "#444", marginRight: 10 }}>
        {timerState.completedSessions > 0
          ? `Session: ${timerState.completedSessions} started`
          : ""}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {timerState.isBreakMode ? (
          <button
            onClick={onRestart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <RotateCcw size={22} color="#111" />
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              {timerState.isRunning ? (
                <Pause size={22} color="#111" />
              ) : (
                <Play size={22} color="#111" />
              )}
            </button>
            <button
              onClick={onRestart}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <RotateCcw size={22} color="#111" />
            </button>
          </>
        )}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginLeft: 8,
          padding: 4,
        }}
      >
        <X size={22} color="#111" />
      </button>
    </div>
  );
}
