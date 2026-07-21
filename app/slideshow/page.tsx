"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Loader2 } from "lucide-react";

interface Photo {
  url: string;
  uploadedAt: string;
}

export default function Slideshow() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [eventName, setEventName] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  useEffect(() => {
    setEventName(localStorage.getItem("eventName") || "Evento");
    setUploadUrl(`${window.location.origin}/upload`);
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (e) {
      console.error("Erro ao buscar fotos:", e);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Poll for new photos every 5 seconds
    const pollInterval = setInterval(fetchPhotos, 5000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [photos]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative flex flex-col">
      <div className="flex-1 relative flex items-center justify-center">
        {photos.length === 0 ? (
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-zinc-600 animate-spin mx-auto" />
            <p className="text-zinc-500 text-xl">Aguardando fotos...</p>
          </div>
        ) : (
          <Image
            key={photos[currentIndex].url}
            src={photos[currentIndex].url}
            alt="Slideshow"
            fill
            className="object-contain transition-opacity duration-1000"
            priority
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex items-end justify-between">
        <div className="text-white">
          <h2 className="text-3xl font-serif font-bold">{eventName}</h2>
          <p className="text-zinc-300 mt-1">
            {photos.length} foto{photos.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-xl shadow-2xl">
          <QRCodeSVG value={uploadUrl} size={120} level="H" />
          <p className="text-xs font-medium text-zinc-600 text-center">
            Escaneie para enviar<br />sua foto!
          </p>
        </div>
      </div>
    </div>
  );
}
