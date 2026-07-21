"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Camera, CheckCircle, ArrowLeft, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFile(null);
          setPreview(null);
        }, 2000);
      }
    } catch (e) {
      console.error("Erro ao enviar:", e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-2">
            Envie sua foto
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Compartilhe o momento!
          </p>
        </div>

        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 text-center cursor-pointer hover:border-primary transition-colors bg-white dark:bg-zinc-900"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileChange(e.target.files[0])
              }
            />
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-zinc-400" size={32} />
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 font-medium mb-2">
              Arraste sua foto aqui
            </p>
            <p className="text-zinc-400 text-sm">ou clique para selecionar</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-black">
              <img
                src={preview!}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!isSuccess && (
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              {isSuccess && (
                <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                  <div className="text-center text-white">
                    <CheckCircle size={64} className="mx-auto mb-2" />
                    <p className="text-xl font-bold">Enviado!</p>
                  </div>
                </div>
              )}
            </div>

            {!isSuccess && (
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-medium text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Camera size={20} />
                    Enviar Foto
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
