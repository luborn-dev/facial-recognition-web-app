import React, { useState } from "react";
import styles from "./hero.module.scss";
import { Spin } from "antd";
import { LoadingOutlined, StopOutlined } from "@ant-design/icons";
import { CheckOutlined } from "@ant-design/icons";
import { Result } from "antd";
import WebcamModal from "../WebcamModal";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const capturePhoto = (blob) => {
    submitPhoto(blob);
  };

  const submitPhoto = async (file) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://0.0.0.0:3009/api/processar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.mensagem === "Sucesso") {
        setResult(data);
      }
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  const antIcon = (
    <LoadingOutlined
      label="Loading"
      style={{
        color: "#700808",
        fontSize: 96,
      }}
      spin
    />
  );

  return (
    <div className={styles.heroContainer}>
      <h2>ENVIE SUA FOTO PARA QUE POSSAMOS TE IDENTIFICAR</h2>
      <div>
        <button onClick={openCamera} className={styles.customUpload}>
          Abrir Câmera
        </button>
      </div>

      {result &&
        (result.mensagem === "Sucesso" ? (
          <Result
            icon={<CheckOutlined style={{ color: "#700808" }} />}
            title={`Acesso liberado para ${result.pessoa_prevista}`}
          />
        ) : (
          <Result
            icon={<StopOutlined style={{ color: "#700808" }} />}
            title="Acesso bloqueado"
          />
        ))}

      <WebcamModal
        isOpen={isCameraOpen}
        onRequestClose={closeCamera}
        onCapture={capturePhoto}
      />

      {isLoading ? (
        <Spin
          style={{
            width: "100%",
            marginLeft: "0 auto",
          }}
          indicator={antIcon}
        />
      ) : null}
    </div>
  );
};

export default Hero;
