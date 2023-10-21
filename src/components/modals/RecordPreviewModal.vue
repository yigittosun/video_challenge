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
            <i class="ki-duotone ki-cross fs-1"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </div>
          <!--end::Close-->
        </div>

        <div class="modal-body">
          <video :src="recordedVideoUrl" controls></video>
        </div>

        <div class="modal-footer">
          <ButtonComponent btnClass="btn-navy" buttonText="Rerecord" data-bs-dismiss="modal" />
          <ButtonComponent
            btnClass="btn-success"
            buttonText="Dowload"
            @click="downloadRecordedVideo"
          />
          <ButtonComponent btnClass="btn-success" buttonText="Upload" @click="uploadVideo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { type FirebaseApp } from 'firebase/app'

export default defineComponent({
  name: 'record-preview-modal',
  components: {
    ButtonComponent
  },
  props: {
    recordedVideoUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const recordPreviewModalRef = ref<HTMLElement | null>(null)

    // create app variable to access Firebase Storage
    const app = inject<FirebaseApp>('firebaseApp')
    // Upload a video to Firebase Storage
    const uploadVideo = async () => {
      const storage = getStorage(app)
      const videoRef = storageRef(storage, 'videos/recorded-video.webm')
      const response = await fetch(props.recordedVideoUrl)
      const blob = await response.blob()
      await uploadBytes(videoRef, blob)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Video Uploaded Successfully',
            showConfirmButton: false,
            timer: 1500
          })
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong...It may be a server related problem. Try again!',
            footer: `<p>${error}</p>`
          })
        })
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

    onMounted(() => {
      if (recordPreviewModalRef.value) {
        recordPreviewModalRef.value.addEventListener('shown.bs.modal', () => {
          console.log('recordedVideoUrl: ', props.recordedVideoUrl)
        })
      }
    })

    return {
      recordPreviewModalRef,
      app,
      uploadVideo,
      downloadRecordedVideo
    }
  }
})
</script>
