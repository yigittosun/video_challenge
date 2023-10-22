<template>
  <div>
    <div class="modal fade" tabindex="-1" id="records_list_modal" ref="recordsListModalRef">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Records List</h3>

            <!--begin::Close-->
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="bi bi-x-lg h5"></i>
            </div>
            <!--end::Close-->
          </div>

          <div class="modal-body">
            <div v-if="isListLoading" class="spinner-border text-center" role="status"></div>
            <ul class="list-group">
              <li
                class="mb-2 list-group-item list-group-item-action"
                v-for="(videoURL, index) in videoURLs"
                :key="videoURL"
              >
                <div class="text-center">
                  <span
                    ><strong class="text-navy fs-5">Title: {{ videoTitles[index] }}</strong></span
                  >
                  <video
                    class="video-js vjs-default-skin vjs-big-play-centered"
                    controls
                    :data-setup="{ fluid: true }"
                  >
                    <source :src="videoURL" type="video/mp4" />
                  </video>
                </div>
              </li>
            </ul>
            <div>
              <p v-if="videoURLs.length === 0">There is no record.</p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getDownloadURL, listAll, getStorage, ref as storageRef } from 'firebase/storage'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'records-list-modal',
  components: {},
  setup() {
    const recordsListModalRef = ref<HTMLElement | null>(null)
    const storage = getStorage()
    const videoURLs = ref<string[]>([])
    const isListLoading = ref<boolean>(false)
    const videoTitles = ref<string[]>([])

    onMounted(() => {
      if (recordsListModalRef.value) {
        recordsListModalRef.value.addEventListener('shown.bs.modal', function () {
          listAllVideos()
        })
      }
    })

    const listAllVideos = async () => {
      const listRef = storageRef(storage, 'videos/')
      isListLoading.value = true

      try {
        const videoList = await listAll(listRef)

        const urls = await Promise.all(
          videoList.items.map(async (videoRef) => {
            const url = await getDownloadURL(videoRef)
            return url
          })
        )
        const titles = videoList.items.map((videoRef) => videoRef.name)

        isListLoading.value = false
        videoURLs.value = urls
        videoTitles.value = titles
      } catch (error) {
        videoURLs.value = []
        videoTitles.value = []
        isListLoading.value = false
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!'
        })
      }
    }

    return {
      recordsListModalRef,
      videoURLs,
      isListLoading,
      videoTitles,
      listAllVideos
    }
  }
})
</script>

<style>
@media (max-width: 768px) {
  video {
    max-width: 100%;
  }
}
</style>
