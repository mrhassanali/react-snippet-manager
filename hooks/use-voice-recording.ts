/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseVoiceRecordingOptions {
  onTranscript?: (transcript: string) => void;
  onInterimTranscript?: (transcript: string) => void;
  language?: string;
  continuous?: boolean;
  isShowToast?: boolean;
}

export function useVoiceRecording({
  onTranscript,
  onInterimTranscript,
  language = "en-US",
  continuous = true,
  isShowToast = false,
}: UseVoiceRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser.", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      if (isShowToast) {
        toast.success("Listening...", {
          id: "voice-recording",
          duration: Infinity,
          position: "bottom-right",
        });
      }
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Call interim callback for real-time updates
      if (interimTranscript && onInterimTranscript) {
        onInterimTranscript(interimTranscript);
      }

      // Call final callback when speech is finalized
      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      toast.dismiss("voice-recording");
      toast.error("Voice recognition error. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast.dismiss("voice-recording");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [continuous, language, onTranscript, onInterimTranscript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.dismiss("voice-recording");
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    toggleRecording,
  };
}



/**
 "use client";
 
 import { MicIcon, MicOffIcon, PlusIcon } from "lucide-react";
 import { ArrowUpIcon } from "lucide-react";
 import React, { useEffect, useRef, useState } from "react";
 import { ChatBotMessageType, useChatBot } from "@/context/chatbot-provider";
 import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
 
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { toast } from "sonner";
 import { useVoiceRecording } from "@/hooks/use-voice-recording";
 
 interface MessageInputAreaProps {
   textareaRef?: React.RefObject<HTMLTextAreaElement>;
 }
 
 const MessageInputArea: React.FC<MessageInputAreaProps> = () => {
   const { setChatbotMessages, input, setInput, isLoading, setIsLoading } = useChatBot();
   const textareaRef = useRef<HTMLTextAreaElement>(null!);
   const [interimText, setInterimText] = useState("");
 
   // Voice recording hook with real-time updates
   const { isRecording, toggleRecording } = useVoiceRecording({
     onTranscript: (transcript) => {
       // Final transcript - append to input
       setInput((prev) => prev + transcript);
       setInterimText(""); // Clear interim text
     },
     onInterimTranscript: (transcript) => {
       // Interim transcript - show in real-time but don't save yet
       setInterimText(transcript);
     },
     language: "en-US",
     continuous: true,
   });
 
 
 
 
   // Auto-resize textarea
   useEffect(() => {
     if (textareaRef.current) {
       textareaRef.current.style.height = "auto";
       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
     }
   }, [input, interimText]);
 
 
 
 
 
 
   const handleSend = async () => {
     if (!input.trim()) return;
 
     if (isLoading) {
       toast.info("Please wait for the current response to complete.", {
         id: "chatbot-loading-info",
         duration: 4000,
         position: "bottom-right",
         classNames: {
           content: "flex flex-col gap-2",
         },
         style: {
           "--border-radius": "calc(var(--radius)  + 4px)",
         } as React.CSSProperties,
       });
       return;
     }
 
     const userMessage: ChatBotMessageType = {
       id: Date.now().toString(),
       role: "user",
       content: input.trim(),
       timestamp: new Date(),
     };
 
     setChatbotMessages((prev) => [...prev, userMessage]);
     setInput("");
     setIsLoading(true);
 
     // Simulate AI response (replace with actual API call)
     setTimeout(() => {
       const assistantMessage: ChatBotMessageType = {
         id: (Date.now() + 1).toString(),
         role: "assistant",
         content: `I received your message: "${userMessage.content}". This is a simulated response. In production, this would be replaced with an actual AI API call.`,
         timestamp: new Date(),
       };
       setChatbotMessages((prev) => [...prev, assistantMessage]);
       setIsLoading(false);
     }, 1500);
   };
 
 
   
   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
     if (e.key === "Enter" && !e.shiftKey) {
       e.preventDefault();
       handleSend();
     }
   };
 
   return (
     <>
       <InputGroup className="bg-accent/50">
         <InputGroupTextarea
           placeholder="Ask, Search or Chat..."
           value={input + interimText}
           onChange={(e) => {
             // Only update input if not recording (to avoid interference)
             if (!isRecording) {
               setInput(e.target.value);
             }
           }}
           onKeyDown={handleKeyDown}
           ref={textareaRef}
           maxLength={200}
         />
         {interimText && (
           <div className="text-muted-foreground absolute bottom-14 left-2 text-xs italic">Listening...</div>
         )}
         <InputGroupAddon align="block-end">
           <InputGroupButton
             variant="outline"
             className="rounded-full"
             size="icon-xs"
             onClick={toggleRecording}
             title={isRecording ? "Stop recording" : "Start voice input"}
           >
             {isRecording ? (
               <MicOffIcon className="h-4 w-4 animate-pulse text-red-500" />
             ) : (
               <MicIcon className="h-4 w-4" />
             )}
           </InputGroupButton>
           <InputGroupButton variant="outline" className="rounded-full" size="icon-xs">
             <PlusIcon />
           </InputGroupButton>
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <InputGroupButton variant="ghost">Auto</InputGroupButton>
             </DropdownMenuTrigger>
             <DropdownMenuContent side="top" align="start" className="[--radius:0.95rem]">
               <DropdownMenuItem>Auto</DropdownMenuItem>
               <DropdownMenuItem>Agent</DropdownMenuItem>
               <DropdownMenuItem>Manual</DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
           <InputGroupButton
             variant="default"
             className="ml-auto rounded-full"
             size="icon-xs"
             onClick={handleSend}
             disabled={!input.trim() || isLoading}
           >
             <ArrowUpIcon />
             <span className="sr-only">Send</span>
           </InputGroupButton>
         </InputGroupAddon>
       </InputGroup>
     </>
   );
 };
 
 export default MessageInputArea;
 
 */