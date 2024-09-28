'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // or any other theme
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [generatedCss, setGeneratedCss] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return true;
  });

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (generatedHtml || generatedCss) {
      Prism.highlightAll();
    }
  }, [generatedHtml, generatedCss]);

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('Image size should not exceed 1MB.');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please upload a valid image file.');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  }, [handleImageUpload]);

  const handleBrowse = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const generateCodeFromImage = useCallback(async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('/api/generate-code', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setGeneratedHtml(response.data.html);
      setGeneratedCss(response.data.css);
    } catch (err) {
      setError('An error occurred while generating the code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [image]);

  const copyToClipboard = useCallback((type: 'html' | 'css') => {
    const text = type === 'html' ? generatedHtml : generatedCss;
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type.toUpperCase()} copied to clipboard!`);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [generatedHtml, generatedCss]);

  const resetUploader = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    setGeneratedHtml('');
    setGeneratedCss('');
    setError(null);
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} min-h-screen p-4 sm:p-8 flex flex-col`}>
      <div className="max-w-7xl mx-auto flex-grow">
        <header className="flex justify-between items-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Image Uploader</h1>
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </header>

        <div className={`mb-4 p-3 rounded-md ${isDarkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`} role="alert">
          <p className="text-sm font-medium">
            <span className="font-bold">Note:</span> App in development. Features may change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Your Image</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Drag and drop your image here or click to select a file from your device. (Max size: 1MB)
              </p>
              <div 
                className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 sm:p-12 text-center cursor-pointer`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleBrowse}
                  accept="image/*"
                />
                {isLoading ? (
                  <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Generating code...</div>
                ) : (
                  <>
                    <svg className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Drag & Drop</p>
                    <p className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>or</p>
                    <button className={`mt-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} px-4 py-2 rounded-md`}>Browse Files</button>
                  </>
                )}
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </section>

            {image && (
              <section className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold">Image Preview</h3>
                  <div className="space-x-2">
                    <button 
                      onClick={generateCodeFromImage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Code'}
                    </button>
                    <button 
                      onClick={resetUploader}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className={`relative w-full h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg overflow-hidden cursor-pointer`} onClick={() => setShowModal(true)}>
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Generated Code</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Here's the HTML and CSS code for your uploaded image.</p>
            <div className="space-y-4">
              {['HTML', 'CSS'].map((type) => (
                <div key={type} className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg p-4`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{type}</h3>
                    <button 
                      className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} ${!(type === 'HTML' ? generatedHtml : generatedCss) && 'opacity-50 cursor-not-allowed'}`} 
                      onClick={() => copyToClipboard(type.toLowerCase() as 'html' | 'css')} 
                      disabled={!(type === 'HTML' ? generatedHtml : generatedCss)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-2 rounded text-sm overflow-hidden h-60 w-full`}>
                    <pre className={`language-${type.toLowerCase()} overflow-y-auto h-full w-full`}>
                      <code>{type === 'HTML' ? (generatedHtml || 'No HTML generated yet') : (generatedCss || 'No CSS generated yet')}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 sm:mt-16 py-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-2">Image Uploader</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Convert your images to HTML and CSS with ease.
              </p>
            </div>
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center space-x-4`}>
              <a
                href="https://wa.me/254723752098"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-500 transition-colors"
              >
                <FaWhatsapp className="w-6 h-6 mr-2" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a
                href="mailto:briannjaramba138@gmail.com"
                className="flex items-center hover:text-blue-500 transition-colors"
              >
                <FaEnvelope className="w-6 h-6 mr-2" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
          <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} Image Uploader. All rights reserved.
          </div>
        </div>
      </footer>

      {showModal && imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="max-w-4xl max-h-[90vh] bg-gray-800 p-4 rounded-lg">
            <Image
              src={imagePreview}
              alt="Full size preview"
              layout="responsive"
              width={800}
              height={600}
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;