<template>
  <div>
    <div class="video-container">
      <video ref="videoElement" class="video-js vjs-default-skin" autoplay></video>
      <canvas ref="previewCanvas" class="d-none preview-canvas-style"></canvas>
      <div class="button-overlay">
        <div class="d-flex justify-content-center align-items-center">
          <ButtonComponent
            btnClass="btn-navy my-2 px-3"
            @click="startRecording"
            :disabled="recording"
            buttonIcon="bi bi-record2 text-danger text-center fs-2 pulse"
            v-if="isMobile"
          />
          <ButtonComponent
            btnClass="btn-navy my-2 px-5"
            buttonText="Start Recording"
            @click="startRecording"
            :disabled="recording"
            buttonIcon="bi bi-record2 text-danger me-2 pulse"
            v-else
          />
        </div>
        <div class="d-flex justify-content-center align-items-center ms-2">
          <ButtonComponent
            btnClass="btn-red my-2 px-3"
            :disabled="!recording"
            @click="stopRecording"
            data-bs-toggle="modal"
            data-bs-target="#record_preview_modal"
            buttonIcon="bi bi-stop-circle fs-3"
            v-if="isMobile"
          />
          <ButtonComponent
            btnClass="btn-red my-2 px-5"
            buttonText="Stop Recording"
            :disabled="!recording"
            @click="stopRecording"
            data-bs-toggle="modal"
            data-bs-target="#record_preview_modal"
            v-else
          />
        </div>
      </div>
    </div>
    <div class="mt-3rem">
      <p v-if="!recording" class="text-center text-white">
        Press the "Start Recording" button to record.
      </p>
      <p v-else class="text-center text-white">
        To stop recording... Press the "Stop Recording" button.
      </p>
    </div>
  </div>
  <div class="footer border-bottom-0 rounded-top d-flex justify-content-around rounded-top">
    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Records List">
      <a type="button" data-bs-toggle="modal" data-bs-target="#records_list_modal">
        <i class="bi bi-floppy text-white h2"></i
      ></a>
    </div>
    <div>
      <a type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Logout"
        ><i @click="logout" class="bi bi-box-arrow-right text-white h2"></i
      ></a>
    </div>
  </div>
  <RecordPreviewModal :recordedVideoUrl="videoUrl" @fresh-video="handleFreshVideo" />
  <RecordsListModal />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Swal from 'sweetalert2'
import RecordPreviewModal from '@/components/modals/RecordPreviewModal.vue'
import RecordsListModal from '@/components/modals/RecordsListModal.vue'
import router from '@/router'

export default defineComponent({
  name: 'homepage-view',
  components: {
    ButtonComponent,
    RecordPreviewModal,
    RecordsListModal
  },
  setup() {
    const videoElement = ref<HTMLVideoElement | null>(null)
    const previewCanvas = ref<HTMLCanvasElement | null>(null)
    const recording = ref(false)
    const isMobile = window.innerWidth <= 768
    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    const recordedChunks: Blob[] = []
    const videoUrl = ref('')
    const freshVideoUrl = ref('')

    const startRecording = async () => {
      try {
        const supportedMimeTypes = [
          'video/webm;codecs=vp9,opus',
          'video/mp4',
          'audio/mp4',
          'audio/aac',
          'audio/mpeg',
          'audio/opus',
          'audio/webm',
          'audio/wav',
          'audio/ogg',
          'video/webm',
          'video/ogg',
          'video/mpeg',
          'video/mp2t'
        ]

        let selectedMimeType = ''
        for (const mimeType of supportedMimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType
            break
          }
        }

        if (!selectedMimeType) {
          Swal.fire({
            title: 'Error!',
            text: 'Your browser does not support any of the required MIME types for recording.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          })
          return
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoElement.value) {
          videoElement.value.srcObject = mediaStream
        }

        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: selectedMimeType })
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data)
          }
        }

        mediaRecorder.start()
        recording.value = true
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to start recording. Please check your camera and microphone permissions, and try again.',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      }
    }

    const stopRecording = async () => {
      try {
        if (mediaRecorder) {
          mediaRecorder.stop()
        }
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop())
        }

        const supportedMimeTypes = ['video/webm;codecs=vp9,opus', 'video/mp4', 'audio/mp4']

        let selectedMimeType = ''
        for (const mimeType of supportedMimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType
            break
          }
        }

        if (!selectedMimeType) {
          Swal.fire({
            title: 'Error!',
            text: 'Your browser does not support any of the required MIME types for recording.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          })
          return
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoElement.value) {
          videoElement.value.srcObject = mediaStream
        }

        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: selectedMimeType })
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(recordedChunks, { type: selectedMimeType })
          const videoUrl = window.URL.createObjectURL(recordedBlob)
          const a = document.createElement('a')
          a.href = videoUrl
          a.download = 'recorded-video'
          a.click()
          window.URL.revokeObjectURL(videoUrl)
        }

        videoUrl.value = window.URL.createObjectURL(
          new Blob(recordedChunks, { type: selectedMimeType })
        )
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Recording failed to stop',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
      } finally {
        recording.value = false
      }
    }

    const handleFreshVideo = () => {
      freshVideoUrl.value = ''

      nextTick(() => {
        videoUrl.value = freshVideoUrl.value
      })
    }

    onMounted(() => {
      if (videoElement.value) {
        const player = videojs(videoElement.value, {
          controls: false,
          autoplay: false,
          loop: false,
          responsive: true,
          aspectRatio: '6:2'
        })
        return player
      }
    })

    const logout = () => {
      router.push({ name: 'login-view' })
    }

    return {
      videoElement,
      previewCanvas,
      recording,
      isMobile,
      videoUrl,
      freshVideoUrl,
      logout,
      handleFreshVideo,
      startRecording,
      stopRecording
    }
  }
})
</script>

<style scoped>
/* For mobile screen */
@media (max-width: 768px) {
  .video-js.vjs-default-skin {
    width: 100%;
    height: 300px;
  }
}

.video-container {
  position: relative;
}

.button-overlay {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .button-overlay .btn-navy,
  .button-overlay .btn-red {
    width: 100%;
    margin: 8px 0;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  padding: 10px;
  background-color: transparent;
  border: 4px solid #9a9a9a;
  text-align: center;
}
.footer i {
  cursor: pointer;
}
</style>
