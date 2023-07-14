import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface YourComponentProps {
  base64Image: string;
}

const PaintComponent: React.FC<YourComponentProps> = ({ base64Image }) => {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const createPaintingMutation = trpc.painting.createPainting.useMutation();
  const { data: session } = useSession();
  const currentUser = session?.user?.id;

  const saveImage = () => {
    const image_to_save = "data:image/octet-stream;base64," + response;

    const link = document.createElement("a");
    link.download = "my-canvas.png";
    link.href = image_to_save;
    link.click();
  };
  const saveToDatabase = async () => {
    const image_to_save = "data:image/png;base64," + response;
    createPaintingMutation.mutate({
      userId: currentUser as string,
      image: image_to_save,
    });
    toast.success("Your picture is saved! 🎨");
  };

  const handleSendPrompt = (event: React.FormEvent) => {
    setPrompt((event.target as HTMLInputElement).value);
  };

  const fetchData = () => {
    if (prompt === null || base64Image === null) return;

    setLoading(true);
    const requestBody = {
      prompt: prompt,
      negative_prompt: "",
      cfg_scale: 7,
      steps: 20,
      sampler_index: "Euler a",
      width: 768,
      height: 512,
      alwayson_scripts: {
        controlnet: {
          args: [
            {
              input_image: base64Image,
              module: "scribble_xdog",
              model: "control_v11p_sd15_scribble [d4ba51ff]",
              weight: 0.5,
              resize_mode: 2,
            },
          ],
        },
      },
    };

    fetch("/api/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data.images[0]);
        console.log(data.images[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <label htmlFor="promptInput">What do you want your picture to be?</label>{" "}
      <br></br>
      <input
        id="promptInput"
        type="text"
        className="rounded border border-orange-300/50 px-4 py-2 text-orange-400"
        placeholder="Prompt"
        onChange={handleSendPrompt}
      />
      <button
        onClick={fetchData}
        disabled={loading}
        className="m-4 rounded-xl border border-orange-400 px-2 py-2 hover:border-2"
      >
        {loading ? "Loading..." : "Beautify Now!"}
      </button>
      {response && (
        <div>
          <img
            src={`data:image/png;base64,${response}`}
            alt="Generated"
            style={{ width: "400px" }}
          />
          <h3 className="text-3xl text-orange-400">Saving Tools</h3>
          <button
            className="m-2 flex items-center space-x-3 rounded border px-4 py-2 text-orange-400 transition hover:border-orange-400"
            onClick={saveImage}
          >
            Save Image
          </button>
          <button
            className="flex items-center space-x-3 rounded border px-4 
                       py-2 text-orange-400 transition hover:border-orange-400"
            onClick={saveToDatabase}
          >
            Save to Database
          </button>
        </div>
      )}
    </div>
  );
};

export default PaintComponent;
