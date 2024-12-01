import { useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import axios from "axios";

const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  // Add more language codes and names as needed
};


interface Detector {
  detect: (note: string) => Promise<DetectionResult[]>;
  addEventListener: (
    event: string,
    callback: (e: ProgressEvent) => void
  ) => void;
  ready: Promise<void>;
}

interface Translation {
  canDetect: () => Promise<string>;
  createDetector: () => Promise<Detector>;
  canTranslate: (options: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<string>;
  createTranslator: (options: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<Translator>;
}

interface Translator {
  translate: (text: string) => Promise<string>;
  addEventListener: (
    event: string,
    callback: (e: ProgressEvent) => void
  ) => void;
  ready: Promise<void>;
}

interface DetectionResult {
  detectedLanguage: string;
  confidence: number;
}

function App() {
  interface MovieData {
    data: {
      title: string;
      overview: string;
      poster_path: string;
      original_language : string;
      backdrop_path : string;
      release_date: string;
      vote_average: number;
    };
  }

  const inputNoteRef = useRef<HTMLTextAreaElement | null>(null);
  const [movieData, setmovieData] = useState<MovieData | null>(null);

  const detectLanguage = async (note: string) => {
    interface Translation {
      translation: {
        canDetect: () => Promise<string>;
        createDetector: () => Promise<Detector>;
      };
    }

    if (
      "translation" in window &&
      "canDetect" in (window as unknown as Translation).translation
    ) {
      const canDetect = await (
        window as unknown as Translation
      ).translation.canDetect();
      let detector;
      if (canDetect === "no") {
        console.error("The language detector isn't usable.");
        return;
      }
      if (canDetect === "readily") {
        detector = await (window as Translation).translation.createDetector();
      } else {
        detector = await (window as Translation).translation.createDetector();
        detector.addEventListener("downloadprogress", (e: ProgressEvent) => {
          console.log(e.loaded, e.total);
        });
        await detector.ready;
      }

      const detectionResults = await detector.detect(note);

      return detectionResults[0].detectedLanguage;
    }
  };

  const translateText = async (
    text: string,
    sourceLanguage: string
  ): Promise<string | null> => {
    try {
      if (
        "translation" in window &&
        "createTranslator" in
          (window as unknown as { translation: Translation }).translation
      ) {
        const translation = (window as unknown as { translation: Translation })
          .translation;
        const canTranslate = await translation.canTranslate({
          sourceLanguage,
          targetLanguage: "en",
        });

        if (canTranslate === "no") {
          console.error("Translation is not possible.");
          return null;
        }

        const translator = await translation.createTranslator({
          sourceLanguage,
          targetLanguage: "en",
        });

        if (canTranslate === "after-download") {
          translator.addEventListener(
            "downloadprogress",
            (e: ProgressEvent) => {
              console.log(e.loaded, e.total);
            }
          );
          await translator.ready;
        }

        const translated = await translator.translate(text);
        return translated;
      } else {
        console.error("Translation API is not supported.");
        return null;
      }
    } catch (error) {
      console.error("Error translating text:", error);
      return null;
    }
  };

  const audio = new Audio("/bg.wav");
  audio.loop = true;
  
  
  const onCapture = async () => {
    
    const note = inputNoteRef.current?.value;
    
    
    if (note) {
      audio.play();
      const detectedLanguage = await detectLanguage(note);
      console.log("Detected language:", detectedLanguage);
      
      if (detectedLanguage == "en") {
        const res = await axios.post(
          "https://mood-flix.onrender.com/api/recomend",
          { note }
        );
        console.log(res.data);
        setmovieData(res.data);
        audio.pause();
      } else {
        if (detectedLanguage) {
          const translated = await translateText(note, detectedLanguage);
          if (translated) {
            const res = await axios.post(
              "https://mood-flix.onrender.com/api/recomend",
              { note: translated }
            );
            setmovieData(res.data);
            audio.pause();
          }
        }
      }
    }
  };

  

  if (movieData) {
    return (
      <div className={"flex justify-center items-center w-screen h-screen Main p-10"}>
       <div
        className={
          "App w-full h-full bg-gradient-to-br from-[#000000] to-[#FFFFFF] flex flex-col justify-center gap-5 text-white mx-auto p-10"
        }
        >
        <header className={"mx-auto bg-black p-2 shadow-sm rounded-sm"}>
          <h1 className={"text-xl"}>{movieData.data.title}</h1>
        </header>
        <main className={"flex flex-col gap-5 px-5"}>
          <div className={"mx-auto"}>
            <img src={`https://image.tmdb.org/t/p/w500${movieData.data.backdrop_path || movieData.data.poster_path }`} alt={movieData?.data?.title} className={"h-40"} />
          </div>
          <p className={"text-black text-balance text-center"}>
            {movieData.data.overview}
          </p>
          <p className={"text-black text-center font-bold"}>
            {movieData.data.release_date} | {movieData.data.vote_average}
          </p>
          <p className={"text-white mx-auto bg-neutral-700 px-2 py-1"}> 
            {
              languageMap[movieData.data.original_language]
            }
           
          </p>
        </main>
        </div>
      </div>
    );
  }

  return (
    <div className={"flex justify-center items-center w-screen h-screen Main"}>
      <div
      className={
        "App w-96 h-96 bg-gradient-to-br from-[#000000] to-[#FFFFFF] flex flex-col justify-evenly text-black mx-auto py-5"
      }
      >
      <header className={"mx-auto bg-black p-2 shadow-sm rounded-sm"}>
        <h1 className={"text-2xl"}>Write-2-Watch</h1>
      </header>
      <main>
        <div className={"px-5 flex flex-col gap-5 items-center"}>
          <Textarea
            ref={inputNoteRef}
            placeholder={"Write whatever comes to u r mind !"}
            className={"bg-gray-300 h-40"}
            />

          <Button onClick={onCapture}>Capture</Button>
        </div>
      </main>
    </div>
    </div>
  );
}

export default App;
