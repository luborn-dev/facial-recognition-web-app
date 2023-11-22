import React, { useRef, useEffect } from "react";
import Modal from "react-modal";
import styles from "./webcam.module.scss";

// Style for the modal content
const modalContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  border: "none",
  padding: "20px",
  borderRadius: "10px",
  outline: "none",
};

const WebcamModal = ({ isOpen, onRequestClose, onCapture }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (isOpen) {
      openCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const closeCamera = () => {
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      onCapture(blob);
    }, "image/jpeg");

    closeCamera();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Webcam Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          ...modalContentStyle,
        },
      }}
    >
      <video
        className={styles.webcam}
        ref={videoRef}
        autoPlay
        playsInline
      ></video>
      <div style={{ marginTop: "15px", display: "flex", gap: "4rem" }}>
        <button onClick={capturePhoto} className={styles.captureButton}>
          Tirar foto
        </button>
        <button onClick={onRequestClose} className={styles.closeButton}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default WebcamModal;
