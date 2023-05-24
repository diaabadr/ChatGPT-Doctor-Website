import { useState, useEffect } from "react";
import axios from "axios";
import PromptInput from "../../components/PromptInput/PromptInput";
import PromptResponseList from "../../components/PromptResponseList/PromptResponseList";
import { ResponseInterface } from "../../components/PromptResponseList/response-interface";

import "./styles/App.css";
import { Link } from "react-router-dom";


type ModelValueType = "gpt" | "codex" | "image";
const Homepage = () => {
  const [responseList, setResponseList] = useState<ResponseInterface[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [promptToRetry, setPromptToRetry] = useState<string | null>(null);
  const [uniqueIdToRetry, setUniqueIdToRetry] = useState<string | null>(null);
  const [modelValue, setModelValue] = useState<ModelValueType>("gpt");
  const [isLoading, setIsLoading] = useState(false);
  let loadInterval: number | undefined;

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  const htmlToText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent;
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const addLoader = (uid: string) => {
    const element = document.getElementById(uid) as HTMLElement;
    element.textContent = "";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += ".";

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === "....") {
        element.textContent = "";
      }
    }, 300);
  };

  const addResponse = (selfFlag: boolean, response?: string) => {
    const uid = generateUniqueId();
    setResponseList((prevResponses) => [
      ...prevResponses,
      {
        id: uid,
        response,
        selfFlag,
      },
    ]);
    return uid;
  };

  const updateResponse = (
    uid: string,
    updatedObject: Record<string, unknown>
  ) => {
    setResponseList((prevResponses) => {
      const updatedList = [...prevResponses];
      const index = prevResponses.findIndex((response) => response.id === uid);
      if (index > -1) {
        updatedList[index] = {
          ...updatedList[index],
          ...updatedObject,
        };
      }
      return updatedList;
    });
  };

  const regenerateResponse = async () => {
    await getGPTResult(promptToRetry, uniqueIdToRetry);
  };

  const getGPTResult = async (
    _promptToRetry?: string | null,
    _uniqueIdToRetry?: string | null
  ) => {
    // Get the prompt input
    const _prompt = _promptToRetry ?? htmlToText(prompt);

    // If a response is already being generated or the prompt is empty, return
    if (isLoading || !_prompt) {
      return;
    }

    setIsLoading(true);

    // Clear the prompt input
    setPrompt("");

    let uniqueId: string;
    if (_uniqueIdToRetry) {
      uniqueId = _uniqueIdToRetry;
    } else {
      // Add the self prompt to the response list
      addResponse(true, _prompt);
      uniqueId = addResponse(false);
      await delay(50);
      addLoader(uniqueId);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      // Send a POST request to the API with the prompt in the request body
      const response = await axios.post("chat", {
        prompt: _prompt,
        model: modelValue,
      },config);
      if (modelValue === "image") {
        // Show image for `Create image` model
        updateResponse(uniqueId, {
          image: response.data,
        });
      } else {
        updateResponse(uniqueId, {
          response: response.data.trim(),
        });
      }

      setPromptToRetry(null);
      setUniqueIdToRetry(null);
      
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      if(err.response.data.error==="Please Login" && err.response.status==403)
     { 
      console.log(err);
      window.location.href='/login';
      return;
     }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    else if (err.response.data.error==="Not Allowed")
    {
      setPromptToRetry(_prompt);
      setUniqueIdToRetry(uniqueId);
      updateResponse(uniqueId, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        response: `Error: You are allowed to send just 3 Messages per Minute.`,
        error: true,
      });
      return;

    }
      setPromptToRetry(_prompt);
      setUniqueIdToRetry(uniqueId);
      updateResponse(uniqueId, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        response: `Error: ${err.message}`,
        error: true,
      });
    } finally {
      // Clear the loader interval
      clearInterval(loadInterval);
      setIsLoading(false);
    }
  };

  
    
  
  useEffect(()=>{
    const getChatHistory = async ()=>{
      const token = localStorage.getItem('token');
      if(!token)
      {
        window.location.href='/login';
        return;
      }
      console.log(token);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
        };
        const response = await axios.get("/chat",config);
        console.log(response.data.chat);
        for (const message of response.data.chat)
        {
          // console.log(message);
          await addResponse(message.role==="user"?true:false,message.content);
        }
    }
    
     getChatHistory();
  },[]);


  return (
    <div className="App background" >
      <div id="response-list">
        <PromptResponseList responseList={responseList} key="response-list" />
      </div>
      <div id="regenerate-button-container">
      <Link
            to="/logout"
          >
        <button id="regenerate-response-button" style={{marginRight:"1rem"}}>Logout</button>
        </Link>
      {uniqueIdToRetry && (
   
          <button
            id="regenerate-response-button"
            className={isLoading ? "loading" : ""}
            onClick={() => regenerateResponse()}
          >
            Regenerate Response
          </button>
      
      )}
      </div>
      <div id="model-select-container">
        <label htmlFor="model-select">Select model:</label>
        <select
          id="model-select"
          value={modelValue}
          onChange={(event) =>
            setModelValue(event.target.value as ModelValueType)
          }
        >
          <option value="gpt">
            GPT-3 (Understand and generate natural language )
          </option>
          <option value="image">
            Create Image (Create AI image using DALL·E models)
          </option>
        </select>
      </div>
      <div id="input-container">
        <PromptInput
          prompt={prompt}
          onSubmit={() => getGPTResult()}
          key="prompt-input"
          updatePrompt={(prompt) => setPrompt(prompt)}
        />
        <button
          aria-label="Submit prompt"
          type="submit"
          id="submit-button"
          className={isLoading ? "loading" : ""}
          onClick={() => getGPTResult()}
        ></button>
      </div>
    </div>
  );
};

export default Homepage;
