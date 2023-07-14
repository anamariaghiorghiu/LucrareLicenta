import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { GiBroom, GiPaintBrush, GiStoneWall } from "react-icons/gi";
import classNames from "classnames";

import {
  AiFillCaretDown,
  AiOutlineDelete,
  AiOutlineFolderAdd,
} from "react-icons/ai";
import { FiLayers } from "react-icons/fi";
import PaintComponent from "../components/PaintComponent";

const Paint = () => {
  const [canvasRefs, setCanvasRefs] = useState<
    Array<React.RefObject<HTMLCanvasElement>>
  >([React.createRef()]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [canvasWidth, setCanvasWidth] = useState(1400);
  const [layers, setLayers] = useState<Array<ImageData>>([]);
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [bgColor, setBgColor] = useState("transparent");
  const [layerSettingsVisible, setLayerSettingsVisible] = useState(false);
  const [brushSettingsVisible, setBrushSettingsVisible] = useState(false);
  const [canvasSettingsVisible, setCanvasSettingsVisible] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [base64Image, setBase64Image] = useState("");
  const [mouseHoldUpOk, setMouseHoldUpOk] = useState<boolean>(false);

  useEffect(() => {
    const getBase64Image = async () => {
      const image = await image64convertion();
      setBase64Image(image!);
    };

    getBase64Image();
    console.log(base64Image);
  }, [mouseHoldUpOk]);

  const changeBgColor = (color: string) => {
    const canvas = canvasRefs[0]!.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setBgColor(color);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handleMouseUp = () => {
    setMouseHoldUpOk(!mouseHoldUpOk);
    image64convertion;
    setIsDrawing(false);
    const canvas = canvasRefs[activeLayer]!.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        setLayers((prev) => {
          const newLayers = [...prev];
          newLayers[activeLayer] = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          return newLayers;
        });
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs[activeLayer]!.current;
    if (canvas && isDrawing) {
      const context = canvas.getContext("2d");
      if (context) {
        const rect = canvas.getBoundingClientRect();
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
      }
    }
  };

  const clearLayer = () => {
    setLayers((prev) => {
      const newLayers = [...prev];
      newLayers[activeLayer] = new ImageData(canvasWidth, canvasHeight);
      return newLayers;
    });
  };

  const addLayer = () => {
    setCanvasRefs((prev) => [...prev, React.createRef()]);
    setLayers((prev) => [...prev, new ImageData(canvasWidth, canvasHeight)]);
    setActiveLayer(layers.length);
  };

  const deleteLayer = () => {
    const canvas = canvasRefs[activeLayer]!.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setLayers((prev) => prev.filter((_, i) => i !== activeLayer));
    setCanvasRefs((prev) => prev.filter((_, i) => i !== activeLayer));
    setActiveLayer(0);
  };

  const selectLayer = (index: number) => {
    setSelectedLayer(index);
  };

  useEffect(() => {
    const canvas = canvasRefs[activeLayer]!.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        if (layers[activeLayer]) {
          context.putImageData(layers[activeLayer]!, 0, 0);
        }
      }
    }
  }, [color, brushSize, layers, activeLayer]);

  const image64convertion = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    // Fill the final canvas with the background color
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvasRefs.forEach((ref, i) => {
      const srcCanvas = ref.current;
      if (srcCanvas) {
        if (layers[i]) {
          // Create a temporary canvas to put the image data
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvasWidth;
          tempCanvas.height = canvasHeight;
          const tempContext = tempCanvas.getContext("2d");

          if (tempContext) {
            tempContext.putImageData(layers[i]!, 0, 0);
            // Draw the temporary canvas onto the final canvas
            context.drawImage(tempCanvas, 0, 0);
          }
        }
      }
    });

    const base64 = canvas.toDataURL("image/png");
    setBase64Image(base64); // Set the state with the new base64 image
    return base64;
  };

  return (
    <MainLayout>
      <div className="flex w-full">
        <section className="w-1/10">
          <h3 className="text-3xl text-orange-400">Tools</h3>
          <div className="p-2">
            {/* All the tools go here */}
            <div className="text-orange-400">
              <div className="">
                <div
                  className="flex flex-row items-center justify-between space-x-2 p-2 text-base text-orange-400 hover:rounded-xl hover:border hover:border-orange-400"
                  onClick={() => setLayerSettingsVisible(!layerSettingsVisible)}
                >
                  <div className="flex items-center space-x-2">
                    <FiLayers />
                    <div> Layers Settings</div>
                  </div>
                  <div>
                    <AiFillCaretDown />
                  </div>
                </div>
                {layerSettingsVisible && (
                  <div>
                    <button
                      className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400"
                      onClick={clearLayer}
                    >
                      Clear Layer
                      <GiBroom className="text-3xl" />
                    </button>
                    <button
                      className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400"
                      onClick={addLayer}
                    >
                      Add Layer
                      <AiOutlineFolderAdd className="  ml-1 text-3xl" />
                    </button>
                    <button
                      className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400"
                      onClick={deleteLayer}
                    >
                      Delete Layer
                      <AiOutlineDelete className="ml-1 text-3xl" />
                    </button>
                    {layers.map((_, i) => (
                      <button
                        key={i}
                        className={classNames(
                          "flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400",
                          {
                            "border-orange-400": i === selectedLayer,
                          }
                        )}
                        onClick={() => selectLayer(i)}
                      >
                        Layer {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div
                className="flex flex-row items-center justify-between space-x-2 p-2 text-base text-orange-400 hover:rounded-xl hover:border hover:border-orange-400"
                onClick={() => setBrushSettingsVisible(!brushSettingsVisible)}
              >
                <div className="flex items-center space-x-2">
                  <div>
                    <GiPaintBrush />
                  </div>
                  <div>Brush Settings</div>
                </div>
                <div>
                  <AiFillCaretDown />
                </div>
              </div>
              {brushSettingsVisible && (
                <div>
                  <div className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400">
                    <div style={{ width: "40px", height: "40px" }}>
                      <input
                        type="color"
                        onChange={(e) => setColor(e.target.value)}
                        value={color}
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
            <div
              className="flex flex-row items-center justify-between p-2 text-base text-orange-400 hover:rounded-xl hover:border hover:border-orange-400"
              onClick={() => setCanvasSettingsVisible(!canvasSettingsVisible)}
            >
              <div className="flex items-center space-x-2">
                <div>
                  <GiStoneWall />
                </div>
                <div>Canvas Settings</div>
              </div>
              <div>
                <AiFillCaretDown />
              </div>
            </div>

            <div>
              {canvasSettingsVisible && (
                <div className="flex flex-col">
                  <div className="text-orange-400">Bg Color: </div>
                  <input
                    type="color"
                    onChange={(e) => changeBgColor(e.target.value)}
                    value={bgColor}
                  />
                  <h4 className="text-orange-400">Canvas size</h4>
                  <div className="flex flex-col justify-start">
                    <label className="text-orange-400">
                      Height:
                      <input
                        type="number"
                        value={canvasHeight}
                        onChange={(e) =>
                          setCanvasHeight(Number(e.target.value))
                        }
                      />
                    </label>
                    <label className="text-orange-400">
                      Width:
                      <input
                        type="number"
                        value={canvasWidth}
                        onChange={(e) => setCanvasWidth(Number(e.target.value))}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <h3 className="text-3xl text-orange-400">Beautify your artwork</h3>
          <div className="p-2 text-orange-400 ">
            <div>
              <PaintComponent base64Image={base64Image} />
            </div>
          </div>
        </section>

        <section
          className="relative m-2"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {canvasRefs.map((ref, i) => (
            <canvas
              key={i}
              className={classNames("border-2", {
                "border-orange-400": i === activeLayer,
                "border-transparent": i !== activeLayer,
              })}
              ref={ref}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={draw}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: i === activeLayer ? "auto" : "none",
                background: "transparent",
              }}
            />
          ))}
        </section>
      </div>
    </MainLayout>
  );
};

export default Paint;
