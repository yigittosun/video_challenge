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
          <ButtonComponent btnClass="btn-success" buttonText="Save" @click="downloadRecordedVideo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

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

    const downloadRecordedVideo = () => {
      const a = document.createElement('a');
      a.href = props.recordedVideoUrl;
      a.download = 'recorded-video.webm';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    onMounted(() => {
      if (recordPreviewModalRef.value) {
        recordPreviewModalRef.value.addEventListener('shown.bs.modal', () => {
          console.log('recordedVideoUrl: ', props.recordedVideoUrl);
        });
      }
    });

    return {
      recordPreviewModalRef,
      downloadRecordedVideo
    }
  }
})
</script>

