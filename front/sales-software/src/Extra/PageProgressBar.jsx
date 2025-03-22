import React, { useEffect, useState } from "react";

const PageProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    const updateProgress = () => {
      let currentProgress = 0;
      interval = setInterval(() => {
        currentProgress += Math.random() * 20; // Moves faster
        if (currentProgress >= 90) {
          currentProgress = 90; // Stops at 90% until page fully loads
          clearInterval(interval);
        }
        setProgress(currentProgress);
      }, 150);
    };

    const completeProgress = () => {
      clearInterval(interval);
      setProgress(100); // Instantly completes when the page is loaded
      setTimeout(() => setProgress(0), 500); // Hides after completion
    };

    // Start when the page begins loading
    updateProgress();

    // Complete when the page fully loads
    window.addEventListener("load", completeProgress);

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", completeProgress);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",
      backgroundColor: "#04aa6d",
      zIndex: 9999,
    }}>
      <div style={{
        width: `${progress}%`,
        height: "100%",
        backgroundColor: "#007bff",
        transition: "width 0.2s ease-in-out",
      }} />
    </div>
  );
};

export default PageProgressBar;
