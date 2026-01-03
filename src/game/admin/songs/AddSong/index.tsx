import styled from "@emotion/styled";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import PageHeading from "../../PageHeading";
import Panel from "../../Panel";
import { BodyContainer } from "../../styles";
import SongInfo from "./SongInfo";
import { any } from "zod";
import extractData from "src/game/extractData";
import { supabase } from "../../../../lib/supabase";

type Props = {};
type MyImage = {
  url: string;
  name: string;
  file: File;
};
type SongData = {
  title: string,
  titleUnicode: string,
  artist: string,
  artistUnicode: string,
  beatmapSetId: number
}
type LevelData = {
  beatmapId: number,
  difficulty: number,
  image: string,
  approachRate: number,
  noteData: any[],
  breakData: any[]
}
type Song = {
  songId: number,
  beatmapSetId: number,
  songUrl: string,
  defaultImg: string,
  title: string,
  titleUnicode: string,
  artist: string,
  artistUnicode: string,
  active: boolean
}
type Level = {
  levelId?: number,
  songId?: number,
  beatmapId: number,
  difficulty: number,
  image: string,
  approachRate: number,
  noteData: any[],
  breakData: any[],
  beatmapUrl: string,
  active?: boolean
}

export default function AddSong({}: Props) {
  const [images, setImages] = useState<MyImage[]>([]);
  const [defaultImage, setDefaultImage] = useState<string>();
  const [songFiles, setSongFiles] = useState<File[]>([]);
  const [songFile, setSongFile] = useState<File>();
  const [levelData, setLevelData] = useState<LevelData[]>([])
  const [songTitle, setSongTitle] = useState('')
  const [songTitleUnicode, setSongTitleUnicode] = useState('')
  const [songArtist, setSongArtist] = useState('')
  const [songArtistUnicode, setSongArtistUnicode] = useState('')
  const [beatmapSetId, setBeatmapSetId] = useState('')
  
  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const validateFiles = (): boolean => {
    // Validate images
    for (const image of images) {
      if (!image.file.type.startsWith('image/')) {
        setSubmitStatus('error')
        setStatusMessage(`Invalid image file: ${image.name}. Only image files are allowed.`)
        return false
      }
      if (image.file.size > 10 * 1024 * 1024) { // 10MB limit for images
        setSubmitStatus('error')
        setStatusMessage(`Image file too large: ${image.name}. Maximum size is 10MB.`)
        return false
      }
    }
    
    // Validate audio file
    if (songFile) {
      if (!songFile.type.startsWith('audio/')) {
        setSubmitStatus('error')
        setStatusMessage(`Invalid audio file: ${songFile.name}. Only audio files are allowed.`)
        return false
      }
      if (songFile.size > 20 * 1024 * 1024) { // 20MB limit for audio
        setSubmitStatus('error')
        setStatusMessage(`Audio file too large: ${songFile.name}. Maximum size is 20MB.`)
        return false
      }
    }
    
    // Validate beatmap files
    for (const beatmapFile of songFiles) {
      if (!beatmapFile.name.endsWith('.osu')) {
        setSubmitStatus('error')
        setStatusMessage(`Invalid beatmap file: ${beatmapFile.name}. Only .osu files are allowed.`)
        return false
      }
      if (beatmapFile.size > 1 * 1024 * 1024) { // 1MB limit for beatmaps
        setSubmitStatus('error')
        setStatusMessage(`Beatmap file too large: ${beatmapFile.name}. Maximum size is 1MB.`)
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus('idle')
    setStatusMessage('')
    setIsSubmitting(true)
    
    if (beatmapSetId === '') {
      setSubmitStatus('error')
      setStatusMessage('Beatmap Set ID is required.')
      setIsSubmitting(false)
      return;
    }

    if (!songFile) {
      setSubmitStatus('error')
      setStatusMessage('Audio file is required.')
      setIsSubmitting(false)
      return;
    }

    if (images.length === 0) {
      setSubmitStatus('error')
      setStatusMessage('At least one image is required.')
      setIsSubmitting(false)
      return;
    }

    if (songFiles.length === 0) {
      setSubmitStatus('error')
      setStatusMessage('At least one beatmap file is required.')
      setIsSubmitting(false)
      return;
    }

    // File validation
    if (!validateFiles()) {
      setIsSubmitting(false)
      return;
    }

    try {
      console.log('Starting upload process...')
      setStatusMessage('Starting upload process...')
      
      // 0. Clean up any existing files for this beatmapSetId to prevent orphaned files
      // Note: This does full cleanup for now, but could be made smarter to only clean files being replaced
      console.log('Cleaning up existing files...')
      setStatusMessage('Cleaning up existing files...')
      try {
        const cleanupResponse = await fetch('/api/song/cleanup', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId: beatmapSetId })
        })
        
        if (cleanupResponse.ok) {
          console.log('Existing files cleaned up successfully')
        } else {
          console.warn('Cleanup failed, continuing with upload...')
        }
      } catch (cleanupError) {
        console.warn('Cleanup error, continuing with upload:', cleanupError)
      }
      
      // 1. Upload images to storage
      console.log('Uploading images...')
      setStatusMessage(`Uploading ${images.length} image(s)...`)
      const uploadedImages: string[] = []
      
      for (const image of images) {
        try {
          setStatusMessage(`Uploading image: ${image.name}`)
          const imageData = await fileToBase64(image.file)
          const response = await fetch('/api/song/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              songId: beatmapSetId,
              fileType: 'image',
              fileName: image.name,
              fileData: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
            })
          })
          
          const result = await response.json()
          if (response.ok) {
            uploadedImages.push(result.url)
            console.log('Image uploaded:', image.name)
          } else {
            console.error('Image upload failed:', result.error)
            setSubmitStatus('error')
            setStatusMessage(`Failed to upload image: ${image.name} - ${result.error}`)
            setIsSubmitting(false)
            return
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          setSubmitStatus('error')
          setStatusMessage(`Error uploading image: ${image.name}`)
          setIsSubmitting(false)
          return
        }
      }

      // 2. Upload audio file
      console.log('Uploading audio file...')
      setStatusMessage(`Uploading audio file: ${songFile.name}`)
      let songUrl = ''
      try {
        const audioData = await fileToBase64(songFile)
        const response = await fetch('/api/song/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            songId: beatmapSetId,
            fileType: 'audio',
            fileName: songFile.name,
            fileData: audioData.split(',')[1]
          })
        })
        
        const result = await response.json()
        if (response.ok) {
          songUrl = result.url
          console.log('Audio file uploaded:', songFile.name)
        } else {
          console.error('Audio upload failed:', result.error)
          setSubmitStatus('error')
          setStatusMessage(`Failed to upload audio file: ${result.error}`)
          setIsSubmitting(false)
          return
        }
      } catch (error) {
        console.error('Error uploading audio file:', error)
        setSubmitStatus('error')
        setStatusMessage('Error uploading audio file')
        setIsSubmitting(false)
        return
      }

      // 3. Process beatmap files and create levels
      console.log('Processing beatmap files...')
      setStatusMessage(`Processing ${songFiles.length} beatmap file(s)...`)
      const levels: Level[] = []
      
      for (let i = 0; i < songFiles.length; i++) {
        const beatmapFile = songFiles[i]
        const level = levelData[i]
        
        if (!level) {
          console.error(`No level data found for beatmap file: ${beatmapFile.name}`)
          continue
        }
        
        try {
          setStatusMessage(`Uploading beatmap: ${beatmapFile.name}`)
          // Upload beatmap file as audio (it contains the beatmap data)
          const beatmapData = await fileToBase64(beatmapFile)
          const response = await fetch('/api/song/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              songId: beatmapSetId,
              fileType: 'audio',
              fileName: beatmapFile.name,
              fileData: beatmapData.split(',')[1]
              })
            })
            
            const result = await response.json()
            let beatmapUrl = ''
            
            if (response.ok) {
              beatmapUrl = result.url
              console.log('Beatmap file uploaded:', beatmapFile.name)
            } else {
              console.error('Beatmap upload failed:', result.error)
              console.warn(`Skipping failed beatmap: ${beatmapFile.name}`)
              continue
            }
            
            levels.push({
              ...level,
              beatmapUrl,
              active: true
            })
          } catch (error) {
            console.error('Error processing beatmap file:', error)
            console.warn(`Skipping failed beatmap: ${beatmapFile.name}`)
          }
        }

        // 4. Create song in database
        console.log('Creating song in database...')
        setStatusMessage('Saving song to database...')
        const defaultImg = uploadedImages.find(url => url.includes(defaultImage || '')) || uploadedImages[0] || ''
        
        const songData = {
          beatmapSetId: Number(beatmapSetId),
          defaultImg,
          songUrl,
          title: songTitle,
          titleUnicode: songTitleUnicode,
          artist: songArtist,
          artistUnicode: songArtistUnicode
        }

        const createResponse = await fetch('/api/song', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songData,
            levels
          })
        })

        const createResult = await createResponse.json()
        
        if (createResponse.ok) {
          console.log('Song operation successful:', createResult)
          setSubmitStatus('success')
          
          // Handle different response types
          if (createResult.message) {
            // Existing song with new levels added
            if (createResult.newLevels !== undefined) {
              setStatusMessage(`Added ${createResult.newLevels} new level(s) to existing song "${songTitle}"! Total levels: ${createResult.song?.levels?.length || 'unknown'}`)
            } else {
              // Song created successfully
              setStatusMessage(`Song "${songTitle}" created successfully! ${levels.length} levels added.`)
            }
          } else {
            // Fallback message
            setStatusMessage(`Song "${songTitle}" processed successfully!`)
          }
          
          // Reset form after successful submission
          resetForm()
        } else {
          console.error('Song could not be saved:', createResult.error)
          setSubmitStatus('error')
          setStatusMessage(`Failed to process song: ${createResult.error || 'Unknown error'}`)
        }
    } catch (error) {
      console.error('Error in submit process:', error)
      setSubmitStatus('error')
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setStatusMessage('Connection error: Unable to reach the server. This might be due to the large file size or server timeout.')
      } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
        setStatusMessage('Network error: Please check your internet connection and try again.')
      } else {
        setStatusMessage('An unexpected error occurred while creating the song')
      }
    } finally {
      setIsSubmitting(false)
    }
  };

  // Helper function to reset the form
  const resetForm = () => {
    setBeatmapSetId('')
    setSongTitle('')
    setSongTitleUnicode('')
    setSongArtist('')
    setSongArtistUnicode('')
    setImages([])
    setSongFiles([])
    setSongFile(undefined)
    setLevelData([])
    setDefaultImage(undefined)
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
    fileInputs.forEach(input => {
      input.value = ''
    })
  };

  const extractSongData = async (file:File) => {
    const text = await file.text()
    const {
      title,
      titleUnicode,
      artist,
      artistUnicode,
      beatmapSetId
    } = await extractData(text)
    setSongTitle(title)
    setSongTitleUnicode(titleUnicode)
    setSongArtist(artist)
    setSongArtistUnicode(artistUnicode)
    setBeatmapSetId(beatmapSetId)
  }

  const extractLevelData = async (file:File): Promise<LevelData> => {
    const text = await file.text()
    const {
      beatmapId,
      difficulty,
      image,
      approachRate,
      noteData,
      breakData
    } = await extractData(text)
    return {
      beatmapId: Number(beatmapId),
      difficulty: Number(difficulty),
      image,
      approachRate,
      noteData,
      breakData
    }
  }

  const updateImages = (e: any) => {
    e.preventDefault();
    let imageFiles = [...e.target.files];
    let imageList: MyImage[] = [];
    imageFiles &&
      imageFiles.length > 0 &&
      imageFiles.map((imageFile, index) => {
        if (index == 0) {
          setDefaultImage(imageFile.name);
        }
        imageList.push({
          url: URL.createObjectURL(imageFile),
          name: imageFile.name,
          file: imageFile,
        });
      });
    setImages(imageList);
  };

  const updateTracks = async (e: any) => {
    e.preventDefault();
    const files: File[] = [...e.target.files];
    const levels: LevelData[] = []
    for (let i=0; i<files.length; i++){
      if (i === 0) {
        extractSongData(files[0])
      }
      const levelData: LevelData = await extractLevelData(files[i])
      levels.push(levelData)
    }
    setLevelData(levels)
    setSongFiles(files);
  };

  const updateSong = (e: any) => {
    e.preventDefault();
    const file: File = e.target.files[0];
    setSongFile(file);
  };

  const updateDefaultImage = (e: any) => {
    e.preventDefault();
    setDefaultImage(e.target.value as string);
  };

  return (
    <Box display="flex" bgcolor="#ffffff" color="#000000">
      <Panel />
      <BodyContainer>
        <PageHeading title="Add Song" />
        
        {/* Status Messages */}
        {submitStatus !== 'idle' && (
          <Box
            style={{
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              backgroundColor: submitStatus === 'success' ? '#d4edda' : '#f8d7da',
              color: submitStatus === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${submitStatus === 'success' ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {submitStatus === 'success' ? '✅ Success!' : '❌ Error'}
            </Typography>
            <Typography variant="body2">{statusMessage}</Typography>
          </Box>
        )}
        
        {/* Loading indicator */}
        {isSubmitting && submitStatus === 'idle' && (
          <Box
            style={{
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              border: '1px solid #bee5eb'
            }}
          >
            <Typography variant="body2">⏳ {statusMessage}</Typography>
          </Box>
        )}
        
        <PageContent>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              alignContent: "flex-start",
            }}
            autoComplete="off"
          >
            <Box
              className="mobileStack"
              style={{ display: "flex", gap: "16px" }}
            >
              <Box flex={1}>
                <Typography>Images (.jpeg, .jpg, .png)</Typography>
                <input
                  type="file"
                  accept="image/png,.jpg,.jpeg"
                  onChange={updateImages}
                  multiple
                  required
                />
                <Box
                  style={{
                    height: 200,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    padding: 8,
                    marginTop: 8,
                    overflowY: "scroll",
                    whiteSpace: "initial",
                    alignItems: "flex-start",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {images &&
                    images.map((image) => {
                      return (
                        <Stack
                          style={{
                            padding: 8,
                          }}
                        >
                          <Image
                            src={image.url}
                            width={160}
                            height={90}
                            alt="Uploaded Image"
                            style={{
                              borderRadius: 4,
                              width: "fit-content",
                              minWidth: 40,
                            }}
                          />
                          <Typography
                            width="fit-content"
                            style={{ overflowWrap: "anywhere" }}
                            fontSize={12}
                          >
                            {image.name}
                          </Typography>
                        </Stack>
                      );
                    })}
                </Box>
              </Box>
              <Box flex={1}>
                <Typography>Tracks (.osu)</Typography>
                <input
                  type="file"
                  accept=".osu"
                  onChange={updateTracks}
                  multiple
                  required
                />
                <Box
                  style={{
                    height: 200,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    marginTop: 8,
                    overflowY: "scroll",
                    whiteSpace: "initial",
                    alignItems: "center",
                  }}
                >
                  <List itemType="">
                    {songFiles &&
                      songFiles.map((file: File) => {
                        return (
                          <ListItem>
                            <Typography>{file.name}</Typography>
                          </ListItem>
                        );
                      })}
                  </List>
                </Box>
              </Box>
            </Box>
            <Box
              className="mobileStack"
              style={{ display: "flex", gap: "16px" }}
            >
              <Box flex={1}>
                <Typography>Song (.mp3, .wav, .ogg)</Typography>
                <input
                  type="file"
                  accept=".mp3,.wav,.ogg"
                  onChange={updateSong}
                  required
                />
              </Box>
              <Box flex={1}>
                <FormControl fullWidth>
                  <InputLabel>Default Image</InputLabel>
                  <Select
                    value={defaultImage}
                    label="Default Image"
                    onChange={updateDefaultImage}
                    required
                  >
                    {images &&
                      images.length > 0 &&
                      images.map((image) => {
                        return (
                          <MenuItem value={image.name}>{image.name}</MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {beatmapSetId && <Box>
              <Typography>BeatmapSetId: {beatmapSetId}</Typography>
            </Box>}
            {songFiles && songFiles.length > 0 && (
              <SongInfo 
                title={songTitle}
                setTitle={setSongTitle}
                titleUnicode={songTitleUnicode}
                setTitleUnicode={setSongTitleUnicode}
                artist={songArtist}
                setArtist={setSongArtist}
                artistUnicode={songArtistUnicode}
                setArtistUnicode={setSongArtistUnicode}
              />
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
              flex={1}
            >
              <Button
                href="/admin/tracks"
                variant="contained"
                color="secondary"
                size="large"
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Submit'}
              </Button>
            </Box>
          </form>
        </PageContent>
      </BodyContainer>
    </Box>
  );
}

const PageContent = styled.div`
  height: 100%;
  padding-top: 16px;
  display: flex;
  input {
    width: 100%;
    margin-top: 4px;
  }
`;
