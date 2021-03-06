import { useEffect, useRef, useState } from "react";
import { ActionIcon, Button } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

type ImagePickerProp = {
  width?: number | string;
  result?: (result: string) => void;
  aspectRatio?: number;
  defaultImage?: string;
};
export const ImagePicker = (props: ImagePickerProp) => {
  const { width, result, aspectRatio = 1, defaultImage } = props;

  const inputRef = useRef<any>();

  const [dataUrl, setDataUrl] = useState<string>();
  const [isTooLarge, setIsToLarge] = useState<boolean>(false);

  const cropperRef = useRef<HTMLImageElement>(null);
  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    result && result(cropper.getCroppedCanvas().toDataURL());
  };

  const handleOnClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleOnChange = () => {
    setIsToLarge(false);
    if (inputRef.current) {
      const reader = new FileReader();

      reader.onload = () => {
        setIsToLarge(false);
        const result = reader.result as string;
        setDataUrl(result);
      };

      if (inputRef.current.files) {
        const file = inputRef.current.files[0];
        if (file.size < 1000000) {
          reader.readAsDataURL(file);
        } else {
          setIsToLarge(true);
        }
      }
    }
  };

  useEffect(() => {
    const getImage = async () => {
      if (defaultImage) {
        fetch(defaultImage)
          .then((response) => response.blob())
          .then((result) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = () => {
              setDataUrl(reader.result as string);
            };
          });
      }
    };

    getImage();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        border: `1px solid ${isTooLarge ? "#ff0000" : "#cecece"}`,
        borderRadius: 4,
        width: width ?? "100%",
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleOnChange}
        accept="image/*"
      />
      {isTooLarge ? (
        <p style={{ color: "red" }}>Ukuran file terlalu besar. Max: 1MB</p>
      ) : (
        !dataUrl && <p>Ukuran Maksimal adalah 1MB</p>
      )}
      {dataUrl ? (
        <>
          <Cropper
            src={dataUrl}
            style={{ height: 400, width: "100%" }}
            // Cropper.js options
            initialAspectRatio={aspectRatio}
            aspectRatio={aspectRatio}
            guides={false}
            crop={onCrop}
            ref={cropperRef}
          />

          <ActionIcon
            color="red"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              background: "white"
            }}
            onClick={() => setDataUrl(undefined)}
          >
            <Trash />
          </ActionIcon>
        </>
      ) : (
        <Button
          color={isTooLarge ? "error" : "primary"}
          onClick={handleOnClick}
        >
          Pick Image
        </Button>
      )}
    </div>
  );
};
