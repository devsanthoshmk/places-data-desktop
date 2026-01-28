<template>
    <div class="maintenance-overlay">
        <div class="maintenance-modal">
            <div class="card border-0 shadow-lg" style="max-width: 550px; border-radius: 16px;">
                <div class="card-body p-4 p-md-5 text-center">
                    <!-- Warning Icon -->
                    <div class="mb-4">
                        <div class="maintenance-icon mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-warning" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="fw-bold text-dark mb-3">Service Temporarily Unavailable</h3>

                    <!-- Alert Badge -->
                    <span class="badge bg-danger-subtle text-danger px-3 py-2 mb-4 d-inline-block" style="font-size: 0.85rem;">
                        <i class="fas fa-tools me-1"></i> Under Maintenance
                    </span>

                    <!-- Message -->
                    <p class="text-muted mb-4" style="line-height: 1.7;">
                        We regret to inform you that our live data extraction service is currently unavailable. 
                        Due to <strong>drastic changes in Google Maps backend infrastructure</strong> and the 
                        <strong>complete abandonment of their Business Listing website</strong> in 
                        <span class="text-danger fw-semibold">January 2026</span>, we are unable to fetch real-time business data at this time.
                    </p>

                    <hr class="my-4">

                    <!-- Sample Download Section -->
                    <div class="bg-light rounded-3 p-4 mb-4">
                        <div class="d-flex align-items-center justify-content-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-success me-2" viewBox="0 0 16 16">
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
                            </svg>
                            <span class="fw-semibold text-dark">Sample Data Available</span>
                        </div>
                        <p class="text-muted small mb-3">
                            Download our sample dataset to see the format and type of data we previously provided.
                        </p>
                        <a :href="sampleFileUrl" download="gift shop in vandavasi.xlsx" class="btn btn-success btn-lg px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                            </svg>
                            Download Sample
                        </a>
                    </div>

                    <!-- Close Button -->
                    <button @click="$emit('close')" class="btn btn-outline-secondary px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        Close
                    </button>

                    <!-- Footer Note -->
                    <p class="text-muted small mt-4 mb-0">
                        We appreciate your patience and understanding. 
                        <br>Stay tuned for updates on our 
                        <a href="https://github.com/devsanthoshmk/places-data" target="_blank" class="text-decoration-none">GitHub repository</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import sampleFile from '@/assets/sample-data/gift shop in vandavasi.xlsx?url';

export default {
    name: 'UnderMaintenance',
    emits: ['close'],
    data() {
        return {
            sampleFileUrl: sampleFile
        };
    }
};
</script>

<style scoped>
.maintenance-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 1rem;
}

.maintenance-modal {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.maintenance-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.bg-danger-subtle {
    background-color: rgba(220, 53, 69, 0.1) !important;
}
</style>
