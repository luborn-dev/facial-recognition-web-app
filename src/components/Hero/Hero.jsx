import React, { useRef, useState } from "react";
import styles from "./hero.module.scss";
import { Spin } from "antd";
import { LoadingOutlined, StopOutlined } from "@ant-design/icons";

import { CheckOutlined } from "@ant-design/icons";
import { Result } from "antd";

const Hero = () => {
  const refImg = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedFile = refImg.current.files[0];

    if (selectedFile) {
      console.log("Processando imagem...");
      postImg(selectedFile);
    } else {
      console.log("Selecione uma imagem.");
    }
  };

  const postImg = async (selectedFile) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://0.0.0.0:3009/api/processar", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setResult(data);
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
      <form
        className={styles.form}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="file-upload" className={styles.customUpload}>
          SELECIONAR
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".jpg"
          ref={refImg}
          className={styles.inputFile}
        />
        <input
          type="submit"
          name=""
          id=""
          className={styles.submitBtn}
          value="ENVIAR"
        />
      </form>
      {isLoading ? (
        <Spin
          style={{
            width: "100%",
            marginLeft: "0 auto",
          }}
          indicator={antIcon}
        />
      ) : result ? (
        result.mensagem === "Sucesso" ? (
          <Result
            icon={<CheckOutlined style={{ color: "#700808" }} />}
            title="Acesso liberado para Lucas Borges"
            // por enquanto ta hard coded, mas aqui vai ser o resultado da classificacao do modelo
          />
        ) : (
          <Result
            icon={<StopOutlined style={{ color: "#700808" }} />}
            title="Acesso bloqueado"
          />
        )
      ) : null}
    </div>
  );
};

export default Hero;
