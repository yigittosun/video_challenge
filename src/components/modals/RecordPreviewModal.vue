<template>
  <div class="modal fade" tabindex="-1" id="record_preview_modal" ref="recordPreviewModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Record Preview</h3>

          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i @click="rerecordVideo" class="bi bi-x-lg h5"></i>
          </div>
          <!--end::Close-->
        </div>

        <div class="modal-body">
          <div class="container">
            <video :src="recordedVideoUrl" controls></video>
          </div>
        </div>

        <div class="modal-footer">
          <ButtonComponent
            btnClass="btn-navy"
            buttonIcon="bi bi-arrow-clockwise me-2 fs-5"
            buttonText="Rerecord"
            @click="rerecordVideo"
            data-bs-dismiss="modal"
          />
          <ButtonComponent
            btnClass="btn-success"
            buttonIcon="bi bi-download me-2 fs-5"
            buttonText="Dowload"
            @click="downloadRecordedVideo"
          />
          <ButtonComponent
            btnClass="btn-primary"
            :buttonIcon="
              uploading
                ? 'spinner-border spinner-border-sm me-2 '
                : 'bi bi-cloud-arrow-up me-2 fs-5'
            "
            :buttonText="uploading ? 'Uploading...' : 'Upload'"
            @click="uploadVideo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { getStorage, ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import Swal from 'sweetalert2'
import { type FirebaseApp } from 'firebase/app'

export default defineComponent({
  name: 'record-preview-modal',
  emits: ['fresh-video'],
  components: {
    ButtonComponent
  },
  props: {
    recordedVideoUrl: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const recordPreviewModalRef = ref<HTMLElement | null>(null)
    const recordedVideo = ref(props.recordedVideoUrl)
    const uploading = ref(false)
    const app = inject<FirebaseApp>('firebaseApp')

    const uploadVideo = async () => {
      const storage = getStorage(app)
      const videoRef = storageRef(storage, 'videos/my-recorded-video.webm')
      const response = await fetch(props.recordedVideoUrl)
      const blob = await response.blob()

      uploading.value = true

      const uploadTask = uploadBytesResumable(videoRef, blob)

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload progress: ' + progress + '%')
      })

      try {
        await uploadTask
        Swal.fire({
          icon: 'success',
          title: 'Video Uploaded Successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong... It may be a server related problem. Try again!',
          footer: `<p>${error}</p>`
        })
      } finally {
        uploading.value = false
      }
    }
    const downloadRecordedVideo = () => {
      const a = document.createElement('a')
      a.href = props.recordedVideoUrl
      a.download = 'my-recorded-video.webm'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    const rerecordVideo = () => {
      recordedVideo.value = ''
      if (recordPreviewModalRef.value) {
        recordPreviewModalRef.value.addEventListener('hidden.bs.modal', () => {
          emit('fresh-video', true)
        })
      }
    }

    return {
      recordPreviewModalRef,
      uploading,
      app,
      rerecordVideo,
      uploadVideo,
      downloadRecordedVideo
    }
  }
})
</script>

<style lang="scss">
@media (max-width: 768px) {
  video {
    max-width: 100%;
  }
}

.container {
  max-width: 100%;
  overflow: hidden;
}
</style>
