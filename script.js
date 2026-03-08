document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FITUR MENAMPILKAN ANGGOTA DARI JSON
    // ==========================================
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Jaringan bermasalah atau file tidak ditemukan');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('member-container');
            
            data.anggota.forEach((nama, index) => {
                const card = document.createElement('div');
                card.className = 'member-card';
                card.innerHTML = `${index + 1}. ${nama}`; 
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Gagal memuat data anggota:', error);
            document.getElementById('member-container').innerHTML = 
                '<p style="color:red; text-align:center;">Gagal memuat daftar anggota. Pastikan kamu menjalankan web ini menggunakan Local Server.</p>';
        });


    // ==========================================
    // 2. FITUR SISTEM KOMENTAR CUSTOM + HAPUS
    // ==========================================
    const commentForm = document.getElementById('comment-form');
    const commentsGrid = document.getElementById('comments-grid');

    if (commentForm && commentsGrid) {
        
        // Fungsi menampilkan komentar
        function loadComments() {
            const savedComments = JSON.parse(localStorage.getItem('bajraComments')) || [];
            commentsGrid.innerHTML = ''; 
            
            // Looping komentar. Kita pakai 'index' untuk menandai mana yang mau dihapus
            savedComments.forEach((c, index) => {
                const commentBox = document.createElement('div');
                commentBox.className = 'comment-box';
                commentBox.innerHTML = `
                    <div class="comment-header">
                        <h4>👤 ${c.name}</h4>
                        <button class="btn-delete" data-index="${index}" title="Hapus Komentar">🗑️</button>
                    </div>
                    <p>"${c.text}"</p>
                    <span class="comment-date">📅 ${c.date}</span>
                `;
                
                // Tambahkan komentar ke dalam grid
                commentsGrid.prepend(commentBox); 
            });
        }

        loadComments();

        // Fungsi saat tombol "Kirim Komentar" ditekan
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const nameInput = document.getElementById('comment-name').value;
            const textInput = document.getElementById('comment-text').value;
            
            const newComment = {
                name: nameInput,
                text: textInput,
                date: new Date().toLocaleDateString('id-ID') 
            };

            const savedComments = JSON.parse(localStorage.getItem('bajraComments')) || [];
            savedComments.push(newComment);
            localStorage.setItem('bajraComments', JSON.stringify(savedComments));

            commentForm.reset();
            loadComments();
        });

        // Fungsi saat tombol "Hapus (🗑️)" ditekan
        commentsGrid.addEventListener('click', function(e) {
            // Cek apakah yang diklik adalah tombol hapus
            if (e.target.classList.contains('btn-delete')) {
                // Konfirmasi sebelum menghapus agar tidak kepencet
                const isConfirm = confirm("Apakah Anda yakin ingin menghapus komentar ini?");
                
                if (isConfirm) {
                    // Ambil nomor urut (index) dari tombol yang diklik
                    const indexToDelete = e.target.getAttribute('data-index');
                    
                    // Ambil data dari Local Storage
                    const savedComments = JSON.parse(localStorage.getItem('bajraComments')) || [];
                    
                    // Hapus 1 data pada index tersebut menggunakan splice
                    savedComments.splice(indexToDelete, 1);
                    
                    // Simpan kembali data yang baru ke Local Storage
                    localStorage.setItem('bajraComments', JSON.stringify(savedComments));
                    
                    // Muat ulang tampilan grid komentar
                    loadComments();
                }
            }
        });
    }

});